import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Automation = Tables<"automations">;

export const TRIGGER_TYPES = [
  { value: "lead_created", label: "Lead Created" },
  { value: "lead_status_changed", label: "Lead Status Changed" },
  { value: "appointment_scheduled", label: "Appointment Scheduled" },
  { value: "appointment_completed", label: "Appointment Completed" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "proposal_accepted", label: "Proposal Accepted" },
  { value: "transaction_created", label: "Transaction Created" },
  { value: "message_received", label: "Message Received" },
] as const;

export function useAutomations() {
  return useQuery({
    queryKey: ["automations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Automation[];
    },
  });
}

export function useCreateAutomation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<"automations">, "business_id">) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id")
        .single();

      if (!profile?.business_id) {
        throw new Error("No business found");
      }

      const { data: automation, error } = await supabase
        .from("automations")
        .insert({ ...data, business_id: profile.business_id })
        .select()
        .single();

      if (error) throw error;
      return automation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automation created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create automation: ${error.message}`);
    },
  });
}

export function useUpdateAutomation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TablesUpdate<"automations">;
    }) => {
      const { data: automation, error } = await supabase
        .from("automations")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return automation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automation updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update automation: ${error.message}`);
    },
  });
}

export function useToggleAutomation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { data: automation, error } = await supabase
        .from("automations")
        .update({ active, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return automation;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success(data.active ? "Automation enabled" : "Automation disabled");
    },
    onError: (error) => {
      toast.error(`Failed to toggle automation: ${error.message}`);
    },
  });
}

export function useDeleteAutomation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("automations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automation deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete automation: ${error.message}`);
    },
  });
}
