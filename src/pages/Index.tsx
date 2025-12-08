import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PipelineOverview } from "@/components/dashboard/PipelineOverview";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <AppLayout title="Dashboard">
      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in">
        <h2 className="text-2xl font-heading font-bold text-foreground">
          Good morning, John
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your business today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value="247"
          change="+12.5%"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Appointments"
          value="18"
          change="+4 today"
          changeType="positive"
          icon={Calendar}
          iconColor="bg-purple-500/10 text-purple-500"
        />
        <StatCard
          title="Revenue (MTD)"
          value="$48,250"
          change="+23.1%"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-success/10 text-success"
        />
        <StatCard
          title="Conversion Rate"
          value="24.8%"
          change="-2.3%"
          changeType="negative"
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
