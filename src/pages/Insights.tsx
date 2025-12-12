import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, Calendar, DollarSign, TrendingUp, FileText, Loader2 } from "lucide-react";
import { useLeadsByStatus } from "@/hooks/useLeads";
import { useAppointments } from "@/hooks/useAppointments";
import { useTransactionStats } from "@/hooks/useTransactions";
import { useProposalStats } from "@/hooks/useProposals";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell, PieChart, Pie } from "recharts";

const Insights = () => {
  const { leadsByStatus, leads, isLoading: leadsLoading } = useLeadsByStatus();
  const { data: appointments, isLoading: appointmentsLoading } = useAppointments();
  const { stats: transactionStats, isLoading: transactionsLoading } = useTransactionStats();
  const { stats: proposalStats, isLoading: proposalsLoading } = useProposalStats();

  const isLoading = leadsLoading || appointmentsLoading || transactionsLoading || proposalsLoading;

  if (isLoading) {
    return (
      <AppLayout title="InsightPilot">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  const totalLeads = leads?.length || 0;
  const wonLeads = leadsByStatus.won.length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0";

  const appointmentsByStatus = {
    scheduled: appointments?.filter((a) => a.status === "scheduled").length || 0,
    completed: appointments?.filter((a) => a.status === "completed").length || 0,
    no_show: appointments?.filter((a) => a.status === "no_show").length || 0,
    cancelled: appointments?.filter((a) => a.status === "cancelled").length || 0,
  };

  const pipelineData = [
    { name: "New", value: leadsByStatus.new.length, color: "hsl(215 15% 50%)" },
    { name: "Contacted", value: leadsByStatus.contacted.length, color: "hsl(38 92% 50%)" },
    { name: "Qualified", value: leadsByStatus.qualified.length, color: "hsl(165 82% 51%)" },
    { name: "Won", value: leadsByStatus.won.length, color: "hsl(142 76% 36%)" },
    { name: "Lost", value: leadsByStatus.lost.length, color: "hsl(0 84% 60%)" },
  ];

  const proposalWinRate = proposalStats.total > 0 
    ? ((proposalStats.accepted / proposalStats.total) * 100).toFixed(1) 
    : "0";

  return (
    <AppLayout title="InsightPilot">
      {/* Key Metrics */}
      <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={totalLeads.toString()}
          change={`${wonLeads} won`}
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Appointments"
          value={(appointments?.length || 0).toString()}
          change={`${appointmentsByStatus.completed} completed`}
          changeType="positive"
          icon={Calendar}
          iconColor="bg-purple-500/10 text-purple-500"
        />
        <StatCard
          title="Revenue"
          value={`$${transactionStats.totalRevenue.toLocaleString()}`}
          change={`$${transactionStats.netProfit.toLocaleString()} profit`}
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-success/10 text-success"
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          change="Leads to won"
          changeType="neutral"
          icon={TrendingUp}
          iconColor="bg-accent/10 text-accent"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Lead Pipeline */}
        <div className="rounded-xl bg-card p-6 shadow-md">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Lead Pipeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Proposal Performance */}
        <div className="rounded-xl bg-card p-6 shadow-md">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Proposal Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-secondary">
              <p className="text-3xl font-bold text-foreground">{proposalStats.total}</p>
              <p className="text-sm text-muted-foreground">Total Proposals</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary">
              <p className="text-3xl font-bold text-success">{proposalWinRate}%</p>
              <p className="text-sm text-muted-foreground">Win Rate</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary">
              <p className="text-3xl font-bold text-accent">${(proposalStats.acceptedValue / 1000).toFixed(0)}k</p>
              <p className="text-sm text-muted-foreground">Won Value</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary">
              <p className="text-3xl font-bold text-warning">{proposalStats.sent + proposalStats.viewed}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Stats */}
      <div className="rounded-xl bg-card p-6 shadow-md">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Appointment Statistics</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="text-center p-4 rounded-lg border border-border">
            <p className="text-2xl font-bold text-foreground">{appointmentsByStatus.scheduled}</p>
            <p className="text-sm text-muted-foreground">Scheduled</p>
          </div>
          <div className="text-center p-4 rounded-lg border border-success/20 bg-success/5">
            <p className="text-2xl font-bold text-success">{appointmentsByStatus.completed}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <div className="text-center p-4 rounded-lg border border-warning/20 bg-warning/5">
            <p className="text-2xl font-bold text-warning">{appointmentsByStatus.no_show}</p>
            <p className="text-sm text-muted-foreground">No Shows</p>
          </div>
          <div className="text-center p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <p className="text-2xl font-bold text-destructive">{appointmentsByStatus.cancelled}</p>
            <p className="text-sm text-muted-foreground">Cancelled</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Insights;
