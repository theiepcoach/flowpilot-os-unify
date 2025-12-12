import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { webhook_url, proposal_id, old_status, new_status } = await req.json();

    if (!webhook_url) {
      return new Response(
        JSON.stringify({ error: "webhook_url is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch proposal data with contact and lead info
    const { data: proposal, error: propError } = await supabase
      .from("proposals")
      .select(`
        *,
        contact:contacts(*),
        lead:leads(*)
      `)
      .eq("id", proposal_id)
      .single();

    if (propError || !proposal) {
      console.error("Error fetching proposal:", propError);
      return new Response(
        JSON.stringify({ error: "Proposal not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send webhook to Make.com
    const webhookPayload = {
      event: "proposal_status_changed",
      timestamp: new Date().toISOString(),
      data: {
        proposal_id: proposal.id,
        title: proposal.title,
        amount: proposal.amount,
        old_status: old_status,
        new_status: new_status,
        viewed_at: proposal.viewed_at,
        signed_at: proposal.signed_at,
        created_at: proposal.created_at,
        updated_at: proposal.updated_at,
        contact: proposal.contact ? {
          id: proposal.contact.id,
          first_name: proposal.contact.first_name,
          last_name: proposal.contact.last_name,
          email: proposal.contact.email,
          phone: proposal.contact.phone,
        } : null,
        lead: proposal.lead ? {
          id: proposal.lead.id,
          status: proposal.lead.status,
        } : null,
      },
    };

    console.log("Sending webhook to:", webhook_url);
    console.log("Payload:", JSON.stringify(webhookPayload));

    const webhookResponse = await fetch(webhook_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      console.error("Webhook failed:", webhookResponse.status);
      return new Response(
        JSON.stringify({ error: "Webhook delivery failed", status: webhookResponse.status }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Webhook sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Webhook sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
