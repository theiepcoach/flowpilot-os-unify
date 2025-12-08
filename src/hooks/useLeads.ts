import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Lead = Tables<"leads"> & {
  contact: Tables<"contacts"> | null;
};

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select(`
          *,
          contact:contacts(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Lead[];
    },
  });
}

export function useLeadsByStatus() {
  const { data: leads, ...rest } = useLeads();

  const leadsByStatus = {
    new: leads?.filter((l) => l.status === "new") || [],
    contacted: leads?.filter((l) => l.status === "contacted") || [],
    qualified: leads?.filter((l) => l.status === "qualified") || [],
    won: leads?.filter((l) => l.status === "won") || [],
    lost: leads?.filter((l) => l.status === "lost") || [],
  };

  return { leadsByStatus, leads, ...rest };
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      contact: Omit<TablesInsert<"contacts">, "business_id">;
      lead: Omit<TablesInsert<"leads">, "contact_id" | "business_id">;
    }) => {
      // First get the user's business_id
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id")
        .single();

      if (!profile?.business_id) {
        throw new Error("No business found. Please complete your profile setup.");
      }

      // Create contact first
      const { data: contact, error: contactError } = await supabase
        .from("contacts")
        .insert({ ...data.contact, business_id: profile.business_id })
        .select()
        .single();

      if (contactError) throw contactError;

      // Create lead with contact reference
      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .insert({
          ...data.lead,
          contact_id: contact.id,
          business_id: profile.business_id,
        })
        .select(`*, contact:contacts(*)`)
        .single();

      if (leadError) throw leadError;
      return lead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create lead: ${error.message}`);
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TablesUpdate<"leads">;
    }) => {
      const { data: lead, error } = await supabase
        .from("leads")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select(`*, contact:contacts(*)`)
        .single();

      if (error) throw error;
      return lead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update lead: ${error.message}`);
    },
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: LeadStatus;
    }) => {
      const { data: lead, error } = await supabase
        .from("leads")
        .update({ 
          status, 
          updated_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString()
        })
        .eq("id", id)
        .select(`*, contact:contacts(*)`)
        .single();

      if (error) throw error;
      return lead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error) => {
      toast.error(`Failed to update lead status: ${error.message}`);
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete lead: ${error.message}`);
    },
  });
}
