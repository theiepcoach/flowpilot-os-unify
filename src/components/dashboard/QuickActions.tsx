import { Plus, Calendar, FileText, Send, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { label: "Add Lead", icon: Plus, color: "bg-blue-500" },
  { label: "Schedule", icon: Calendar, color: "bg-purple-500" },
  { label: "Proposal", icon: FileText, color: "bg-accent" },
  { label: "Message", icon: Send, color: "bg-orange-500" },
  { label: "Automate", icon: Zap, color: "bg-yellow-500" },
];

export function QuickActions() {
  return (
    <div className="rounded-xl bg-card p-6 shadow-md">
      <h3 className="mb-4 text-lg font-heading font-semibold text-foreground">
        Quick Actions
      </h3>
      <div className="grid grid-cols-5 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-200 hover:bg-secondary"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color} text-white transition-transform duration-200 group-hover:scale-110`}
            >
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
