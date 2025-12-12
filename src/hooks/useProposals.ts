import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Proposal = Tables<"proposals"> & {
  contact: Tables<"contacts"> | null;
  lead: Tables<"leads"> | null;
};

export type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "rejected";

export function useProposals() {
  return useQuery({
    queryKey: ["proposals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("proposals")
        .select(`*, contact:contacts(*), lead:leads(*)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Proposal[];
    },
  });
}

export function useProposalStats() {
  const { data: proposals, ...rest } = useProposals();

  const stats = {
    total: proposals?.length || 0,
    draft: proposals?.filter((p) => p.status === "draft").length || 0,
    sent: proposals?.filter((p) => p.status === "sent").length || 0,
    viewed: proposals?.filter((p) => p.status === "viewed").length || 0,
    accepted: proposals?.filter((p) => p.status === "accepted").length || 0,
    rejected: proposals?.filter((p) => p.status === "rejected").length || 0,
    totalValue: proposals?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
    acceptedValue: proposals?.filter((p) => p.status === "accepted").reduce((sum, p) => sum + Number(p.amount), 0) || 0,
  };

  return { stats, proposals, ...rest };
}

export function useCreateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<"proposals">, "business_id">) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id")
        .single();

      if (!profile?.business_id) {
        throw new Error("No business found");
      }

      const { data: proposal, error } = await supabase
        .from("proposals")
        .insert({ ...data, business_id: profile.business_id })
        .select(`*, contact:contacts(*), lead:leads(*)`)
        .single();

      if (error) throw error;
      return proposal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Proposal created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create proposal: ${error.message}`);
    },
  });
}

export function useUpdateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TablesUpdate<"proposals">;
    }) => {
      const { data: proposal, error } = await supabase
        .from("proposals")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select(`*, contact:contacts(*), lead:leads(*)`)
        .single();

      if (error) throw error;
      return proposal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Proposal updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update proposal: ${error.message}`);
    },
  });
}

export function useUpdateProposalStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ProposalStatus }) => {
      const updates: TablesUpdate<"proposals"> = { 
        status, 
        updated_at: new Date().toISOString() 
      };

      if (status === "viewed" || status === "accepted" || status === "rejected") {
        updates.viewed_at = updates.viewed_at || new Date().toISOString();
      }
      if (status === "accepted") {
        updates.signed_at = new Date().toISOString();
      }

      const { data: proposal, error } = await supabase
        .from("proposals")
        .update(updates)
        .eq("id", id)
        .select(`*, contact:contacts(*), lead:leads(*)`)
        .single();

      if (error) throw error;
      return proposal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Proposal status updated");
    },
    onError: (error) => {
      toast.error(`Failed to update proposal: ${error.message}`);
    },
  });
}

export function useDeleteProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("proposals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Proposal deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete proposal: ${error.message}`);
    },
  });
}
