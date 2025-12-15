import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;

    // If Stripe is configured, verify the webhook signature
    if (stripeSecretKey && webhookSecret && signature) {
      const Stripe = (await import("https://esm.sh/stripe@14.21.0")).default;
      const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });
      
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("Webhook signature verification failed:", message);
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      // For testing without Stripe, parse the body directly
      event = JSON.parse(body);
      console.log("Warning: Stripe not fully configured, processing webhook without signature verification");
    }

    console.log(`Processing webhook event: ${event.type} (${event.id})`);

    // Check for idempotency
    const { data: existingEvent } = await supabase
      .from("billing_events")
      .select("id")
      .eq("stripe_event_id", event.id)
      .single();

    if (existingEvent) {
      console.log(`Event ${event.id} already processed, skipping`);
      return new Response(JSON.stringify({ received: true, skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Helper function to map Stripe price ID to plan ID
    async function mapPriceToPlan(stripePriceId: string): Promise<string | null> {
      const { data: plan } = await supabase
        .from("plans")
        .select("id")
        .eq("stripe_price_id", stripePriceId)
        .single();
      return plan?.id || null;
    }

    // Helper function to update subscription
    async function upsertSubscription(
      businessId: string,
      stripeSubscriptionId: string,
      stripePriceId: string,
      status: string,
      currentPeriodStart: number,
      currentPeriodEnd: number,
      trialEnd: number | null,
      cancelAtPeriodEnd: boolean
    ) {
      const planId = await mapPriceToPlan(stripePriceId);
      if (!planId) {
        console.error(`Could not map price ${stripePriceId} to a plan`);
        return;
      }

      const subscriptionData = {
        business_id: businessId,
        stripe_subscription_id: stripeSubscriptionId,
        stripe_price_id: stripePriceId,
        plan_id: planId,
        status: status,
        current_period_start: new Date(currentPeriodStart * 1000).toISOString(),
        current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
        trial_ends_at: trialEnd ? new Date(trialEnd * 1000).toISOString() : null,
        cancel_at_period_end: cancelAtPeriodEnd,
        updated_at: new Date().toISOString(),
      };

      // Try to update by stripe_subscription_id first
      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("stripe_subscription_id", stripeSubscriptionId)
        .single();

      if (existingSub) {
        await supabase
          .from("subscriptions")
          .update(subscriptionData)
          .eq("stripe_subscription_id", stripeSubscriptionId);
      } else {
        // Check if business has any subscription
        const { data: businessSub } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("business_id", businessId)
          .single();

        if (businessSub) {
          await supabase
            .from("subscriptions")
            .update(subscriptionData)
            .eq("business_id", businessId);
        } else {
          await supabase.from("subscriptions").insert(subscriptionData);
        }
      }

      console.log(`Subscription upserted for business ${businessId}: ${planId} (${status})`);
    }

    // Process the event
    let businessId: string | null = null;

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        businessId = session.metadata?.business_id;
        
        if (businessId) {
          // Update checkout session status
          await supabase
            .from("checkout_sessions")
            .update({ status: "completed" })
            .eq("stripe_session_id", session.id);

          console.log(`Checkout session ${session.id} completed for business ${businessId}`);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Get business by customer ID
        const { data: business } = await supabase
          .from("businesses")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (business) {
          businessId = business.id;
          const priceId = subscription.items.data[0]?.price?.id;
          
          if (priceId && businessId) {
            await upsertSubscription(
              businessId as string,
              subscription.id,
              priceId,
              subscription.status,
              subscription.current_period_start,
              subscription.current_period_end,
              subscription.trial_end,
              subscription.cancel_at_period_end
            );
          }
        } else {
          console.error(`Business not found for customer ${customerId}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const { data: business } = await supabase
          .from("businesses")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (business) {
          businessId = business.id;
          await supabase
            .from("subscriptions")
            .update({ 
              status: "canceled",
              updated_at: new Date().toISOString()
            })
            .eq("stripe_subscription_id", subscription.id);

          console.log(`Subscription ${subscription.id} canceled for business ${businessId}`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        console.log(`Payment succeeded for invoice ${invoice.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          await supabase
            .from("subscriptions")
            .update({ 
              status: "past_due",
              updated_at: new Date().toISOString()
            })
            .eq("stripe_subscription_id", subscriptionId);

          console.log(`Payment failed for subscription ${subscriptionId}, status set to past_due`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Record the event for idempotency
    await supabase.from("billing_events").insert({
      business_id: businessId || undefined,
      stripe_event_id: event.id,
      event_type: event.type,
      payload: event.data.object,
    });

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
