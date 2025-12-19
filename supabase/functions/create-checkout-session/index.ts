import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase client with user's auth
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get current user
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get request body
    const { plan_id } = await req.json();
    if (!plan_id) {
      return new Response(JSON.stringify({ error: "plan_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user's profile and business
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("business_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.business_id) {
      return new Response(JSON.stringify({ error: "Business not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const businessId = profile.business_id;

    // Get the plan details
    const { data: plan, error: planError } = await supabaseClient
      .from("plans")
      .select("*")
      .eq("id", plan_id)
      .single();

    if (planError || !plan) {
      return new Response(JSON.stringify({ error: "Plan not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get or create Stripe customer
    const { data: business, error: businessError } = await supabaseClient
      .from("businesses")
      .select("stripe_customer_id, name, billing_email")
      .eq("id", businessId)
      .single();

    if (businessError || !business) {
      return new Response(JSON.stringify({ error: "Business not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if Stripe is configured
    if (!stripeSecretKey) {
      console.log("Stripe not configured, returning mock checkout URL");
      
      // Create a mock checkout session record
      await supabaseClient.from("checkout_sessions").insert({
        business_id: businessId,
        plan_id: plan_id,
        stripe_session_id: `mock_session_${Date.now()}`,
        status: "created",
      });

      // For demo purposes, directly update the subscription
      const { data: existingSub } = await supabaseClient
        .from("subscriptions")
        .select("id")
        .eq("business_id", businessId)
        .single();

      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      if (existingSub) {
        await supabaseClient
          .from("subscriptions")
          .update({
            plan_id: plan_id,
            status: "active",
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq("business_id", businessId);
      } else {
        await supabaseClient.from("subscriptions").insert({
          business_id: businessId,
          plan_id: plan_id,
          status: "active",
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        });
      }

      return new Response(
        JSON.stringify({ 
          url: null, 
          message: "Stripe not configured. Plan updated directly for demo.",
          success: true 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Stripe is configured - create real checkout session
    const Stripe = (await import("https://esm.sh/stripe@14.21.0")).default;
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });

    let customerId = business.stripe_customer_id;

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: business.billing_email || user.email,
        name: business.name,
        metadata: { business_id: businessId },
      });
      customerId = customer.id;

      // Save customer ID to business
      await supabaseClient
        .from("businesses")
        .update({ 
          stripe_customer_id: customerId,
          billing_email: business.billing_email || user.email 
        })
        .eq("id", businessId);
    }

    // Check if this is a new business (never had active subscription)
    const { data: existingSubscription } = await supabaseClient
      .from("subscriptions")
      .select("status")
      .eq("business_id", businessId)
      .in("status", ["active", "canceled"])
      .single();

    const isNewBusiness = !existingSubscription;
    const shouldApplyTrial = isNewBusiness && plan_id === "pro";

    const siteUrl = Deno.env.get("SITE_URL") || "https://yhdlplaxkbsauarnqzeg.lovableproject.com";

    // Create checkout session
    const sessionConfig: any = {
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      success_url: `${siteUrl}/app/billing?checkout=success`,
      cancel_url: `${siteUrl}/pricing?checkout=cancel`,
      metadata: {
        business_id: businessId,
        plan_id: plan_id,
      },
    };

    if (shouldApplyTrial) {
      sessionConfig.subscription_data = { trial_period_days: 7 };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Record checkout session
    await supabaseClient.from("checkout_sessions").insert({
      business_id: businessId,
      plan_id: plan_id,
      stripe_session_id: session.id,
      status: "created",
    });

    console.log(`Checkout session created: ${session.id} for business ${businessId}`);

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error creating checkout session:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
