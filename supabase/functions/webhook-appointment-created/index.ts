import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting: 10 requests per minute per user
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  userLimit.count++;
  return { allowed: true };
}

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

    // Check rate limit
    const rateCheck = checkRateLimit(user.id);
    if (!rateCheck.allowed) {
      console.warn(`Rate limit exceeded for user ${user.id}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "Retry-After": String(rateCheck.retryAfter || 60)
          } 
        }
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

    const { appointment_id } = await req.json();

    if (!appointment_id) {
      return new Response(
        JSON.stringify({ error: "appointment_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the appointment belongs to user's business
    const { data: appointment, error: aptError } = await supabase
      .from("appointments")
      .select(`
        *,
        contact:contacts(*),
        lead:leads(*)
      `)
      .eq("id", appointment_id)
      .eq("business_id", profile.business_id)
      .single();

    if (aptError || !appointment) {
      console.error("Appointment not found or access denied:", aptError);
      return new Response(
        JSON.stringify({ error: "Appointment not found or access denied" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the configured webhook URL from webhook_settings
    const { data: webhookSettings, error: settingsError } = await supabase
      .from("webhook_settings")
      .select("webhook_url, enabled")
      .eq("business_id", profile.business_id)
      .eq("event_type", "appointment_created")
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
      event: "appointment_created",
      timestamp: new Date().toISOString(),
      data: {
        appointment_id: appointment.id,
        title: appointment.title,
        description: appointment.description,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        location: appointment.location,
        status: appointment.status,
        created_at: appointment.created_at,
        contact: appointment.contact ? {
          id: appointment.contact.id,
          first_name: appointment.contact.first_name,
          last_name: appointment.contact.last_name,
          email: appointment.contact.email,
          phone: appointment.contact.phone,
        } : null,
        lead: appointment.lead ? {
          id: appointment.lead.id,
          status: appointment.lead.status,
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
