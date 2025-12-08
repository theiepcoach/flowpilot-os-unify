import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Phone,
  Mail,
  Sparkles,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  value: string;
  source: string;
  lastActivity: string;
}

interface PipelineColumn {
  id: string;
  title: string;
  color: string;
  leads: Lead[];
}

const pipelineData: PipelineColumn[] = [
  {
    id: "new",
    title: "New",
    color: "bg-blue-500",
    leads: [
      { id: "1", name: "Sarah Johnson", email: "sarah@techcorp.com", phone: "+1 555-0101", company: "Tech Corp", value: "$8,500", source: "Website", lastActivity: "2 hours ago" },
      { id: "2", name: "Michael Brown", email: "m.brown@startup.io", phone: "+1 555-0102", company: "Startup.io", value: "$12,000", source: "Referral", lastActivity: "5 hours ago" },
      { id: "3", name: "Emma Wilson", email: "emma@design.co", phone: "+1 555-0103", company: "Design Co", value: "$4,200", source: "LinkedIn", lastActivity: "1 day ago" },
    ],
  },
  {
    id: "contacted",
    title: "Contacted",
    color: "bg-purple-500",
    leads: [
      { id: "4", name: "James Lee", email: "james@enterprise.com", phone: "+1 555-0104", company: "Enterprise Inc", value: "$25,000", source: "Cold Email", lastActivity: "3 hours ago" },
      { id: "5", name: "Lisa Chen", email: "lisa@global.net", phone: "+1 555-0105", company: "Global Net", value: "$18,500", source: "Website", lastActivity: "1 day ago" },
    ],
  },
  {
    id: "qualified",
    title: "Qualified",
    color: "bg-teal",
    leads: [
      { id: "6", name: "David Kim", email: "david@solutions.co", phone: "+1 555-0106", company: "Solutions Co", value: "$42,000", source: "Partner", lastActivity: "6 hours ago" },
      { id: "7", name: "Anna Martinez", email: "anna@agency.com", phone: "+1 555-0107", company: "Creative Agency", value: "$15,800", source: "Referral", lastActivity: "2 days ago" },
    ],
  },
  {
    id: "proposal",
    title: "Proposal",
    color: "bg-orange-500",
    leads: [
      { id: "8", name: "Robert Taylor", email: "r.taylor@corp.com", phone: "+1 555-0108", company: "Corp Ltd", value: "$65,000", source: "Website", lastActivity: "1 hour ago" },
    ],
  },
  {
    id: "won",
    title: "Won",
    color: "bg-success",
    leads: [
      { id: "9", name: "Jennifer White", email: "jen@media.io", phone: "+1 555-0109", company: "Media IO", value: "$32,000", source: "Event", lastActivity: "3 days ago" },
      { id: "10", name: "Chris Anderson", email: "chris@tech.co", phone: "+1 555-0110", company: "Tech Co", value: "$28,500", source: "Referral", lastActivity: "5 days ago" },
    ],
  },
];

function LeadCard({ lead }: { lead: Lead }) {
  const initials = lead.name.split(" ").map(n => n[0]).join("");
  
  return (
    <div className="group relative rounded-lg bg-card border border-border p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-accent/30 cursor-grab active:cursor-grabbing">
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
            <p className="font-medium text-foreground text-sm">{lead.name}</p>
            <p className="text-xs text-muted-foreground">{lead.company}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Phone className="h-3.5 w-3.5" />
          <span>{lead.phone}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-sm font-semibold text-foreground">{lead.value}</span>
        <Badge variant="secondary" className="text-xs">
          {lead.source}
        </Badge>
      </div>

      {/* AI Actions */}
      <div className="mt-3 pt-3 border-t border-border flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" className="flex-1 text-xs h-8">
          <Sparkles className="h-3.5 w-3.5 mr-1 text-accent" />
          AI Email
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 text-xs h-8">
          <Sparkles className="h-3.5 w-3.5 mr-1 text-accent" />
          AI SMS
        </Button>
      </div>
    </div>
  );
}

function PipelineColumn({ column }: { column: PipelineColumn }) {
  const totalValue = column.leads.reduce((sum, lead) => {
    return sum + parseInt(lead.value.replace(/[$,]/g, ''));
  }, 0);

  return (
    <div className="flex flex-col min-w-[300px] max-w-[300px]">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 bg-card rounded-t-xl border border-b-0 border-border">
        <div className="flex items-center gap-2">
          <div className={cn("h-3 w-3 rounded-full", column.color)} />
          <span className="font-semibold text-foreground">{column.title}</span>
          <Badge variant="secondary" className="text-xs">
            {column.leads.length}
          </Badge>
        </div>
        <span className="text-sm text-muted-foreground">
          ${totalValue.toLocaleString()}
        </span>
      </div>

      {/* Cards Container */}
      <div className="flex-1 space-y-3 p-3 bg-secondary/30 rounded-b-xl border border-t-0 border-border min-h-[500px]">
        {column.leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        
        {/* Add Lead Button */}
        <button className="w-full p-3 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Add lead</span>
        </button>
      </div>
    </div>
  );
}

const Leads = () => {
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
          <Button variant="teal" size="default">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Pipeline Kanban */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4">
          {pipelineData.map((column) => (
            <PipelineColumn key={column.id} column={column} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Leads;
