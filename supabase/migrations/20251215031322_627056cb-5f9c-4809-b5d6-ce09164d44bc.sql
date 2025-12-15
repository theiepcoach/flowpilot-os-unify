-- Create plans table with tier definitions
CREATE TABLE public.plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  price_monthly numeric NOT NULL DEFAULT 0,
  included_modules jsonb NOT NULL DEFAULT '[]'::jsonb,
  limits jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on plans (public read for pricing page)
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view plans" ON public.plans FOR SELECT USING (true);

-- Insert the three pricing tiers
INSERT INTO public.plans (id, name, price_monthly, included_modules, limits) VALUES
('solo', 'Solo', 79, 
  '["leadpilot", "schedulepilot", "inboxpilot_lite", "proposalpilot", "retainpilot_lite"]'::jsonb,
  '{"leads": 300, "messages": 1500, "automations_active": 3, "team_members": 1, "proposals_sent": 30, "reports_generated": 4}'::jsonb
),
('pro', 'Pro', 199, 
  '["leadpilot", "schedulepilot", "inboxpilot", "proposalpilot", "retainpilot", "automatepilot", "teampilot", "financepilot", "marketingpilot", "insightpilot"]'::jsonb,
  '{"leads": 2000, "messages": 10000, "automations_active": 25, "team_members": 5, "proposals_sent": 200, "reports_generated": 30}'::jsonb
),
('enterprise', 'Enterprise', 349, 
  '["leadpilot", "schedulepilot", "inboxpilot", "proposalpilot", "retainpilot", "automatepilot", "teampilot", "financepilot", "marketingpilot", "insightpilot", "insightpilot_advanced", "whitelabel", "multilocation"]'::jsonb,
  '{"leads": 999999, "messages": 50000, "automations_active": 999999, "team_members": 999999, "proposals_sent": 999999, "reports_generated": 999999}'::jsonb
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  plan_id text REFERENCES public.plans(id) NOT NULL DEFAULT 'pro',
  status text NOT NULL DEFAULT 'trialing',
  trial_ends_at timestamp with time zone,
  current_period_start timestamp with time zone NOT NULL DEFAULT now(),
  current_period_end timestamp with time zone NOT NULL DEFAULT (now() + interval '1 month'),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(business_id)
);

-- Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their business subscription" ON public.subscriptions 
  FOR SELECT USING (business_id = get_user_business_id(auth.uid()));

CREATE POLICY "Users can update their business subscription" ON public.subscriptions 
  FOR UPDATE USING (business_id = get_user_business_id(auth.uid()));

CREATE POLICY "Users can insert their business subscription" ON public.subscriptions 
  FOR INSERT WITH CHECK (business_id = get_user_business_id(auth.uid()));

-- Create usage_counters table
CREATE TABLE public.usage_counters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  period_start date NOT NULL DEFAULT date_trunc('month', CURRENT_DATE)::date,
  period_end date NOT NULL DEFAULT (date_trunc('month', CURRENT_DATE) + interval '1 month - 1 day')::date,
  counters jsonb NOT NULL DEFAULT '{"leads": 0, "messages": 0, "automations_active": 0, "team_members": 1, "proposals_sent": 0, "reports_generated": 0}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(business_id, period_start)
);

-- Enable RLS on usage_counters
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their business usage" ON public.usage_counters 
  FOR SELECT USING (business_id = get_user_business_id(auth.uid()));

CREATE POLICY "Users can update their business usage" ON public.usage_counters 
  FOR UPDATE USING (business_id = get_user_business_id(auth.uid()));

CREATE POLICY "Users can insert their business usage" ON public.usage_counters 
  FOR INSERT WITH CHECK (business_id = get_user_business_id(auth.uid()));

-- Create integrations table for Make.com webhooks
CREATE TABLE public.integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL UNIQUE,
  make_incoming_webhook_url text,
  make_outgoing_webhook_url text,
  enabled_events jsonb NOT NULL DEFAULT '{"lead_created": false, "appointment_created": false, "message_received": false, "proposal_sent": false, "report_generated": false}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on integrations
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their business integrations" ON public.integrations 
  FOR SELECT USING (business_id = get_user_business_id(auth.uid()));

CREATE POLICY "Users can manage their business integrations" ON public.integrations 
  FOR ALL USING (business_id = get_user_business_id(auth.uid()));

-- Trigger for updated_at on subscriptions
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on usage_counters
CREATE TRIGGER update_usage_counters_updated_at
  BEFORE UPDATE ON public.usage_counters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on integrations
CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();