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

    // Check if user already has a business
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("business_id")
      .eq("id", user.id)
      .single();

    if (existingProfile?.business_id) {
      console.error("User already has a business");
      return new Response(
        JSON.stringify({ error: "User already has a business" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user already has an owner role
    const { data: existingRole } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", user.id)
      .eq("role", "owner")
      .single();

    if (existingRole) {
      console.error("User already has owner role");
      return new Response(
        JSON.stringify({ error: "User already has an owner role" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { business_name, industry, timezone, plan_id } = await req.json();

    // Validate business name
    if (!business_name || typeof business_name !== "string" || business_name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Business name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (business_name.length > 255) {
      return new Response(
        JSON.stringify({ error: "Business name too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the business
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .insert({
        name: business_name.trim(),
        industry: industry || null,
        timezone: timezone || "America/New_York",
      })
      .select()
      .single();

    if (businessError) {
      console.error("Error creating business:", businessError);
      return new Response(
        JSON.stringify({ error: "Failed to create business" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update the profile with business_id
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ business_id: business.id })
      .eq("id", user.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      // Rollback: delete the business
      await supabase.from("businesses").delete().eq("id", business.id);
      return new Response(
        JSON.stringify({ error: "Failed to link business to profile" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create owner role - server assigns the role, not the client
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: user.id, role: "owner" });

    if (roleError) {
      console.error("Error creating role:", roleError);
      // Rollback: reset profile and delete business
      await supabase.from("profiles").update({ business_id: null }).eq("id", user.id);
      await supabase.from("businesses").delete().eq("id", business.id);
      return new Response(
        JSON.stringify({ error: "Failed to assign owner role" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create subscription
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 7);
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const validPlanIds = ["free", "starter", "pro", "enterprise"];
    const planToUse = validPlanIds.includes(plan_id) ? plan_id : "pro";

    const { error: subError } = await supabase
      .from("subscriptions")
      .insert({
        business_id: business.id,
        plan_id: planToUse,
        status: planToUse === "pro" ? "trialing" : "active",
        trial_ends_at: planToUse === "pro" ? trialEnd.toISOString() : null,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
      });

    if (subError) {
      console.error("Error creating subscription:", subError);
      // Non-critical, continue
    }

    // Create initial usage counters
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    await supabase.from("usage_counters").insert({
      business_id: business.id,
      period_start: monthStart.toISOString().split("T")[0],
      period_end: monthEnd.toISOString().split("T")[0],
      counters: {
        leads: 0,
        messages: 0,
        automations_active: 0,
        team_members: 1,
        proposals_sent: 0,
        reports_generated: 0,
      },
    });

    console.log("Business created successfully:", business.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        business_id: business.id,
        message: "Business created successfully" 
      }),
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
