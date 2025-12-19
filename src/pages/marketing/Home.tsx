import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, DollarSign, MessageSquare, Zap, UserCheck, Megaphone, Heart, FileText, BarChart3, ArrowRight, CheckCircle, XCircle, Play } from 'lucide-react';
import { MarketingLayout } from '@/components/marketing/MarketingLayout';
const modules = [{
  id: 'leadpilot',
  name: 'LeadPilot',
  icon: Users,
  description: 'Capture, score, and convert leads automatically'
}, {
  id: 'schedulepilot',
  name: 'SchedulePilot',
  icon: Calendar,
  description: 'Smart scheduling and appointment management'
}, {
  id: 'financepilot',
  name: 'FinancePilot',
  icon: DollarSign,
  description: 'Track revenue, expenses, and profitability'
}, {
  id: 'inboxpilot',
  name: 'InboxPilot',
  icon: MessageSquare,
  description: 'Unified messaging across all channels'
}, {
  id: 'automatepilot',
  name: 'AutomatePilot',
  icon: Zap,
  description: 'Build no-code workflow automations'
}, {
  id: 'teampilot',
  name: 'TeamPilot',
  icon: UserCheck,
  description: 'Task management and team coordination'
}, {
  id: 'marketingpilot',
  name: 'MarketingPilot',
  icon: Megaphone,
  description: 'AI-powered content and campaigns'
}, {
  id: 'retainpilot',
  name: 'RetainPilot',
  icon: Heart,
  description: 'Customer retention and loyalty programs'
}, {
  id: 'proposalpilot',
  name: 'ProposalPilot',
  icon: FileText,
  description: 'Generate and track proposals'
}, {
  id: 'insightpilot',
  name: 'InsightPilot',
  icon: BarChart3,
  description: 'Analytics and business intelligence'
}];
const problems = [{
  icon: XCircle,
  text: 'Missed leads falling through the cracks'
}, {
  icon: XCircle,
  text: 'Scheduling chaos and double-bookings'
}, {
  icon: XCircle,
  text: 'Scattered communication across apps'
}, {
  icon: XCircle,
  text: 'No visibility into your finances'
}, {
  icon: XCircle,
  text: 'Manual busywork eating your time'
}];
const solutions = [{
  icon: CheckCircle,
  text: 'One unified platform for everything'
}, {
  icon: CheckCircle,
  text: 'AI-powered automation built-in'
}, {
  icon: CheckCircle,
  text: 'Real-time insights and analytics'
}, {
  icon: CheckCircle,
  text: 'Works with Make.com & your stack'
}, {
  icon: CheckCircle,
  text: 'Scale from solo to enterprise'
}];
export default function Home() {
  return <MarketingLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-navy py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(165_82%_51%_/_0.15),_transparent_50%)]" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Run your entire business from{' '}
              <span className="text-gradient">one intelligent platform</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto animate-fade-in" style={{
            animationDelay: '0.1s'
          }}>
              FlowPilot OS replaces 10+ tools with one unified operating system. Leads, scheduling, finance, messaging, automation all powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{
            animationDelay: '0.2s'
          }}>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 glow-teal" asChild>
                <Link to="/auth?mode=signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Social Proof Strip */}
        <div className="container mt-16">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            <span className="text-primary-foreground/60 text-sm">Trusted by leading businesses</span>
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 w-24 bg-primary-foreground/10 rounded" />)}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                Running a business is <span className="text-destructive">chaos</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                You're juggling 10 different apps, missing leads, and spending hours on busywork instead of growing your business.
              </p>
              <ul className="space-y-4">
                {problems.map((problem, i) => <li key={i} className="flex items-center gap-3 text-foreground">
                    <problem.icon className="h-5 w-5 text-destructive flex-shrink-0" />
                    <span>{problem.text}</span>
                  </li>)}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                FlowPilot OS brings <span className="text-gradient">clarity</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                One platform that handles everything. AI does the heavy lifting while you focus on what matters.
              </p>
              <ul className="space-y-4">
                {solutions.map((solution, i) => <li key={i} className="flex items-center gap-3 text-foreground">
                    <solution.icon className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{solution.text}</span>
                  </li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 10 Modules Grid */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              10 Powerful Modules. One Platform.
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every tool you need to run your business
 Intelligently connected and AI-enhanced
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {modules.map(module => <Card key={module.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 gradient-card">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg gradient-teal flex items-center justify-center mb-4 group-hover:glow-teal transition-shadow">
                    <module.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">{module.name}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Built for how you work
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="h-40 bg-muted rounded-lg mb-4 flex items-center justify-center">
                <span className="text-muted-foreground">Screenshot placeholder</span>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">AI-Powered Automation</h3>
              <p className="text-muted-foreground">Set it and forget it. AI handles follow-ups, categorization, and insights automatically.</p>
            </Card>
            <Card className="p-6">
              <div className="h-40 bg-muted rounded-lg mb-4 flex items-center justify-center">
                <span className="text-muted-foreground">Screenshot placeholder</span>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Unified Dashboard</h3>
              <p className="text-muted-foreground">Everything you need to know at a glance. KPIs, tasks, and insights in one view.</p>
            </Card>
            <Card className="p-6">
              <div className="h-40 bg-muted rounded-lg mb-4 flex items-center justify-center">
                <span className="text-muted-foreground">Screenshot placeholder</span>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Make.com Ready</h3>
              <p className="text-muted-foreground">Connect to 1000+ apps with native webhook integrations and event triggers.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 gradient-navy">
        <div className="container">
          <div className="text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Start with a 7-day free trial. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent">$79</div>
                <div className="text-primary-foreground/60">Solo / month</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent">$199</div>
                <div className="text-primary-foreground/60">Pro / month</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent">$349</div>
                <div className="text-primary-foreground/60">Enterprise / month</div>
              </div>
            </div>
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/pricing">
                View Full Pricing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your business?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of businesses running smarter with FlowPilot OS.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 glow-teal" asChild>
              <Link to="/auth?mode=signup">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingLayout>;
}