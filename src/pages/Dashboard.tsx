import { useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useModuleAccess } from '@/hooks/useSubscription';
import { Users, Calendar, DollarSign, MessageSquare, ArrowRight, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const kpiCards = [
  { title: 'New Leads', value: '24', change: '+12%', icon: Users, color: 'text-blue-500' },
  { title: 'Appointments', value: '8', change: '+3', icon: Calendar, color: 'text-green-500' },
  { title: 'Revenue', value: '$12,450', change: '+18%', icon: DollarSign, color: 'text-amber-500' },
  { title: 'Messages', value: '156', change: '+45', icon: MessageSquare, color: 'text-purple-500' },
];

export default function Dashboard() {
  const { plan, subscription, usage, isTrialing, daysLeftInTrial, getUsagePercentage, isNearLimit } = useModuleAccess();
  const hasShownTrialWarning = useRef(false);

  // Show toast warning when trial is about to expire (2 days or less)
  useEffect(() => {
    if (isTrialing && daysLeftInTrial > 0 && daysLeftInTrial <= 2 && !hasShownTrialWarning.current) {
      hasShownTrialWarning.current = true;
      toast.warning(
        daysLeftInTrial === 1 
          ? "Your trial expires tomorrow!" 
          : `Your trial expires in ${daysLeftInTrial} days!`,
        {
          description: "Upgrade now to keep access to all features.",
          duration: 10000,
          action: {
            label: "Upgrade",
            onClick: () => window.location.href = "/billing",
          },
        }
      );
    }
  }, [isTrialing, daysLeftInTrial]);

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Trial Banner */}
        {isTrialing && daysLeftInTrial > 0 && (
          <Card className="border-accent bg-gradient-to-r from-accent/10 to-accent/5 shadow-teal">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-accent">{daysLeftInTrial}</span>
                </div>
                <div>
                  <p className="font-semibold">
                    {daysLeftInTrial === 1 ? 'Last day' : `${daysLeftInTrial} days left`} of your Pro trial
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Upgrade now to keep all features after your trial ends
                  </p>
                </div>
              </div>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0" asChild>
                <Link to="/billing">Upgrade Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Expired Trial / Past Due Banner */}
        {subscription && (subscription.status === 'past_due' || subscription.status === 'canceled') && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">
                    {subscription.status === 'past_due' ? 'Payment Past Due' : 'Subscription Inactive'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Update your payment method to restore access to all features
                  </p>
                </div>
              </div>
              <Button variant="destructive" className="shrink-0" asChild>
                <Link to="/billing">Fix Payment</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                    <p className="text-xs text-accent mt-1">{kpi.change} this month</p>
                  </div>
                  <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links & Usage */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/leads"><Users className="mr-2 h-4 w-4" /> View Leads</Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/schedule"><Calendar className="mr-2 h-4 w-4" /> Schedule</Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/inbox"><MessageSquare className="mr-2 h-4 w-4" /> Inbox</Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/modules"><ArrowRight className="mr-2 h-4 w-4" /> All Modules</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Usage Meter */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Usage This Month</CardTitle>
              <span className="text-sm text-muted-foreground">{plan?.name || 'Pro'} Plan</span>
            </CardHeader>
            <CardContent className="space-y-4">
              {['leads', 'messages', 'proposals_sent'].map((key) => {
                const percentage = getUsagePercentage(key as any);
                const limit = plan?.limits[key as keyof typeof plan.limits] || 0;
                const current = usage?.counters[key as keyof typeof usage.counters] || 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{key.replace('_', ' ')}</span>
                      <span className={isNearLimit(key as any) ? 'text-warning' : ''}>
                        {current} / {limit >= 999999 ? '∞' : limit}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
              <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
                <Link to="/billing">View All Limits <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
