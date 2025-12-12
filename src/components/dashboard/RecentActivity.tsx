import { cn } from "@/lib/utils";
import { Users, Calendar, FileText, MessageSquare, DollarSign, Loader2 } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";
import { useAppointments } from "@/hooks/useAppointments";
import { useTransactions } from "@/hooks/useTransactions";
import { useProposals } from "@/hooks/useProposals";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "lead" | "appointment" | "proposal" | "message" | "payment";
  title: string;
  description: string;
  time: string;
  timestamp: Date;
}

const typeConfig = {
  lead: { icon: Users, color: "bg-blue-500/10 text-blue-500" },
  appointment: { icon: Calendar, color: "bg-purple-500/10 text-purple-500" },
  proposal: { icon: FileText, color: "bg-accent/10 text-accent" },
  message: { icon: MessageSquare, color: "bg-orange-500/10 text-orange-500" },
  payment: { icon: DollarSign, color: "bg-success/10 text-success" },
};

export function RecentActivity() {
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const { data: appointments, isLoading: appointmentsLoading } = useAppointments();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();
  const { data: proposals, isLoading: proposalsLoading } = useProposals();

  const isLoading = leadsLoading || appointmentsLoading || transactionsLoading || proposalsLoading;

  const activities = useMemo(() => {
    const items: ActivityItem[] = [];

    // Add recent leads
    leads?.slice(0, 3).forEach((lead) => {
      items.push({
        id: `lead-${lead.id}`,
        type: "lead",
        title: "New lead captured",
        description: `${lead.contact?.first_name || "Unknown"} ${lead.contact?.last_name || ""} - ${lead.lead_source || "Direct"}`,
        time: formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }),
        timestamp: new Date(lead.created_at),
      });
    });

    // Add recent appointments
    appointments?.slice(0, 3).forEach((apt) => {
      items.push({
        id: `apt-${apt.id}`,
        type: "appointment",
        title: "Appointment scheduled",
        description: apt.title,
        time: formatDistanceToNow(new Date(apt.created_at), { addSuffix: true }),
        timestamp: new Date(apt.created_at),
      });
    });

    // Add recent transactions (revenue)
    transactions
      ?.filter((tx) => tx.type === "revenue")
      .slice(0, 3)
      .forEach((tx) => {
        items.push({
          id: `tx-${tx.id}`,
          type: "payment",
          title: "Payment received",
          description: `$${Number(tx.amount).toLocaleString()} - ${tx.description || tx.category || "Payment"}`,
          time: formatDistanceToNow(new Date(tx.created_at), { addSuffix: true }),
          timestamp: new Date(tx.created_at),
        });
      });

    // Add recent proposals
    proposals?.slice(0, 3).forEach((prop) => {
      items.push({
        id: `prop-${prop.id}`,
        type: "proposal",
        title: prop.status === "accepted" ? "Proposal accepted" : "Proposal created",
        description: `$${Number(prop.amount).toLocaleString()} - ${prop.title}`,
        time: formatDistanceToNow(new Date(prop.created_at), { addSuffix: true }),
        timestamp: new Date(prop.created_at),
      });
    });

    // Sort by timestamp descending and take top 5
    return items
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);
  }, [leads, appointments, transactions, proposals]);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-md flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Recent Activity
        </h3>
        <button className="text-sm font-medium text-accent hover:underline">
          View all
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const config = typeConfig[activity.type];
            const Icon = config.icon;

            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    config.color
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
