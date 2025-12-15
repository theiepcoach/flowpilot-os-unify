import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  included_modules: string[];
  limits: {
    leads: number;
    messages: number;
    automations_active: number;
    team_members: number;
    proposals_sent: number;
    reports_generated: number;
  };
}

export interface Subscription {
  id: string;
  business_id: string;
  plan_id: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled';
  trial_ends_at: string | null;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  cancel_at_period_end?: boolean;
  stripe_subscription_id?: string | null;
  stripe_price_id?: string | null;
}

export interface UsageCounters {
  id: string;
  business_id: string;
  period_start: string;
  period_end: string;
  counters: {
    leads: number;
    messages: number;
    automations_active: number;
    team_members: number;
    proposals_sent: number;
    reports_generated: number;
  };
}

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      return data as unknown as Plan[];
    },
  });
}

export function useSubscription() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Get user's business_id first
      const { data: profile } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();

      if (!profile?.business_id) return null;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('business_id', profile.business_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as Subscription | null;
    },
    enabled: !!user?.id,
  });
}

export function useCurrentPlan() {
  const { data: subscription } = useSubscription();
  const { data: plans } = usePlans();

  const currentPlan = plans?.find(p => p.id === (subscription?.plan_id || 'pro'));
  return { plan: currentPlan, subscription };
}

export function useUsageCounters() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['usage-counters', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();

      if (!profile?.business_id) return null;

      const { data, error } = await supabase
        .from('usage_counters')
        .select('*')
        .eq('business_id', profile.business_id)
        .order('period_start', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as unknown as UsageCounters | null;
    },
    enabled: !!user?.id,
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ planId }: { planId: string }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();

      if (!profile?.business_id) throw new Error('No business found');

      // Check if subscription exists
      const { data: existing } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('business_id', profile.business_id)
        .single();

      if (existing) {
        // Update existing subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({
            plan_id: planId,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new subscription
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            business_id: profile.business_id,
            plan_id: planId,
            status: 'active',
            trial_ends_at: null,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast.success('Plan updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update plan: ' + error.message);
    },
  });
}

export function useModuleAccess() {
  const { plan, subscription } = useCurrentPlan();
  const { data: usage } = useUsageCounters();

  const hasModuleAccess = (moduleId: string): boolean => {
    if (!plan) return false;
    return plan.included_modules.includes(moduleId);
  };

  const isTrialing = subscription?.status === 'trialing';
  const trialEndsAt = subscription?.trial_ends_at ? new Date(subscription.trial_ends_at) : null;
  const daysLeftInTrial = trialEndsAt 
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const getUsagePercentage = (type: keyof UsageCounters['counters']): number => {
    if (!plan || !usage) return 0;
    const limit = plan.limits[type];
    const current = usage.counters[type] || 0;
    if (limit >= 999999) return 0; // unlimited
    return Math.min(100, (current / limit) * 100);
  };

  const isAtLimit = (type: keyof UsageCounters['counters']): boolean => {
    return getUsagePercentage(type) >= 100;
  };

  const isNearLimit = (type: keyof UsageCounters['counters']): boolean => {
    return getUsagePercentage(type) >= 80;
  };

  return {
    plan,
    subscription,
    usage,
    hasModuleAccess,
    isTrialing,
    daysLeftInTrial,
    getUsagePercentage,
    isAtLimit,
    isNearLimit,
  };
}
