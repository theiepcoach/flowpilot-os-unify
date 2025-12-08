
-- Create app_role enum for role-based access
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'team_member');

-- Create lead_status enum
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'qualified', 'won', 'lost');

-- Create appointment_status enum
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'completed', 'no_show', 'cancelled');

-- Create message_channel enum
CREATE TYPE public.message_channel AS ENUM ('sms', 'email', 'instagram', 'facebook');

-- Create message_direction enum
CREATE TYPE public.message_direction AS ENUM ('sent', 'received');

-- Create proposal_status enum
CREATE TYPE public.proposal_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'rejected');

-- Create transaction_type enum
CREATE TYPE public.transaction_type AS ENUM ('revenue', 'expense');

-- Create task_status enum
CREATE TYPE public.task_status AS ENUM ('open', 'in_progress', 'completed', 'blocked');

-- Create task_priority enum
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high');

-- =====================
-- BUSINESSES TABLE
-- =====================
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  timezone TEXT DEFAULT 'UTC',
  brand_voice TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- =====================
-- PROFILES TABLE
-- =====================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =====================
-- USER_ROLES TABLE (CRITICAL: Roles stored separately for security)
-- =====================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =====================
-- CONTACTS TABLE
-- =====================
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  lifetime_value NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- =====================
-- LEADS TABLE
-- =====================
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
  status lead_status NOT NULL DEFAULT 'new',
  lead_source TEXT,
  score INTEGER DEFAULT 0,
  notes TEXT,
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- =====================
-- APPOINTMENTS TABLE
-- =====================
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- =====================
-- MESSAGES TABLE
-- =====================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
  channel message_channel NOT NULL,
  direction message_direction NOT NULL,
  subject TEXT,
  message_body TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT false,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- =====================
-- PROPOSALS TABLE
-- =====================
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  status proposal_status NOT NULL DEFAULT 'draft',
  document_url TEXT,
  content JSONB,
  viewed_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- =====================
-- AUTOMATIONS TABLE
-- =====================
CREATE TABLE public.automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB DEFAULT '{}',
  action_config JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

-- =====================
-- TRANSACTIONS TABLE
-- =====================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  type transaction_type NOT NULL,
  category TEXT,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  ai_categorized BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- =====================
-- TASKS TABLE
-- =====================
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  assignee_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'open',
  priority task_priority NOT NULL DEFAULT 'medium',
  due_date DATE,
  recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- =====================
-- SECURITY DEFINER FUNCTIONS
-- =====================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's business_id
CREATE OR REPLACE FUNCTION public.get_user_business_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT business_id
  FROM public.profiles
  WHERE id = _user_id
$$;

-- Function to check if user belongs to a business
CREATE OR REPLACE FUNCTION public.user_belongs_to_business(_user_id UUID, _business_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND business_id = _business_id
  )
$$;

-- =====================
-- RLS POLICIES
-- =====================

-- Businesses policies
CREATE POLICY "Users can view their own business"
ON public.businesses FOR SELECT
TO authenticated
USING (public.user_belongs_to_business(auth.uid(), id));

CREATE POLICY "Owners and admins can update their business"
ON public.businesses FOR UPDATE
TO authenticated
USING (
  public.user_belongs_to_business(auth.uid(), id) AND
  (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Authenticated users can create businesses"
ON public.businesses FOR INSERT
TO authenticated
WITH CHECK (true);

-- Profiles policies
CREATE POLICY "Users can view profiles in their business"
ON public.profiles FOR SELECT
TO authenticated
USING (
  id = auth.uid() OR 
  business_id = public.get_user_business_id(auth.uid())
);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- User roles policies
CREATE POLICY "Users can view roles in their business"
ON public.user_roles FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles p1, public.profiles p2
    WHERE p1.id = auth.uid()
      AND p2.id = user_id
      AND p1.business_id = p2.business_id
  )
);

CREATE POLICY "Owners can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'owner'));

-- Contacts policies
CREATE POLICY "Users can view contacts in their business"
ON public.contacts FOR SELECT
TO authenticated
USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can manage contacts in their business"
ON public.contacts FOR ALL
TO authenticated
USING (business_id = public.get_user_business_id(auth.uid()));

-- Leads policies
CREATE POLICY "Users can view leads in their business"
ON public.leads FOR SELECT
TO authenticated
USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can manage leads in their business"
ON public.leads FOR ALL
TO authenticated
USING (business_id = public.get_user_business_id(auth.uid()));

-- Appointments policies
CREATE POLICY "Users can view appointments in their business"
ON public.appointments FOR SELECT
TO authenticated
USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can manage appointments in their business"
ON public.appointments FOR ALL
TO authenticated
USING (business_id = public.get_user_business_id(auth.uid()));

-- Messages policies
CREATE POLICY "Users can view messages in their business"
ON public.messages FOR SELECT
TO authenticated
USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can manage messages in their business"
ON public.messages FOR ALL
TO authenticated
USING (business_id = public.get_user_business_id(auth.uid()));

-- Proposals policies
CREATE POLICY "Users can view proposals in their business"
ON public.proposals FOR SELECT
TO authenticated
USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can manage proposals in their business"
ON public.proposals FOR ALL
TO authenticated
USING (business_id = public.get_user_business_id(auth.uid()));

-- Automations policies
CREATE POLICY "Users can view automations in their business"
ON public.automations FOR SELECT
TO authenticated
USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Owners and admins can manage automations"
ON public.automations FOR ALL
TO authenticated
USING (
  business_id = public.get_user_business_id(auth.uid()) AND
  (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'admin'))
);

-- Transactions policies
CREATE POLICY "Users can view transactions in their business"
ON public.transactions FOR SELECT
TO authenticated
USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can manage transactions in their business"
ON public.transactions FOR ALL
TO authenticated
USING (business_id = public.get_user_business_id(auth.uid()));

-- Tasks policies
CREATE POLICY "Users can view tasks in their business"
ON public.tasks FOR SELECT
TO authenticated
USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Team members can view their assigned tasks"
ON public.tasks FOR SELECT
TO authenticated
USING (assignee_user_id = auth.uid());

CREATE POLICY "Owners and admins can manage all tasks"
ON public.tasks FOR ALL
TO authenticated
USING (
  business_id = public.get_user_business_id(auth.uid()) AND
  (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Team members can update their assigned tasks"
ON public.tasks FOR UPDATE
TO authenticated
USING (assignee_user_id = auth.uid());

-- =====================
-- TRIGGERS FOR UPDATED_AT
-- =====================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automations_updated_at
  BEFORE UPDATE ON public.automations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- TRIGGER FOR NEW USER PROFILE
-- =====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- INDEXES FOR PERFORMANCE
-- =====================
CREATE INDEX idx_profiles_business_id ON public.profiles(business_id);
CREATE INDEX idx_contacts_business_id ON public.contacts(business_id);
CREATE INDEX idx_leads_business_id ON public.leads(business_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_appointments_business_id ON public.appointments(business_id);
CREATE INDEX idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX idx_messages_business_id ON public.messages(business_id);
CREATE INDEX idx_messages_contact_id ON public.messages(contact_id);
CREATE INDEX idx_proposals_business_id ON public.proposals(business_id);
CREATE INDEX idx_automations_business_id ON public.automations(business_id);
CREATE INDEX idx_transactions_business_id ON public.transactions(business_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_tasks_business_id ON public.tasks(business_id);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee_user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
