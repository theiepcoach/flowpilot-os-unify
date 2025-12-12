import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";
import { cn } from "@/lib/utils";

const Retention = () => {
  const { data: contacts, isLoading } = useContacts();

  if (isLoading) {
    return (
      <AppLayout title="RetainPilot">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  // Segment contacts by lifetime value
  const segments = {
    loyal: contacts?.filter((c) => (c.lifetime_value || 0) >= 5000) || [],
    active: contacts?.filter((c) => (c.lifetime_value || 0) >= 1000 && (c.lifetime_value || 0) < 5000) || [],
    new: contacts?.filter((c) => (c.lifetime_value || 0) > 0 && (c.lifetime_value || 0) < 1000) || [],
    atRisk: contacts?.filter((c) => (c.lifetime_value || 0) === 0) || [],
  };

  const totalLTV = contacts?.reduce((sum, c) => sum + (c.lifetime_value || 0), 0) || 0;
  const avgLTV = contacts && contacts.length > 0 ? totalLTV / contacts.length : 0;

  return (
    <AppLayout title="RetainPilot">
      {/* Stats */}
      <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={(contacts?.length || 0).toString()}
          change="All contacts"
          changeType="neutral"
          icon={Users}
          iconColor="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Lifetime Value"
          value={`$${totalLTV.toLocaleString()}`}
          change="Combined LTV"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-success/10 text-success"
        />
        <StatCard
          title="Avg. LTV"
          value={`$${avgLTV.toFixed(0)}`}
          change="Per customer"
          changeType="neutral"
          icon={TrendingUp}
          iconColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Loyal Customers"
          value={segments.loyal.length.toString()}
          change="$5k+ LTV"
          changeType="positive"
          icon={Heart}
          iconColor="bg-destructive/10 text-destructive"
        />
      </div>

      {/* Customer Segments */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Loyal Customers */}
        <div className="rounded-xl bg-card p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-success/10 text-success border-success/20">Loyal</Badge>
            <span className="text-sm text-muted-foreground">${"5,000"}+ lifetime value</span>
          </div>
          <div className="space-y-3">
            {segments.loyal.length > 0 ? (
              segments.loyal.slice(0, 5).map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">{contact.first_name} {contact.last_name}</p>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                  <span className="font-semibold text-success">${(contact.lifetime_value || 0).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No loyal customers yet</p>
            )}
          </div>
        </div>

        {/* Active Customers */}
        <div className="rounded-xl bg-card p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-accent/10 text-accent border-accent/20">Active</Badge>
            <span className="text-sm text-muted-foreground">$1,000 - $5,000 lifetime value</span>
          </div>
          <div className="space-y-3">
            {segments.active.length > 0 ? (
              segments.active.slice(0, 5).map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">{contact.first_name} {contact.last_name}</p>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                  <span className="font-semibold text-accent">${(contact.lifetime_value || 0).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No active customers yet</p>
            )}
          </div>
        </div>

        {/* New Customers */}
        <div className="rounded-xl bg-card p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">New</Badge>
            <span className="text-sm text-muted-foreground">Under $1,000 lifetime value</span>
          </div>
          <div className="space-y-3">
            {segments.new.length > 0 ? (
              segments.new.slice(0, 5).map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">{contact.first_name} {contact.last_name}</p>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                  <span className="font-semibold text-foreground">${(contact.lifetime_value || 0).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No new customers yet</p>
            )}
          </div>
        </div>

        {/* At Risk */}
        <div className="rounded-xl bg-card p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-destructive/10 text-destructive border-destructive/20">At Risk</Badge>
            <span className="text-sm text-muted-foreground">No purchases yet</span>
          </div>
          <div className="space-y-3">
            {segments.atRisk.length > 0 ? (
              segments.atRisk.slice(0, 5).map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">{contact.first_name} {contact.last_name}</p>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">$0</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No at-risk customers</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Retention;
