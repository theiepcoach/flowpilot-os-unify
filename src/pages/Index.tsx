import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PipelineOverview } from "@/components/dashboard/PipelineOverview";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Users, Calendar, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { useLeadsByStatus } from "@/hooks/useLeads";
import { useAppointments } from "@/hooks/useAppointments";
import { useTransactionStats } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  const { leads, leadsByStatus, isLoading: leadsLoading } = useLeadsByStatus();
  const { data: appointments, isLoading: appointmentsLoading } = useAppointments();
  const { stats, isLoading: transactionsLoading } = useTransactionStats();

  const isLoading = leadsLoading || appointmentsLoading || transactionsLoading;

  const totalLeads = leads?.length || 0;
  const wonLeads = leadsByStatus.won.length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0";
  const todayAppointments = appointments?.filter(
    (a) => new Date(a.start_time).toDateString() === new Date().toDateString()
  ).length || 0;

  if (isLoading) {
    return (
      <AppLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard">
      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in">
        <h2 className="text-2xl font-heading font-bold text-foreground">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your business today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
          change={`${todayAppointments} today`}
          changeType="positive"
          icon={Calendar}
          iconColor="bg-purple-500/10 text-purple-500"
        />
        <StatCard
          title="Revenue (MTD)"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={`$${stats.netProfit.toLocaleString()} profit`}
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

      {/* Quick Actions */}
      <div className="mb-8">
        <QuickActions />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <PipelineOverview />
          <RevenueChart />
          <UpcomingAppointments />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <RecentActivity />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
