import { cn } from "@/lib/utils";
import { useLeadsByStatus } from "@/hooks/useLeads";
import { Loader2 } from "lucide-react";

interface PipelineStage {
  name: string;
  count: number;
  color: string;
  status: string;
}

const stageConfig: Omit<PipelineStage, "count">[] = [
  { name: "New", color: "bg-blue-500", status: "new" },
  { name: "Contacted", color: "bg-purple-500", status: "contacted" },
  { name: "Qualified", color: "bg-accent", status: "qualified" },
  { name: "Won", color: "bg-success", status: "won" },
  { name: "Lost", color: "bg-destructive", status: "lost" },
];

export function PipelineOverview() {
  const { leads, leadsByStatus, isLoading } = useLeadsByStatus();

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-md flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const stages: PipelineStage[] = stageConfig.map((stage) => ({
    ...stage,
    count: leadsByStatus[stage.status as keyof typeof leadsByStatus]?.length || 0,
  }));

  const totalLeads = leads?.length || 0;
  const activeLeads = stages.filter(s => s.status !== "lost").reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="rounded-xl bg-card p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Sales Pipeline
          </h3>
          <p className="text-sm text-muted-foreground">{activeLeads} active leads</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-heading font-bold text-foreground">
            {totalLeads}
          </p>
          <p className="text-sm text-muted-foreground">Total leads</p>
        </div>
      </div>

      {/* Pipeline bar */}
      <div className="mb-6 flex h-3 overflow-hidden rounded-full bg-secondary">
        {stages.map((stage, index) => {
          const percentage = totalLeads > 0 ? (stage.count / totalLeads) * 100 : 0;
          return (
            <div
              key={stage.name}
              className={cn("h-full transition-all duration-500", stage.color)}
              style={{ 
                width: `${percentage}%`,
                animationDelay: `${index * 100}ms`
              }}
            />
          );
        })}
      </div>

      {/* Stage breakdown */}
      <div className="grid grid-cols-5 gap-4">
        {stages.map((stage) => (
          <div key={stage.name} className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <div className={cn("h-2.5 w-2.5 rounded-full", stage.color)} />
              <span className="text-xs font-medium text-muted-foreground">
                {stage.name}
              </span>
            </div>
            <p className="text-lg font-semibold text-foreground">{stage.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
