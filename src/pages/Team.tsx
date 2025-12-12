import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, ListTodo, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useTasksByStatus, TaskStatus } from "@/hooks/useTasks";
import { TaskCard } from "@/components/team/TaskCard";
import { AddTaskDialog } from "@/components/team/AddTaskDialog";
import { cn } from "@/lib/utils";

const statusColumns: { status: TaskStatus; label: string; icon: typeof ListTodo; color: string }[] = [
  { status: "open", label: "Open", icon: ListTodo, color: "text-muted-foreground" },
  { status: "in_progress", label: "In Progress", icon: Clock, color: "text-warning" },
  { status: "completed", label: "Completed", icon: CheckCircle, color: "text-success" },
  { status: "blocked", label: "Blocked", icon: AlertCircle, color: "text-destructive" },
];

const Team = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { tasksByStatus, isLoading } = useTasksByStatus();

  if (isLoading) {
    return (
      <AppLayout title="TeamPilot">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  const totalTasks = Object.values(tasksByStatus).flat().length;

  return (
    <AppLayout title="TeamPilot">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Task Management</h2>
          <p className="text-muted-foreground">{totalTasks} total tasks</p>
        </div>
        <Button variant="teal" onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Task Columns */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statusColumns.map(({ status, label, icon: Icon, color }) => (
          <div key={status} className="bg-card rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Icon className={cn("h-5 w-5", color)} />
              <h3 className="font-heading font-semibold text-foreground">{label}</h3>
              <span className="ml-auto bg-secondary text-secondary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                {tasksByStatus[status].length}
              </span>
            </div>

            <div className="space-y-3">
              {tasksByStatus[status].length > 0 ? (
                tasksByStatus[status].map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No {label.toLowerCase()} tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <AddTaskDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </AppLayout>
  );
};

export default Team;
