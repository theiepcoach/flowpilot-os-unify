import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { usePlans, useModuleAccess } from '@/hooks/useSubscription';
import { useBilling } from '@/hooks/useBilling';
import { Check, Sparkles, CreditCard, Calendar, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Billing() {
  const [searchParams] = useSearchParams();
  const { data: plans } = usePlans();
  const { plan: currentPlan, subscription, usage, getUsagePercentage } = useModuleAccess();
  const { createCheckoutSession, openBillingPortal, isLoading } = useBilling();

  // Handle checkout success/cancel
  useEffect(() => {
    const checkout = searchParams.get('checkout');
    if (checkout === 'success') {
      toast.success('Subscription updated successfully!');
    } else if (checkout === 'cancel') {
      toast.info('Checkout cancelled');
    }
  }, [searchParams]);

  const handleChangePlan = (planId: string) => {
    createCheckoutSession(planId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-accent/10 text-accent border-accent/20">Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Past Due</Badge>;
      case 'canceled':
        return <Badge variant="secondary">Canceled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppLayout title="Billing & Plan">
      <div className="space-y-8">
        {/* Billing Warning Banner */}
        {subscription?.status === 'past_due' && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="font-medium text-destructive">Billing issue detected</p>
              <p className="text-sm text-muted-foreground">Update your payment method to restore full access.</p>
            </div>
            <Button variant="destructive" size="sm" onClick={openBillingPortal} disabled={isLoading}>
              Update Payment
            </Button>
          </div>
        )}

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold">{currentPlan?.name || 'Pro'}</h3>
                  {getStatusBadge(subscription?.status || 'trialing')}
                </div>
                <p className="text-muted-foreground mt-1">
                  ${currentPlan?.price_monthly || 99}/month
                </p>
                {subscription?.current_period_end && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                    <Calendar className="h-4 w-4" />
                    {subscription.cancel_at_period_end 
                      ? `Cancels on ${format(new Date(subscription.current_period_end), 'MMM d, yyyy')}`
                      : `Renews on ${format(new Date(subscription.current_period_end), 'MMM d, yyyy')}`
                    }
                  </p>
                )}
              </div>
              <Button variant="outline" onClick={openBillingPortal} disabled={isLoading}>
                Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Usage This Period</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentPlan && Object.entries(currentPlan.limits).map(([key, limit]) => {
              const current = usage?.counters[key as keyof typeof usage.counters] || 0;
              const percentage = getUsagePercentage(key as keyof typeof usage.counters);
              const isAtLimit = percentage >= 100;
              const isNearLimit = percentage >= 80;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{key.replace('_', ' ')}</span>
                    <span className={isAtLimit ? 'text-destructive' : isNearLimit ? 'text-yellow-600' : ''}>
                      {current} / {(limit as number) >= 999999 ? 'Unlimited' : limit}
                    </span>
                  </div>
                  <Progress 
                    value={(limit as number) >= 999999 ? 0 : percentage} 
                    className={`h-2 ${isAtLimit ? '[&>div]:bg-destructive' : isNearLimit ? '[&>div]:bg-yellow-500' : ''}`}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div>
          <h2 className="text-xl font-heading font-semibold mb-4">Change Plan</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {plans?.map((plan) => (
              <Card key={plan.id} className={plan.id === currentPlan?.id ? 'border-accent' : ''}>
                <CardContent className="p-6">
                  {plan.id === 'pro' && (
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full flex items-center gap-1 w-fit mb-2">
                      <Sparkles className="h-3 w-3" /> Popular
                    </span>
                  )}
                  <h3 className="font-heading text-xl font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold mt-2">${plan.price_monthly}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                  <ul className="mt-4 space-y-2">
                    {plan.included_modules.slice(0, 5).map((mod: string) => (
                      <li key={mod} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent" />
                        <span className="capitalize">{mod.replace('pilot', ' Pilot').replace('_', ' ')}</span>
                      </li>
                    ))}
                    {plan.included_modules.length > 5 && (
                      <li className="text-sm text-muted-foreground">+{plan.included_modules.length - 5} more</li>
                    )}
                  </ul>
                  <Button 
                    className="w-full mt-4" 
                    variant={plan.id === currentPlan?.id ? 'outline' : 'default'}
                    disabled={plan.id === currentPlan?.id || isLoading}
                    onClick={() => handleChangePlan(plan.id)}
                  >
                    {plan.id === currentPlan?.id ? 'Current Plan' : `Choose ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
