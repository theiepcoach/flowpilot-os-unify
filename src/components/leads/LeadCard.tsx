import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Phone,
  Mail,
  Sparkles,
  GripVertical,
  Trash2,
  Edit,
  Eye,
  Loader2,
} from "lucide-react";
import { Lead, useDeleteLead } from "@/hooks/useLeads";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onView?: (lead: Lead) => void;
}

export function LeadCard({ lead, onEdit, onView }: LeadCardProps) {
  const deleteLead = useDeleteLead();
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [generatingSms, setGeneratingSms] = useState(false);
  
  const contact = lead.contact;
  const name = contact
    ? `${contact.first_name}${contact.last_name ? ` ${contact.last_name}` : ""}`
    : "Unknown";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const lastActivity = lead.last_activity_at
    ? formatDistanceToNow(new Date(lead.last_activity_at), { addSuffix: true })
    : "No activity";

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this lead?")) {
      deleteLead.mutate(lead.id);
    }
  };

  const generateFollowUp = async (type: 'email' | 'sms') => {
    const setLoading = type === 'email' ? setGeneratingEmail : setGeneratingSms;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-follow-up', {
        body: {
          type,
          leadName: name,
          email: contact?.email,
          phone: contact?.phone,
          leadSource: lead.lead_source,
          notes: lead.notes,
          lastActivity: lead.last_activity_at
            ? formatDistanceToNow(new Date(lead.last_activity_at), { addSuffix: true })
            : null,
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to generate follow-up');
        return;
      }

      await navigator.clipboard.writeText(data.content);
      toast.success(`${type === 'email' ? 'Email' : 'SMS'} copied to clipboard!`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate follow-up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative rounded-lg bg-card border border-border p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-accent/30">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground text-sm">{name}</p>
            {lead.lead_source && (
              <p className="text-xs text-muted-foreground">{lead.lead_source}</p>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(lead)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(lead)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Lead
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 mb-3">
        {contact?.email && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
        {contact?.phone && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />
            <span>{contact.phone}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          {lead.score !== null && lead.score > 0 && (
            <Badge variant="outline" className="text-xs">
              Score: {lead.score}
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{lastActivity}</span>
      </div>

      {/* AI Actions */}
      <div className="mt-3 pt-3 border-t border-border flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-xs h-8"
          onClick={() => generateFollowUp('email')}
          disabled={generatingEmail || generatingSms}
        >
          {generatingEmail ? (
            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5 mr-1 text-accent" />
          )}
          AI Email
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-xs h-8"
          onClick={() => generateFollowUp('sms')}
          disabled={generatingEmail || generatingSms}
        >
          {generatingSms ? (
            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5 mr-1 text-accent" />
          )}
          AI SMS
        </Button>
      </div>
    </div>
  );
}
