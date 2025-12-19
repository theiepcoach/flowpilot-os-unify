import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validate webhook URL to prevent SSRF attacks
function isValidWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const hostname = parsed.hostname.toLowerCase();
    // Block localhost and private IPs
    if (hostname === "localhost" || hostname === "127.0.0.1") return false;
    if (hostname.startsWith("10.") || hostname.startsWith("192.168.")) return false;
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) return false;
    if (hostname.startsWith("169.254.")) return false;
    if (hostname === "0.0.0.0") return false;
    return true;
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create client with user's auth to verify their identity
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create service client for data operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's business_id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("business_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.business_id) {
      console.error("Profile error:", profileError);
      return new Response(
        JSON.stringify({ error: "No business found for user" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { proposal_id, old_status, new_status } = await req.json();

    if (!proposal_id) {
      return new Response(
        JSON.stringify({ error: "proposal_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the proposal belongs to user's business
    const { data: proposal, error: propError } = await supabase
      .from("proposals")
      .select(`
        *,
        contact:contacts(*),
        lead:leads(*)
      `)
      .eq("id", proposal_id)
      .eq("business_id", profile.business_id)
      .single();

    if (propError || !proposal) {
      console.error("Proposal not found or access denied:", propError);
      return new Response(
        JSON.stringify({ error: "Proposal not found or access denied" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the configured webhook URL from webhook_settings
    const { data: webhookSettings, error: settingsError } = await supabase
      .from("webhook_settings")
      .select("webhook_url, enabled")
      .eq("business_id", profile.business_id)
      .eq("event_type", "proposal_status_changed")
      .single();

    if (settingsError || !webhookSettings?.enabled || !webhookSettings?.webhook_url) {
      console.error("Webhook not configured or disabled:", settingsError);
      return new Response(
        JSON.stringify({ error: "Webhook not configured or disabled" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const webhook_url = webhookSettings.webhook_url;

    // Validate the webhook URL
    if (!isValidWebhookUrl(webhook_url)) {
      console.error("Invalid webhook URL:", webhook_url);
      return new Response(
        JSON.stringify({ error: "Invalid webhook URL - must be HTTPS and external" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build webhook payload
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
