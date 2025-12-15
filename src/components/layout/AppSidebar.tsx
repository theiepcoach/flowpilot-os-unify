import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Grid3X3,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Users,
  Calendar,
  Wallet,
  Inbox,
  UserCog,
  Megaphone,
  Heart,
  FileText,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useUserRole";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
  adminOnly?: boolean;
}

// Primary app shell navigation
const appNavItems: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Modules", icon: Grid3X3, href: "/modules" },
  { title: "Billing", icon: CreditCard, href: "/billing" },
  { title: "Settings", icon: Settings, href: "/app-settings" },
];

// Module shortcuts (shown when expanded)
const moduleNavItems: NavItem[] = [
  { title: "Leads", icon: Users, href: "/leads" },
  { title: "Schedule", icon: Calendar, href: "/schedule" },
  { title: "Finance", icon: Wallet, href: "/finance" },
  { title: "Inbox", icon: Inbox, href: "/inbox" },
  { title: "Automations", icon: Zap, href: "/automations", adminOnly: true },
  { title: "Team", icon: UserCog, href: "/team", adminOnly: true },
  { title: "Marketing", icon: Megaphone, href: "/marketing" },
  { title: "Retention", icon: Heart, href: "/retention" },
  { title: "Proposals", icon: FileText, href: "/proposals" },
  { title: "Insights", icon: BarChart3, href: "/insights", adminOnly: true },
];

const adminNavItems: NavItem[] = [
  { title: "Admin Billing", icon: ShieldCheck, href: "/admin/billing", adminOnly: true },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut } = useAuth();
  const { isAdmin } = useIsAdmin();

  const filteredModuleItems = moduleNavItems.filter(item => !item.adminOnly || isAdmin);
  const filteredAdminItems = adminNavItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen gradient-navy transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Zap className="h-5 w-5 text-accent-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-heading font-bold text-sidebar-accent-foreground">
                FlowPilot
              </span>
              <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
                OS
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {/* App Shell Navigation */}
        <div className="mb-4">
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
              Navigation
            </p>
          )}
          <ul className="space-y-1">
            {appNavItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group",
                    collapsed && "justify-center px-2"
                  )}
                  activeClassName="bg-sidebar-accent text-sidebar-primary"
                >
                  <item.icon className="h-5 w-5 shrink-0 transition-colors group-hover:text-accent" />
                  {!collapsed && <span className="flex-1">{item.title}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-4 bg-sidebar-border" />

        {/* Module Shortcuts */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
              Modules
            </p>
          )}
          <ul className="space-y-1">
            {filteredModuleItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group",
                    collapsed && "justify-center px-2"
                  )}
                  activeClassName="bg-sidebar-accent text-sidebar-primary"
                >
                  <item.icon className="h-4 w-4 shrink-0 transition-colors group-hover:text-accent" />
                  {!collapsed && <span className="flex-1">{item.title}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Admin Section */}
        {filteredAdminItems.length > 0 && (
          <>
            <Separator className="my-4 bg-sidebar-border" />
            <div>
              {!collapsed && (
                <p className="px-3 mb-2 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
                  Admin
                </p>
              )}
              <ul className="space-y-1">
                {filteredAdminItems.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group",
                        collapsed && "justify-center px-2"
                      )}
                      activeClassName="bg-sidebar-accent text-sidebar-primary"
                    >
                      <item.icon className="h-4 w-4 shrink-0 transition-colors group-hover:text-accent" />
                      {!collapsed && <span className="flex-1">{item.title}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <button
          onClick={signOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all duration-200 hover:bg-destructive/20 hover:text-destructive",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="mt-4 w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
