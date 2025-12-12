import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Appointment = Tables<"appointments"> & {
  contact: Tables<"contacts"> | null;
  lead: Tables<"leads"> | null;
};

export type AppointmentStatus = "scheduled" | "completed" | "no_show" | "cancelled";

export function useAppointments(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ["appointments", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from("appointments")
        .select(`
          *,
          contact:contacts(*),
          lead:leads(*)
        `)
        .order("start_time", { ascending: true });

      if (startDate) {
        query = query.gte("start_time", startDate.toISOString());
      }
      if (endDate) {
        query = query.lte("start_time", endDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Appointment[];
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<"appointments">, "business_id">) => {
      // First get the user's business_id
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id")
        .single();

      if (!profile?.business_id) {
        throw new Error("No business found. Please complete your profile setup.");
      }

      const { data: appointment, error } = await supabase
        .from("appointments")
        .insert({ ...data, business_id: profile.business_id })
        .select(`*, contact:contacts(*), lead:leads(*)`)
        .single();

      if (error) throw error;
      return appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create appointment: ${error.message}`);
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TablesUpdate<"appointments">;
    }) => {
      const { data: appointment, error } = await supabase
        .from("appointments")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select(`*, contact:contacts(*), lead:leads(*)`)
        .single();

      if (error) throw error;
      return appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update appointment: ${error.message}`);
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: AppointmentStatus;
    }) => {
      const { data: appointment, error } = await supabase
        .from("appointments")
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", id)
        .select(`*, contact:contacts(*), lead:leads(*)`)
        .single();

      if (error) throw error;
      return appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error) => {
      toast.error(`Failed to update appointment status: ${error.message}`);
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete appointment: ${error.message}`);
    },
  });
}
