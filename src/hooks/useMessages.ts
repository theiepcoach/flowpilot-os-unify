import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Message = Tables<"messages"> & {
  contact: Tables<"contacts"> | null;
};

export type MessageChannel = "sms" | "email" | "instagram" | "facebook";
export type MessageDirection = "sent" | "received";

export function useMessages() {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`*, contact:contacts(*)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Message[];
    },
  });
}

export function useConversations() {
  const { data: messages, ...rest } = useMessages();

  // Group messages by contact
  const conversationsMap = new Map<string, {
    contact: Tables<"contacts">;
    messages: Message[];
    lastMessage: Message;
    unreadCount: number;
  }>();

  messages?.forEach((msg) => {
    if (!msg.contact) return;
    
    const existing = conversationsMap.get(msg.contact_id);
    if (existing) {
      existing.messages.push(msg);
      if (!msg.read && msg.direction === "received") {
        existing.unreadCount++;
      }
      if (new Date(msg.created_at) > new Date(existing.lastMessage.created_at)) {
        existing.lastMessage = msg;
      }
    } else {
      conversationsMap.set(msg.contact_id, {
        contact: msg.contact,
        messages: [msg],
        lastMessage: msg,
        unreadCount: !msg.read && msg.direction === "received" ? 1 : 0,
      });
    }
  });

  const conversations = Array.from(conversationsMap.values())
    .sort((a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime());

  return { conversations, messages, ...rest };
}

export function useCreateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<"messages">, "business_id">) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id")
        .single();

      if (!profile?.business_id) {
        throw new Error("No business found");
      }

      const { data: message, error } = await supabase
        .from("messages")
        .insert({ ...data, business_id: profile.business_id })
        .select(`*, contact:contacts(*)`)
        .single();

      if (error) throw error;
      return message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });
}

export function useMarkMessageRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}
