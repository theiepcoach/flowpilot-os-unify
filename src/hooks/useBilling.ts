import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useBilling() {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutSession = async (planId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { plan_id: planId },
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      } else if (data.success) {
        toast.success('Plan updated successfully!');
        window.location.reload();
      } else if (data.message) {
        toast.info(data.message);
      }

      return data;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const openBillingPortal = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session');

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      } else if (data.message) {
        toast.info(data.message);
      }

      return data;
    } catch (error: any) {
      console.error('Portal error:', error);
      toast.error(error.message || 'Failed to open billing portal');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createCheckoutSession,
    openBillingPortal,
  };
}
