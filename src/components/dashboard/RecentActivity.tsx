import { cn } from "@/lib/utils";
import { Users, Calendar, FileText, MessageSquare, DollarSign } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "lead" | "appointment" | "proposal" | "message" | "payment";
  title: string;
  description: string;
  time: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "lead",
    title: "New lead captured",
    description: "Sarah Johnson from Tech Corp",
    time: "2 min ago",
  },
  {
    id: "2",
    type: "appointment",
    title: "Appointment scheduled",
    description: "Discovery call with Mike Chen",
    time: "15 min ago",
  },
  {
    id: "3",
    type: "proposal",
    title: "Proposal accepted",
    description: "$12,500 project with Acme Inc",
    time: "1 hour ago",
  },
  {
    id: "4",
    type: "message",
    title: "New message received",
    description: "Follow-up from David Wilson",
    time: "2 hours ago",
  },
  {
    id: "5",
    type: "payment",
    title: "Payment received",
    description: "$3,200 from Global Solutions",
    time: "3 hours ago",
  },
];

const typeConfig = {
  lead: { icon: Users, color: "bg-blue-500/10 text-blue-500" },
  appointment: { icon: Calendar, color: "bg-purple-500/10 text-purple-500" },
  proposal: { icon: FileText, color: "bg-accent/10 text-accent" },
  message: { icon: MessageSquare, color: "bg-orange-500/10 text-orange-500" },
  payment: { icon: DollarSign, color: "bg-success/10 text-success" },
};

export function RecentActivity() {
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
    </div>
  );
}
