import { Proposal, ProposalStatus, useUpdateProposalStatus, useDeleteProposal } from "@/hooks/useProposals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Send, Eye, CheckCircle, XCircle, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ProposalCardProps {
  proposal: Proposal;
}

const statusConfig: Record<ProposalStatus, { label: string; className: string; icon: typeof FileText }> = {
  draft: { label: "Draft", className: "bg-secondary text-secondary-foreground", icon: FileText },
  sent: { label: "Sent", className: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Send },
  viewed: { label: "Viewed", className: "bg-warning/10 text-warning border-warning/20", icon: Eye },
  accepted: { label: "Accepted", className: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};

export function ProposalCard({ proposal }: ProposalCardProps) {
  const updateStatus = useUpdateProposalStatus();
  const deleteProposal = useDeleteProposal();

  const config = statusConfig[proposal.status];
  const StatusIcon = config.icon;
  const contactName = proposal.contact 
    ? `${proposal.contact.first_name} ${proposal.contact.last_name || ""}`.trim()
    : "No contact";

  return (
    <div className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium text-foreground truncate">{proposal.title}</h4>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{contactName}</p>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className={config.className}>
              {config.label}
            </Badge>
            <span className="text-lg font-semibold text-foreground">
              ${Number(proposal.amount).toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(proposal.created_at), "MMM d, yyyy")}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {proposal.status === "draft" && (
              <DropdownMenuItem onClick={() => updateStatus.mutate({ id: proposal.id, status: "sent" })}>
                <Send className="h-4 w-4 mr-2" />
                Mark as Sent
              </DropdownMenuItem>
            )}
            {proposal.status === "sent" && (
              <DropdownMenuItem onClick={() => updateStatus.mutate({ id: proposal.id, status: "viewed" })}>
                <Eye className="h-4 w-4 mr-2" />
                Mark as Viewed
              </DropdownMenuItem>
            )}
            {(proposal.status === "sent" || proposal.status === "viewed") && (
              <>
                <DropdownMenuItem onClick={() => updateStatus.mutate({ id: proposal.id, status: "accepted" })}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Accepted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus.mutate({ id: proposal.id, status: "rejected" })}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark as Rejected
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              onClick={() => deleteProposal.mutate(proposal.id)}
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
