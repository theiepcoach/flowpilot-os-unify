import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { MarketingLayout } from '@/components/marketing/MarketingLayout';
import { useBilling } from '@/hooks/useBilling';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

const plans = [
  {
    id: 'solo',
    name: 'Solo',
    priceMonthly: 49,
    priceAnnual: Math.round(49 * 12 * 0.65), // 35% off
    description: 'Perfect for solopreneurs and freelancers',
    popular: false,
    modules: [
      { name: 'LeadPilot', included: true },
      { name: 'SchedulePilot', included: true },
      { name: 'InboxPilot (Lite)', included: true },
      { name: 'ProposalPilot', included: true },
      { name: 'RetainPilot (Lite)', included: true },
      { name: 'AutomatePilot', included: false },
      { name: 'TeamPilot', included: false },
      { name: 'FinancePilot', included: false },
      { name: 'MarketingPilot', included: false },
      { name: 'InsightPilot', included: false },
    ],
    limits: {
      leads: '300 / month',
      messages: '1,500 / month',
      automations: '3 active',
      team_members: '1 (owner only)',
      proposals: '30 / month',
      reports: '4 / month (monthly only)',
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 99,
    priceAnnual: Math.round(99 * 12 * 0.65), // 35% off
    description: 'For growing businesses ready to scale',
    popular: true,
    modules: [
      { name: 'LeadPilot', included: true },
      { name: 'SchedulePilot', included: true },
      { name: 'InboxPilot (Full)', included: true },
      { name: 'ProposalPilot', included: true },
      { name: 'RetainPilot (Full)', included: true },
      { name: 'AutomatePilot', included: true },
      { name: 'TeamPilot', included: true },
      { name: 'FinancePilot', included: true },
      { name: 'MarketingPilot', included: true },
      { name: 'InsightPilot', included: true },
    ],
    limits: {
      leads: '2,000 / month',
      messages: '10,000 / month',
      automations: '25 active',
      team_members: '5',
      proposals: '200 / month',
      reports: '30 / month (weekly + monthly)',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 149,
    priceAnnual: Math.round(149 * 12 * 0.65), // 35% off
    description: 'For established businesses and agencies',
    popular: false,
    modules: [
      { name: 'LeadPilot', included: true },
      { name: 'SchedulePilot', included: true },
      { name: 'InboxPilot (Full)', included: true },
      { name: 'ProposalPilot', included: true },
      { name: 'RetainPilot (Full)', included: true },
      { name: 'AutomatePilot', included: true },
      { name: 'TeamPilot', included: true },
      { name: 'FinancePilot', included: true },
      { name: 'MarketingPilot', included: true },
      { name: 'InsightPilot (Advanced)', included: true },
      { name: 'White-label Portal', included: true },
      { name: 'Multi-location', included: true },
    ],
    limits: {
      leads: 'Unlimited',
      messages: '50,000 / month',
      automations: 'Unlimited',
      team_members: 'Unlimited',
      proposals: 'Unlimited',
      reports: 'Unlimited',
    },
  },
];

const comparisonFeatures = [
  { feature: 'Leads per month', solo: '300', pro: '2,000', enterprise: 'Unlimited' },
  { feature: 'Messages per month', solo: '1,500', pro: '10,000', enterprise: '50,000' },
  { feature: 'Active automations', solo: '3', pro: '25', enterprise: 'Unlimited' },
  { feature: 'Team members', solo: '1', pro: '5', enterprise: 'Unlimited' },
  { feature: 'Proposals per month', solo: '30', pro: '200', enterprise: 'Unlimited' },
  { feature: 'AI-generated content', solo: 'Basic', pro: 'Advanced', enterprise: 'Advanced' },
  { feature: 'Make.com webhooks', solo: true, pro: true, enterprise: true },
  { feature: 'Priority support', solo: false, pro: true, enterprise: true },
  { feature: 'White-label portal', solo: false, pro: false, enterprise: true },
  { feature: 'Multi-location', solo: false, pro: false, enterprise: true },
  { feature: 'Custom integrations', solo: false, pro: false, enterprise: true },
  { feature: 'Dedicated success manager', solo: false, pro: false, enterprise: true },
];

export default function Pricing() {
  const { user } = useAuth();
  const { createCheckoutSession, isLoading } = useBilling();
  const [isAnnual, setIsAnnual] = useState(false);

  const handleChoosePlan = (planId: string) => {
    if (user) {
      // User is logged in, start checkout
      createCheckoutSession(planId);
    }
    // If not logged in, the Link component will navigate to signup
  };

  const getDisplayPrice = (plan: typeof plans[0]) => {
    if (isAnnual) {
      return Math.round(plan.priceAnnual / 12);
    }
    return plan.priceMonthly;
  };

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="gradient-navy py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-6">
              Start with a 14-day free trial. No credit card required.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${!isAnnual ? 'text-primary-foreground font-medium' : 'text-primary-foreground/60'}`}>
                Monthly
              </span>
              <Switch 
                checked={isAnnual} 
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-accent"
              />
              <span className={`text-sm ${isAnnual ? 'text-primary-foreground font-medium' : 'text-primary-foreground/60'}`}>
                Annual
              </span>
              <span className="bg-accent/20 text-accent text-xs font-semibold px-2 py-1 rounded-full">
                Save 35%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'border-accent shadow-teal' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="font-heading text-2xl">{plan.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${getDisplayPrice(plan)}</span>
                    <span className="text-muted-foreground"> / month</span>
                    {isAnnual && (
                      <p className="text-xs text-accent mt-1">
                        ${plan.priceAnnual}/year (billed annually)
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <Button 
                      className={`w-full mb-6 ${plan.popular ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handleChoosePlan(plan.id)}
                      disabled={isLoading}
                    >
                      Choose {plan.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      className={`w-full mb-6 ${plan.popular ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      asChild
                    >
                      <Link to={`/auth?mode=signup&plan=${plan.id}`}>
                        Choose {plan.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm">Modules included:</h4>
                    <ul className="space-y-2">
                      {plan.modules.map((module) => (
                        <li key={module.name} className="flex items-center gap-2 text-sm">
                          {module.included ? (
                            <Check className="h-4 w-4 text-accent flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                          )}
                          <span className={module.included ? '' : 'text-muted-foreground/50'}>
                            {module.name}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold text-sm mb-2">Usage limits:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {Object.entries(plan.limits).map(([key, value]) => (
                          <li key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace('_', ' ')}</span>
                            <span className="font-medium text-foreground">{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Compare plans</h2>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-heading">Feature</th>
                  <th className="text-center py-4 px-4 font-heading">Solo</th>
                  <th className="text-center py-4 px-4 font-heading">Pro</th>
                  <th className="text-center py-4 px-4 font-heading">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-background' : ''}>
                    <td className="py-3 px-4 text-sm">{row.feature}</td>
                    <td className="py-3 px-4 text-center text-sm">
                      {typeof row.solo === 'boolean' ? (
                        row.solo ? <Check className="h-5 w-5 text-accent mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                      ) : row.solo}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="h-5 w-5 text-accent mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                      ) : row.pro}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <Check className="h-5 w-5 text-accent mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                      ) : row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ / CTA */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold mb-4">Questions?</h2>
            <p className="text-muted-foreground mb-8">
              Start your 14-day free trial today. No credit card required. 
              Upgrade, downgrade, or cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link to="/auth?mode=signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
