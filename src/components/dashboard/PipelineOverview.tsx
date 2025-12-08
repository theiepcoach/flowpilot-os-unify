import { cn } from "@/lib/utils";

interface PipelineStage {
  name: string;
  count: number;
  value: string;
  color: string;
}

const stages: PipelineStage[] = [
  { name: "New", count: 12, value: "$24,000", color: "bg-blue-500" },
  { name: "Contacted", count: 8, value: "$18,500", color: "bg-purple-500" },
  { name: "Qualified", count: 5, value: "$42,000", color: "bg-accent" },
  { name: "Proposal", count: 3, value: "$28,000", color: "bg-orange-500" },
  { name: "Won", count: 7, value: "$156,000", color: "bg-success" },
];

const totalValue = stages.reduce((acc, stage) => acc + parseInt(stage.value.replace(/[$,]/g, '')), 0);

export function PipelineOverview() {
  return (
    <div className="rounded-xl bg-card p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Sales Pipeline
          </h3>
          <p className="text-sm text-muted-foreground">35 active leads</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-heading font-bold text-foreground">
            ${totalValue.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total value</p>
        </div>
      </div>

      {/* Pipeline bar */}
      <div className="mb-6 flex h-3 overflow-hidden rounded-full bg-secondary">
        {stages.map((stage, index) => {
          const percentage = (parseInt(stage.value.replace(/[$,]/g, '')) / totalValue) * 100;
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
            <p className="text-xs text-muted-foreground">{stage.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
