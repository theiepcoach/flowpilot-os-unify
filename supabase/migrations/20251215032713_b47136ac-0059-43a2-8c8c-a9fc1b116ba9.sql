-- Add Stripe columns to businesses table
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS billing_email text;

-- Add stripe_price_id to plans table
ALTER TABLE public.plans 
ADD COLUMN IF NOT EXISTS stripe_price_id text;

-- Add Stripe columns to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS stripe_subscription_id text UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_price_id text,
ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean DEFAULT false;

-- Create checkout_sessions table
CREATE TABLE IF NOT EXISTS public.checkout_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  plan_id text NOT NULL,
  stripe_session_id text UNIQUE,
  status text NOT NULL DEFAULT 'created',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create billing_events table for webhook idempotency
CREATE TABLE IF NOT EXISTS public.billing_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid REFERENCES public.businesses(id) ON DELETE SET NULL,
  stripe_event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  payload jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for checkout_sessions
CREATE POLICY "Users can view their business checkout sessions"
ON public.checkout_sessions FOR SELECT
USING (business_id = get_user_business_id(auth.uid()));

CREATE POLICY "Users can insert their business checkout sessions"
ON public.checkout_sessions FOR INSERT
WITH CHECK (business_id = get_user_business_id(auth.uid()));

-- RLS policies for billing_events (admin/service role only for inserts, users can view their own)
CREATE POLICY "Users can view their business billing events"
ON public.billing_events FOR SELECT
USING (business_id = get_user_business_id(auth.uid()));

-- Update plans with placeholder Stripe price IDs
UPDATE public.plans SET stripe_price_id = 'price_solo_placeholder' WHERE id = 'solo';
UPDATE public.plans SET stripe_price_id = 'price_pro_placeholder' WHERE id = 'pro';
UPDATE public.plans SET stripe_price_id = 'price_enterprise_placeholder' WHERE id = 'enterprise';