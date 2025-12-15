import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Zap, Building2, ArrowRight, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const industries = [
  'Consulting',
  'Marketing & Advertising',
  'Real Estate',
  'Healthcare',
  'Legal Services',
  'Financial Services',
  'Technology',
  'Education',
  'Home Services',
  'Other',
];

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Phoenix', label: 'Arizona (MST)' },
  { value: 'America/Anchorage', label: 'Alaska (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii (HST)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Central European (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
];

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp, isLoading: authLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'auth' | 'business'>('auth');
  
  // Auth fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  // Business fields
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');

  const defaultTab = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const selectedPlan = searchParams.get('plan');

  useEffect(() => {
    if (user && step === 'auth') {
      // Check if user has a business
      checkUserBusiness();
    }
  }, [user, step]);

  const checkUserBusiness = async () => {
    if (!user) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id')
      .eq('id', user.id)
      .single();

    if (profile?.business_id) {
      // User already has a business, redirect to dashboard
      navigate('/dashboard', { replace: true });
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Welcome back!');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    const { error } = await signUp(email, password, firstName, lastName);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Account created! Now let\'s set up your business.');
      setStep('business');
    }
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessName.trim()) {
      toast.error('Please enter a business name');
      return;
    }

    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    setIsLoading(true);

    try {
      // Create the business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert({
          name: businessName,
          industry: industry || null,
          timezone: timezone,
        })
        .select()
        .single();

      if (businessError) throw businessError;

      // Update the profile with business_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ business_id: business.id })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Create owner role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'owner' });

      if (roleError) throw roleError;

      // Create a 14-day Pro trial subscription
      const now = new Date();
      const trialEnd = new Date(now);
      trialEnd.setDate(trialEnd.getDate() + 14);
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      const planToUse = selectedPlan || 'pro';

      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          business_id: business.id,
          plan_id: planToUse,
          status: planToUse === 'pro' ? 'trialing' : 'active',
          trial_ends_at: planToUse === 'pro' ? trialEnd.toISOString() : null,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        });

      if (subError) throw subError;

      // Create initial usage counters
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      await supabase
        .from('usage_counters')
        .insert({
          business_id: business.id,
          period_start: monthStart.toISOString().split('T')[0],
          period_end: monthEnd.toISOString().split('T')[0],
          counters: {
            leads: 0,
            messages: 0,
            automations_active: 0,
            team_members: 1,
            proposals_sent: 0,
            reports_generated: 0,
          },
        });

      toast.success('Business created! Welcome to FlowPilot OS.');
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Error creating business:', error);
      toast.error(error.message || 'Failed to create business');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
              <Zap className="h-6 w-6 text-accent-foreground" />
            </div>
            <span className="text-2xl font-heading font-bold text-foreground">FlowPilot OS</span>
          </div>
          <p className="text-muted-foreground">
            {step === 'auth' 
              ? 'Run your entire business from one intelligent platform'
              : 'Let\'s set up your business'}
          </p>
        </div>

        {step === 'auth' ? (
          <Card className="border-border bg-card">
            <Tabs defaultValue={defaultTab} className="w-full">
              <CardHeader className="pb-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent>
                <TabsContent value="signin" className="mt-0">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={errors.password ? 'border-destructive' : ''}
                      />
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>
                    <Button type="submit" className="w-full" variant="teal" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-firstname">First Name</Label>
                        <Input
                          id="signup-firstname"
                          type="text"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-lastname">Last Name</Label>
                        <Input
                          id="signup-lastname"
                          type="text"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={errors.password ? 'border-destructive' : ''}
                      />
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>
                    <Button type="submit" className="w-full" variant="teal" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                  {selectedPlan && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      You'll start with a 14-day free trial of the{' '}
                      <span className="font-medium text-foreground capitalize">{selectedPlan}</span> plan
                    </p>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        ) : (
          <Card className="border-border bg-card">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 text-accent mb-2">
                <Building2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-heading font-semibold">Set Up Your Business</h2>
              <p className="text-sm text-muted-foreground">
                Tell us a bit about your business to customize your experience
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBusiness} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name *</Label>
                  <Input
                    id="business-name"
                    type="text"
                    placeholder="Acme Consulting"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('auth')}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit" variant="teal" className="flex-1" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Get Started
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
