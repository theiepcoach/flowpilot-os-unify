import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Send, Eye, CheckCircle, Loader2 } from "lucide-react";
import { useProposalStats } from "@/hooks/useProposals";
import { ProposalCard } from "@/components/proposals/ProposalCard";
import { AddProposalDialog } from "@/components/proposals/AddProposalDialog";

const Proposals = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { stats, proposals, isLoading } = useProposalStats();

  if (isLoading) {
    return (
      <AppLayout title="ProposalPilot">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="ProposalPilot">
      {/* Stats */}
      <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Proposals"
          value={stats.total.toString()}
          change={`$${stats.totalValue.toLocaleString()} value`}
          changeType="neutral"
          icon={FileText}
          iconColor="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Pending"
          value={(stats.sent + stats.viewed).toString()}
          change="Awaiting response"
          changeType="neutral"
          icon={Send}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="Viewed"
          value={stats.viewed.toString()}
          change="Client engaged"
          changeType="positive"
          icon={Eye}
          iconColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Accepted"
          value={stats.accepted.toString()}
          change={`$${stats.acceptedValue.toLocaleString()} won`}
          changeType="positive"
          icon={CheckCircle}
          iconColor="bg-success/10 text-success"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">All Proposals</h2>
        <Button variant="teal" onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Proposal
        </Button>
      </div>

      {/* Proposals Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {proposals && proposals.length > 0 ? (
          proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No proposals yet. Create your first proposal to get started.
          </div>
        )}
      </div>

      <AddProposalDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </AppLayout>
  );
};

export default Proposals;
