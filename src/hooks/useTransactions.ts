import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Transaction = Tables<"transactions"> & {
  contact?: Tables<"contacts"> | null;
};

export type TransactionType = "revenue" | "expense";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`*, contact:contacts(*)`)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
  });
}

export function useTransactionStats() {
  const { data: transactions, ...rest } = useTransactions();

  const stats = {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    revenueByCategory: {} as Record<string, number>,
    expensesByCategory: {} as Record<string, number>,
  };

  if (transactions) {
    transactions.forEach((tx) => {
      if (tx.type === "revenue") {
        stats.totalRevenue += Number(tx.amount);
        const cat = tx.category || "Uncategorized";
        stats.revenueByCategory[cat] = (stats.revenueByCategory[cat] || 0) + Number(tx.amount);
      } else {
        stats.totalExpenses += Number(tx.amount);
        const cat = tx.category || "Uncategorized";
        stats.expensesByCategory[cat] = (stats.expensesByCategory[cat] || 0) + Number(tx.amount);
      }
    });
    stats.netProfit = stats.totalRevenue - stats.totalExpenses;
  }

  return { stats, transactions, ...rest };
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<"transactions">, "business_id">) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id")
        .single();

      if (!profile?.business_id) {
        throw new Error("No business found");
      }

      const { data: transaction, error } = await supabase
        .from("transactions")
        .insert({ ...data, business_id: profile.business_id })
        .select()
        .single();

      if (error) throw error;
      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction added successfully");
    },
    onError: (error) => {
      toast.error(`Failed to add transaction: ${error.message}`);
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TablesUpdate<"transactions">;
    }) => {
      const { data: transaction, error } = await supabase
        .from("transactions")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update transaction: ${error.message}`);
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete transaction: ${error.message}`);
    },
  });
}
