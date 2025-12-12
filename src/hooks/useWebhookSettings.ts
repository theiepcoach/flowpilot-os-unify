import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface WebhookSetting {
  id: string;
  business_id: string;
  event_type: string;
  webhook_url: string | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const EVENT_TYPES = [
  { key: "lead_created", label: "Lead Created", description: "Triggered when a new lead is added" },
  { key: "lead_status_changed", label: "Lead Status Changed", description: "Triggered when a lead moves to a new stage" },
  { key: "appointment_created", label: "Appointment Created", description: "Triggered when a new appointment is booked" },
  { key: "proposal_status_changed", label: "Proposal Status Changed", description: "Triggered when a proposal status updates" },
  { key: "message_received", label: "Message Received", description: "Triggered when a new message comes in" },
  { key: "transaction_created", label: "Transaction Created", description: "Triggered when revenue/expense is logged" },
] as const;

export const useWebhookSettings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["webhook-settings"],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id")
        .eq("id", user?.id)
        .single();

      if (!profile?.business_id) return [];

      const { data, error } = await supabase
        .from("webhook_settings")
        .select("*")
        .eq("business_id", profile.business_id);

      if (error) throw error;
      return data as WebhookSetting[];
    },
    enabled: !!user,
  });
};

export const useUpsertWebhookSetting = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      event_type,
      webhook_url,
      enabled,
    }: {
      event_type: string;
      webhook_url: string;
      enabled: boolean;
    }) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id")
        .eq("id", user?.id)
        .single();

      if (!profile?.business_id) throw new Error("No business found");

      const { data, error } = await supabase
        .from("webhook_settings")
        .upsert(
          {
            business_id: profile.business_id,
            event_type,
            webhook_url,
            enabled,
          },
          { onConflict: "business_id,event_type" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhook-settings"] });
      toast.success("Webhook setting saved");
    },
    onError: (error) => {
      toast.error("Failed to save webhook setting");
      console.error(error);
    },
  });
};

export const useTestWebhook = () => {
  return useMutation({
    mutationFn: async ({
      event_type,
      webhook_url,
    }: {
      event_type: string;
      webhook_url: string;
    }) => {
      const testPayload = {
        event: event_type,
        test: true,
        timestamp: new Date().toISOString(),
        data: {
          message: `This is a test webhook for ${event_type}`,
        },
      };

      const response = await fetch(webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify(testPayload),
      });

      return { success: true };
    },
    onSuccess: () => {
      toast.success("Test webhook sent! Check your Make.com scenario.");
    },
    onError: (error) => {
      toast.error("Failed to send test webhook");
      console.error(error);
    },
  });
};
