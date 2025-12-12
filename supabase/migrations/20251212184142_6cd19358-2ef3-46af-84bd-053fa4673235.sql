-- Create webhook_settings table for storing Make.com webhook URLs
CREATE TABLE public.webhook_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  webhook_url TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_id, event_type)
);

-- Enable RLS
ALTER TABLE public.webhook_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their business webhook settings"
ON public.webhook_settings FOR SELECT
USING (public.user_belongs_to_business(auth.uid(), business_id));

CREATE POLICY "Users can insert their business webhook settings"
ON public.webhook_settings FOR INSERT
WITH CHECK (public.user_belongs_to_business(auth.uid(), business_id));

CREATE POLICY "Users can update their business webhook settings"
ON public.webhook_settings FOR UPDATE
USING (public.user_belongs_to_business(auth.uid(), business_id));

CREATE POLICY "Users can delete their business webhook settings"
ON public.webhook_settings FOR DELETE
USING (public.user_belongs_to_business(auth.uid(), business_id));

-- Trigger for updated_at
CREATE TRIGGER update_webhook_settings_updated_at
BEFORE UPDATE ON public.webhook_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create notifications table for in-app notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid() OR public.user_belongs_to_business(auth.uid(), business_id));

CREATE POLICY "Users can insert notifications for their business"
ON public.notifications FOR INSERT
WITH CHECK (public.user_belongs_to_business(auth.uid(), business_id));

CREATE POLICY "Users can update their notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid() OR public.user_belongs_to_business(auth.uid(), business_id));

CREATE POLICY "Users can delete their notifications"
ON public.notifications FOR DELETE
USING (user_id = auth.uid() OR public.user_belongs_to_business(auth.uid(), business_id));

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;