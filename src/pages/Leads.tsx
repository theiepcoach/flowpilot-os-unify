import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Sparkles, Loader2 } from "lucide-react";
import { useLeadsByStatus, LeadStatus, Lead } from "@/hooks/useLeads";
import { PipelineColumn } from "@/components/leads/PipelineColumn";
import { AddLeadDialog } from "@/components/leads/AddLeadDialog";

const PIPELINE_COLUMNS: { status: LeadStatus; title: string; color: string }[] = [
  { status: "new", title: "New", color: "bg-blue-500" },
  { status: "contacted", title: "Contacted", color: "bg-purple-500" },
  { status: "qualified", title: "Qualified", color: "bg-teal" },
  { status: "won", title: "Won", color: "bg-success" },
  { status: "lost", title: "Lost", color: "bg-destructive" },
];

const Leads = () => {
  const { leadsByStatus, isLoading, error } = useLeadsByStatus();
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<LeadStatus>("new");

  const handleAddLead = (status: LeadStatus) => {
    setDefaultStatus(status);
    setAddDialogOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    // TODO: Implement edit dialog
    console.log("Edit lead:", lead);
  };

  const handleViewLead = (lead: Lead) => {
    // TODO: Implement view dialog
    console.log("View lead:", lead);
  };

  // Filter leads by search query
  const filterLeads = (leads: Lead[]) => {
    if (!searchQuery) return leads;
    const query = searchQuery.toLowerCase();
    return leads.filter((lead) => {
      const contact = lead.contact;
      if (!contact) return false;
      return (
        contact.first_name?.toLowerCase().includes(query) ||
        contact.last_name?.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        lead.lead_source?.toLowerCase().includes(query)
      );
    });
  };

  if (error) {
    return (
      <AppLayout title="LeadPilot">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-destructive mb-2">Failed to load leads</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="LeadPilot">
      {/* Header Actions */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="w-64 pl-9 bg-card border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="default">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="teal-outline" size="default">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Insights
          </Button>
          <Button
            variant="teal"
            size="default"
            onClick={() => handleAddLead("new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Pipeline Kanban */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4">
            {PIPELINE_COLUMNS.map((column) => (
              <PipelineColumn
                key={column.status}
                status={column.status}
                title={column.title}
                color={column.color}
                leads={filterLeads(leadsByStatus[column.status])}
                onAddLead={handleAddLead}
                onEditLead={handleEditLead}
                onViewLead={handleViewLead}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Lead Dialog */}
      <AddLeadDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        defaultStatus={defaultStatus}
      />
    </AppLayout>
  );
};

export default Leads;
