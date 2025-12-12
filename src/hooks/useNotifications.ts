import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useEffect } from "react";
import { toast } from "sonner";

interface Notification {
  id: string;
  business_id: string;
  user_id: string | null;
  type: string;
  title: string;
  message: string | null;
  data: Record<string, unknown> | null;
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id")
        .eq("id", user?.id)
        .single();

      if (!profile?.business_id) return [];

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("business_id", profile.business_id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id")
        .eq("id", user?.id)
        .single();

      if (!profile?.business_id) return;

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("business_id", profile.business_id)
        .eq("read", false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const notification = payload.new as Notification;
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          
          // Show toast for new notification
          toast(notification.title, {
            description: notification.message || undefined,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
  };
};

export const useCreateNotification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: {
      type: string;
      title: string;
      message?: string;
      data?: Record<string, unknown>;
    }) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id")
        .eq("id", user?.id)
        .single();

      if (!profile?.business_id) throw new Error("No business found");

      const { data, error } = await supabase
        .from("notifications")
        .insert([{
          business_id: profile.business_id,
          user_id: user?.id,
          type: notification.type,
          title: notification.title,
          message: notification.message || null,
          data: notification.data ? JSON.parse(JSON.stringify(notification.data)) : null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
