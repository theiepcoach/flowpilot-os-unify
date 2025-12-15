import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePlans, useModuleAccess, useUpdateSubscription } from '@/hooks/useSubscription';
import { Check, Sparkles } from 'lucide-react';

export default function Billing() {
  const { data: plans } = usePlans();
  const { plan: currentPlan, subscription, usage, getUsagePercentage } = useModuleAccess();
  const updateSubscription = useUpdateSubscription();

  const handleChangePlan = (planId: string) => {
    updateSubscription.mutate({ planId });
  };

  return (
    <AppLayout title="Billing & Plan">
      <div className="space-y-8">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{currentPlan?.name || 'Pro'}</h3>
                <p className="text-muted-foreground">
                  ${currentPlan?.price_monthly || 199}/month • Status: {subscription?.status || 'trialing'}
                </p>
              </div>
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
              const percentage = getUsagePercentage(key as any);
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{key.replace('_', ' ')}</span>
                    <span>{current} / {limit >= 999999 ? 'Unlimited' : limit}</span>
                  </div>
                  <Progress value={limit >= 999999 ? 0 : percentage} className="h-2" />
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
                    disabled={plan.id === currentPlan?.id || updateSubscription.isPending}
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
