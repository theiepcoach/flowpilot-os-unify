import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, Calendar, DollarSign, MessageSquare, Zap, UserCheck, 
  Megaphone, Heart, FileText, BarChart3, ArrowRight
} from 'lucide-react';
import { MarketingLayout } from '@/components/marketing/MarketingLayout';

const featureGroups = [
  {
    title: 'Capture & Convert',
    description: 'Turn prospects into loyal customers',
    color: 'bg-blue-500',
    features: [
      {
        icon: Users,
        name: 'LeadPilot',
        headline: 'Never lose a lead again',
        bullets: [
          'AI-powered lead scoring and prioritization',
          'Kanban pipeline with drag-and-drop stages',
          'Unified timeline showing all interactions',
        ],
      },
      {
        icon: MessageSquare,
        name: 'InboxPilot',
        headline: 'All your messages in one place',
        bullets: [
          'Unified inbox for SMS, email, Instagram, Facebook',
          'AI-generated reply suggestions',
          'Priority detection and smart routing',
        ],
      },
    ],
  },
  {
    title: 'Schedule & Deliver',
    description: 'Streamline your operations',
    color: 'bg-green-500',
    features: [
      {
        icon: Calendar,
        name: 'SchedulePilot',
        headline: 'Smart scheduling made simple',
        bullets: [
          'Calendar sync with Google, Outlook, Apple',
          'Automated appointment reminders',
          'No-show tracking and rebooking',
        ],
      },
      {
        icon: UserCheck,
        name: 'TeamPilot',
        headline: 'Keep your team aligned',
        bullets: [
          'Task management with priority levels',
          'Role-based dashboards and permissions',
          'AI performance summaries',
        ],
      },
    ],
  },
  {
    title: 'Automate & Scale',
    description: 'Work smarter, not harder',
    color: 'bg-purple-500',
    features: [
      {
        icon: Zap,
        name: 'AutomatePilot',
        headline: 'No-code workflow builder',
        bullets: [
          'Visual automation canvas with triggers and actions',
          'Pre-built templates for common workflows',
          'Make.com integration for unlimited possibilities',
        ],
      },
      {
        icon: Megaphone,
        name: 'MarketingPilot',
        headline: 'AI-powered marketing',
        bullets: [
          'Generate social content with brand voice',
          'Email campaign automation',
          'Content calendar management',
        ],
      },
      {
        icon: Heart,
        name: 'RetainPilot',
        headline: 'Keep customers coming back',
        bullets: [
          'Automated retention campaigns',
          'Birthday and anniversary messages',
          'Win-back sequences for inactive customers',
        ],
      },
    ],
  },
  {
    title: 'Money & Insight',
    description: 'Understand and grow your business',
    color: 'bg-amber-500',
    features: [
      {
        icon: DollarSign,
        name: 'FinancePilot',
        headline: 'Financial clarity at a glance',
        bullets: [
          'Revenue and expense tracking',
          'AI-driven transaction categorization',
          'Cash flow and profitability charts',
        ],
      },
      {
        icon: FileText,
        name: 'ProposalPilot',
        headline: 'Win more deals',
        bullets: [
          'AI-generated proposals and contracts',
          'E-signature tracking and reminders',
          'Conversion analytics',
        ],
      },
      {
        icon: BarChart3,
        name: 'InsightPilot',
        headline: 'Data-driven decisions',
        bullets: [
          'Real-time KPI dashboards',
          'AI explanations for metrics changes',
          'Custom report generation',
        ],
      },
    ],
  },
];

export default function Features() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="gradient-navy py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Everything you need to run your business
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8">
              10 powerful modules working together seamlessly. AI-enhanced, automation-ready, beautifully designed.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link to="/auth?mode=signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Groups */}
      {featureGroups.map((group, groupIndex) => (
        <section key={group.title} className={groupIndex % 2 === 0 ? 'bg-background' : 'bg-secondary/30'} id={group.title.toLowerCase().replace(' ', '-')}>
          <div className="container py-20">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">{group.title}</h2>
              <p className="text-muted-foreground text-lg">{group.description}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.features.map((feature) => (
                <Card key={feature.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg gradient-teal flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold mb-2">{feature.name}</h3>
                    <p className="text-foreground font-medium mb-4">{feature.headline}</p>
                    <ul className="space-y-2">
                      {feature.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link to="/auth?mode=signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ))}
    </MarketingLayout>
  );
}
