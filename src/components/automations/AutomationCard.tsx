import { Automation, useToggleAutomation, useDeleteAutomation, TRIGGER_TYPES } from "@/hooks/useAutomations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Zap } from "lucide-react";
import { format } from "date-fns";

interface AutomationCardProps {
  automation: Automation;
}

export function AutomationCard({ automation }: AutomationCardProps) {
  const toggleAutomation = useToggleAutomation();
  const deleteAutomation = useDeleteAutomation();

  const triggerLabel = TRIGGER_TYPES.find((t) => t.value === automation.trigger_type)?.label || automation.trigger_type;

  return (
    <div className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 shrink-0">
            <Zap className="h-5 w-5 text-accent" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground truncate mb-1">{automation.name}</h4>
            
            {automation.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {automation.description}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-navy/5 text-navy border-navy/20">
                {triggerLabel}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Created {format(new Date(automation.created_at), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={automation.active ?? false}
            onCheckedChange={(checked) => toggleAutomation.mutate({ id: automation.id, active: checked })}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => deleteAutomation.mutate(automation.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
