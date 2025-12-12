import { Task, TaskStatus, useUpdateTaskStatus, useDeleteTask } from "@/hooks/useTasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, MoreHorizontal, Trash2, CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

const priorityConfig = {
  low: { label: "Low", className: "bg-secondary text-secondary-foreground" },
  medium: { label: "Medium", className: "bg-warning/10 text-warning border-warning/20" },
  high: { label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const statusConfig = {
  open: { icon: Circle, label: "Open" },
  in_progress: { icon: Clock, label: "In Progress" },
  completed: { icon: CheckCircle, label: "Completed" },
  blocked: { icon: AlertCircle, label: "Blocked" },
};

export function TaskCard({ task }: TaskCardProps) {
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();

  const StatusIcon = statusConfig[task.status].icon;

  return (
    <div className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className={cn(
              "h-4 w-4",
              task.status === "completed" && "text-success",
              task.status === "blocked" && "text-destructive",
              task.status === "in_progress" && "text-warning"
            )} />
            <h4 className={cn(
              "font-medium text-foreground truncate",
              task.status === "completed" && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h4>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={priorityConfig[task.priority].className}>
              {priorityConfig[task.priority].label}
            </Badge>
            
            {task.due_date && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(new Date(task.due_date), "MMM d")}
              </div>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(["open", "in_progress", "completed", "blocked"] as TaskStatus[]).map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => updateStatus.mutate({ id: task.id, status })}
                disabled={task.status === status}
              >
                Mark as {statusConfig[status].label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={() => deleteTask.mutate(task.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
