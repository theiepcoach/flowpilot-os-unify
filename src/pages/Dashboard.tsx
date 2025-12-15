import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useModuleAccess } from '@/hooks/useSubscription';
import { Users, Calendar, DollarSign, MessageSquare, ArrowRight, AlertTriangle } from 'lucide-react';

const kpiCards = [
  { title: 'New Leads', value: '24', change: '+12%', icon: Users, color: 'text-blue-500' },
  { title: 'Appointments', value: '8', change: '+3', icon: Calendar, color: 'text-green-500' },
  { title: 'Revenue', value: '$12,450', change: '+18%', icon: DollarSign, color: 'text-amber-500' },
  { title: 'Messages', value: '156', change: '+45', icon: MessageSquare, color: 'text-purple-500' },
];

export default function Dashboard() {
  const { plan, subscription, usage, isTrialing, daysLeftInTrial, getUsagePercentage, isNearLimit } = useModuleAccess();

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Trial Banner */}
        {isTrialing && daysLeftInTrial > 0 && (
          <Card className="border-accent bg-accent/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-accent" />
                <span>
                  <strong>{daysLeftInTrial} days left</strong> in your Pro trial. 
                  Upgrade to keep all features.
                </span>
              </div>
              <Button size="sm" className="bg-accent text-accent-foreground" asChild>
                <Link to="/billing">Choose Plan</Link>
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
