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
    const { webhook_url, appointment_id } = await req.json();

    if (!webhook_url) {
      return new Response(
        JSON.stringify({ error: "webhook_url is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch appointment data with contact and lead info
    const { data: appointment, error: aptError } = await supabase
      .from("appointments")
      .select(`
        *,
        contact:contacts(*),
        lead:leads(*)
      `)
      .eq("id", appointment_id)
      .single();

    if (aptError || !appointment) {
      console.error("Error fetching appointment:", aptError);
      return new Response(
        JSON.stringify({ error: "Appointment not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send webhook to Make.com
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
