import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useModuleAccess } from '@/hooks/useSubscription';
import { 
  Users, Calendar, DollarSign, MessageSquare, Zap, UserCheck, 
  Megaphone, Heart, FileText, BarChart3, Lock
} from 'lucide-react';

const modules = [
  { id: 'leadpilot', name: 'LeadPilot', icon: Users, href: '/leads', description: 'Lead management and conversion' },
  { id: 'schedulepilot', name: 'SchedulePilot', icon: Calendar, href: '/schedule', description: 'Appointments and scheduling' },
  { id: 'financepilot', name: 'FinancePilot', icon: DollarSign, href: '/finance', description: 'Revenue and expense tracking' },
  { id: 'inboxpilot', name: 'InboxPilot', icon: MessageSquare, href: '/inbox', description: 'Unified messaging inbox' },
  { id: 'automatepilot', name: 'AutomatePilot', icon: Zap, href: '/automations', description: 'Workflow automation' },
  { id: 'teampilot', name: 'TeamPilot', icon: UserCheck, href: '/team', description: 'Task and team management' },
  { id: 'marketingpilot', name: 'MarketingPilot', icon: Megaphone, href: '/marketing', description: 'Marketing campaigns' },
  { id: 'retainpilot', name: 'RetainPilot', icon: Heart, href: '/retention', description: 'Customer retention' },
  { id: 'proposalpilot', name: 'ProposalPilot', icon: FileText, href: '/proposals', description: 'Proposals and contracts' },
  { id: 'insightpilot', name: 'InsightPilot', icon: BarChart3, href: '/insights', description: 'Analytics and reports' },
];

export default function Modules() {
  const { hasModuleAccess } = useModuleAccess();

  return (
    <AppLayout title="Modules">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {modules.map((module) => {
          const isEnabled = hasModuleAccess(module.id) || hasModuleAccess(module.id + '_lite');
          
          return (
            <Card key={module.id} className={!isEnabled ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg gradient-teal flex items-center justify-center">
                    <module.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  {!isEnabled && <Lock className="h-5 w-5 text-muted-foreground" />}
                </div>
                <h3 className="font-heading font-semibold mb-1">{module.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                {isEnabled ? (
                  <Button className="w-full" asChild>
                    <Link to={module.href}>Open Module</Link>
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/billing">Upgrade to Unlock</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
