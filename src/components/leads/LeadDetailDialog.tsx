import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  FileText,
  DollarSign,
  Sparkles,
  Clock,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { Lead, useUpdateLead } from "@/hooks/useLeads";
import { formatDistanceToNow, format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LeadDetailDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadDetailDialog({ lead, open, onOpenChange }: LeadDetailDialogProps) {
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [generatingSms, setGeneratingSms] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [generatedType, setGeneratedType] = useState<'email' | 'sms' | null>(null);
  const [copied, setCopied] = useState(false);
  const updateLead = useUpdateLead();

  if (!lead) return null;

  const contact = lead.contact;
  const name = contact
    ? `${contact.first_name}${contact.last_name ? ` ${contact.last_name}` : ""}`
    : "Unknown";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const generateFollowUp = async (type: 'email' | 'sms') => {
    const setLoading = type === 'email' ? setGeneratingEmail : setGeneratingSms;
    setLoading(true);
    setGeneratedContent(null);

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
        console.error('Error generating follow-up:', error);
        toast.error(error.message || 'Failed to generate follow-up');
        return;
      }

      setGeneratedContent(data.content);
      setGeneratedType(type);
      toast.success(`${type === 'email' ? 'Email' : 'SMS'} generated successfully!`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate follow-up');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedContent) return;
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNotesChange = (notes: string) => {
    updateLead.mutate({ id: lead.id, data: { notes } });
  };

  const statusColors: Record<string, string> = {
    new: "bg-blue-500",
    contacted: "bg-purple-500",
    qualified: "bg-teal",
    won: "bg-success",
    lost: "bg-destructive",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-secondary text-secondary-foreground text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-xl font-heading">{name}</DialogTitle>
                <Badge className={`${statusColors[lead.status]} text-white`}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                {contact?.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    <span>{contact.email}</span>
                  </div>
                )}
                {contact?.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    <span>{contact.phone}</span>
                  </div>
                )}
              </div>
              {lead.lead_source && (
                <p className="text-sm text-muted-foreground mt-1">Source: {lead.lead_source}</p>
              )}
            </div>
            <div className="text-right text-sm text-muted-foreground">
              {lead.score !== null && lead.score > 0 && (
                <Badge variant="outline" className="mb-2">Score: {lead.score}</Badge>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>
                  {lead.last_activity_at
                    ? formatDistanceToNow(new Date(lead.last_activity_at), { addSuffix: true })
                    : "No activity"}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ai-followup">AI Follow-Up</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="p-6">
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">Appointments</span>
                    </div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">scheduled</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm font-medium">Messages</span>
                    </div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">sent/received</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">Proposals</span>
                    </div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">created</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm font-medium">Revenue</span>
                    </div>
                    <p className="text-2xl font-bold">$0</p>
                    <p className="text-xs text-muted-foreground">lifetime value</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="rounded-lg border border-border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Full Name</span>
                      <span>{name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span>{contact?.email || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <span>{contact?.phone || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span>{format(new Date(lead.created_at), 'PPP')}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai-followup" className="mt-0 space-y-4">
                <div className="flex gap-3">
                  <Button
                    variant="teal"
                    onClick={() => generateFollowUp('email')}
                    disabled={generatingEmail || generatingSms}
                  >
                    {generatingEmail ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate Email
                  </Button>
                  <Button
                    variant="teal-outline"
                    onClick={() => generateFollowUp('sms')}
                    disabled={generatingEmail || generatingSms}
                  >
                    {generatingSms ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate SMS
                  </Button>
                </div>

                {generatedContent && (
                  <div className="rounded-lg border border-border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {generatedType === 'email' ? 'Email' : 'SMS'} Generated
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                        {copied ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
                        Copy
                      </Button>
                    </div>
                    <div className="whitespace-pre-wrap text-sm">{generatedContent}</div>
                  </div>
                )}

                {!generatedContent && (
                  <div className="rounded-lg border border-dashed border-border p-8 text-center">
                    <Sparkles className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Click a button above to generate AI-powered follow-up content
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="timeline" className="mt-0">
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Timeline events will appear here as you interact with this lead
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-0 space-y-4">
                <Textarea
                  placeholder="Add notes about this lead..."
                  defaultValue={lead.notes || ''}
                  onBlur={(e) => handleNotesChange(e.target.value)}
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  Notes are automatically saved when you click away
                </p>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
