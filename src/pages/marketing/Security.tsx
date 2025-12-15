import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, Users, FileCheck, Server, ArrowRight } from 'lucide-react';
import { MarketingLayout } from '@/components/marketing/MarketingLayout';

const securityFeatures = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access Control',
    description: 'Granular permissions ensure team members only access what they need. Owner, Admin, and Team Member roles.',
  },
  {
    icon: Eye,
    title: 'Audit Trail',
    description: 'Complete activity logging tracks every action in your account for compliance and security reviews.',
  },
  {
    icon: Users,
    title: 'Two-Factor Authentication',
    description: 'Add an extra layer of security with TOTP-based 2FA for all user accounts.',
  },
  {
    icon: FileCheck,
    title: 'Data Compliance',
    description: 'GDPR-ready data handling with tools for data export, deletion, and consent management.',
  },
  {
    icon: Server,
    title: 'Secure Infrastructure',
    description: 'Hosted on enterprise-grade infrastructure with automatic backups and 99.9% uptime SLA.',
  },
];

const certifications = [
  { name: 'SOC 2 Type II', status: 'In Progress' },
  { name: 'GDPR Compliant', status: 'Active' },
  { name: 'HIPAA Ready', status: 'Coming Soon' },
];

export default function Security() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="gradient-navy py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-accent/10 mb-6">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Security & Privacy
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Your data is your business. We take security seriously so you can focus on growth.
            </p>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Enterprise-Grade Security</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              FlowPilot OS is built with security-first principles to protect your business data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {securityFeatures.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Handling */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-center mb-12">How We Handle Your Data</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-semibold mb-4">Data Storage</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      Data stored in secure, SOC 2 compliant data centers
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      Automatic daily backups with 30-day retention
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      Geographic data residency options for enterprise
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      Complete data isolation between customers
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-semibold mb-4">Data Privacy</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      We never sell your data to third parties
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      GDPR-compliant with data export and deletion tools
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      Transparent privacy policy with no hidden clauses
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      You own your data — export anytime, delete on request
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Compliance & Certifications</h2>
          
          <div className="flex flex-wrap justify-center gap-6">
            {certifications.map((cert) => (
              <Card key={cert.name} className="w-64">
                <CardContent className="p-6 text-center">
                  <Shield className="h-10 w-10 text-accent mx-auto mb-4" />
                  <h3 className="font-heading font-semibold">{cert.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                    cert.status === 'Active' ? 'bg-success/10 text-success' :
                    cert.status === 'In Progress' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {cert.status}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-navy">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Start your free trial with confidence. Your data is protected from day one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link to="/auth?mode=signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
