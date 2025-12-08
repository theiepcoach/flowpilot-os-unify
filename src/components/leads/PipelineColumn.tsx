import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Lead, LeadStatus, useUpdateLeadStatus } from "@/hooks/useLeads";
import { LeadCard } from "./LeadCard";

interface PipelineColumnProps {
  status: LeadStatus;
  title: string;
  color: string;
  leads: Lead[];
  onAddLead: (status: LeadStatus) => void;
  onEditLead: (lead: Lead) => void;
  onViewLead: (lead: Lead) => void;
}

export function PipelineColumn({
  status,
  title,
  color,
  leads,
  onAddLead,
  onEditLead,
  onViewLead,
}: PipelineColumnProps) {
  const updateStatus = useUpdateLeadStatus();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("ring-2", "ring-accent");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("ring-2", "ring-accent");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("ring-2", "ring-accent");
    const leadId = e.dataTransfer.getData("leadId");
    if (leadId) {
      updateStatus.mutate({ id: leadId, status });
    }
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("leadId", leadId);
  };

  return (
    <div className="flex flex-col min-w-[300px] max-w-[300px]">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 bg-card rounded-t-xl border border-b-0 border-border">
        <div className="flex items-center gap-2">
          <div className={cn("h-3 w-3 rounded-full", color)} />
          <span className="font-semibold text-foreground">{title}</span>
          <Badge variant="secondary" className="text-xs">
            {leads.length}
          </Badge>
        </div>
      </div>

      {/* Cards Container */}
      <div
        className="flex-1 space-y-3 p-3 bg-secondary/30 rounded-b-xl border border-t-0 border-border min-h-[500px] transition-all"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {leads.map((lead) => (
          <div
            key={lead.id}
            draggable
            onDragStart={(e) => handleDragStart(e, lead.id)}
            className="cursor-grab active:cursor-grabbing"
          >
            <LeadCard
              lead={lead}
              onEdit={onEditLead}
              onView={onViewLead}
            />
          </div>
        ))}

        {/* Add Lead Button */}
        <button
          onClick={() => onAddLead(status)}
          className="w-full p-3 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Add lead</span>
        </button>
      </div>
    </div>
  );
}
