import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Loader2 } from "lucide-react";
import { useAutomations } from "@/hooks/useAutomations";
import { AutomationCard } from "@/components/automations/AutomationCard";
import { AddAutomationDialog } from "@/components/automations/AddAutomationDialog";

const Automations = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { data: automations, isLoading } = useAutomations();

  if (isLoading) {
    return (
      <AppLayout title="AutomatePilot">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  const activeCount = automations?.filter((a) => a.active).length || 0;

  return (
    <AppLayout title="AutomatePilot">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Workflow Automations</h2>
          <p className="text-muted-foreground">
            {automations?.length || 0} automations • {activeCount} active
          </p>
        </div>
        <Button variant="teal" onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {/* Info Card */}
      <div className="rounded-xl bg-gradient-to-br from-navy to-navy-light p-6 text-primary-foreground mb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
            <Zap className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold mb-2">Automate Your Workflows</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Create powerful automations that trigger on events like lead creation, 
              appointment completion, or proposal acceptance. Connect to Make.com for 
              advanced integrations with external services.
            </p>
          </div>
        </div>
      </div>

      {/* Automations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {automations && automations.length > 0 ? (
          automations.map((automation) => (
            <AutomationCard key={automation.id} automation={automation} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No automations yet. Create your first automation to streamline your workflows.
          </div>
        )}
      </div>

      <AddAutomationDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </AppLayout>
  );
};

export default Automations;
