import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/security', label: 'Security' },
];

const footerLinks = {
  product: [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/security', label: 'Security' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/careers', label: 'Careers' },
  ],
  legal: [
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
  ],
};

export function MarketingLayout({ children }: MarketingLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-teal flex items-center justify-center">
                <span className="font-heading font-bold text-accent-foreground text-lg">F</span>
              </div>
              <span className="font-heading font-bold text-xl">FlowPilot OS</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    location.pathname === link.href ? 'text-accent' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link to="/auth?mode=signup">Start Free Trial</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <Button variant="ghost" asChild>
                    <Link to="/auth">Login</Link>
                  </Button>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                    <Link to="/auth?mode=signup">Start Free Trial</Link>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                  <span className="font-heading font-bold text-accent-foreground text-lg">F</span>
                </div>
                <span className="font-heading font-bold text-xl">FlowPilot OS</span>
              </Link>
              <p className="text-primary-foreground/60 text-sm">
                Run your entire business from one intelligent platform.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-heading font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-heading font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-heading font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} FlowPilot OS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
