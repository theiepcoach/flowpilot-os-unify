import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Sparkles,
  CreditCard,
  Wallet,
  PiggyBank,
  Loader2
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { useTransactions, useTransactionStats } from "@/hooks/useTransactions";
import { AddTransactionDialog } from "@/components/finance/AddTransactionDialog";
import { format } from "date-fns";

function AIInsightCard({ revenue, expenses }: { revenue: number; expenses: number }) {
  const profitMargin = revenue > 0 ? ((revenue - expenses) / revenue * 100).toFixed(1) : 0;
  
  return (
    <div className="rounded-xl bg-gradient-to-br from-navy to-navy-light p-6 text-primary-foreground">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-semibold mb-2">AI Financial Insight</h3>
          <p className="text-sm text-primary-foreground/80 leading-relaxed">
            Your profit margin is <span className="text-accent font-semibold">{profitMargin}%</span>. 
            {Number(profitMargin) > 20 
              ? " Great performance! Consider allocating surplus to growth initiatives."
              : " Focus on reducing expenses or increasing revenue to improve margins."}
          </p>
          <Button variant="teal" size="sm" className="mt-4">
            View Full Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}

const EXPENSE_COLORS = [
  "hsl(165 82% 51%)",
  "hsl(213 68% 11%)",
  "hsl(38 92% 50%)",
  "hsl(215 25% 27%)",
  "hsl(215 15% 50%)",
];

const Finance = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { stats, transactions, isLoading } = useTransactionStats();

  // Prepare expense breakdown data
  const expenseCategories = Object.entries(stats.expensesByCategory).map(([name, value], index) => ({
    name,
    value,
    color: EXPENSE_COLORS[index % EXPENSE_COLORS.length],
  }));

  // Prepare cash flow data (group by week)
  const cashFlowData = transactions?.reduce((acc, tx) => {
    const weekKey = format(new Date(tx.date), "MMM d");
    const existing = acc.find((item) => item.date === weekKey);
    if (existing) {
      if (tx.type === "revenue") existing.inflow += Number(tx.amount);
      else existing.outflow += Number(tx.amount);
    } else {
      acc.push({
        date: weekKey,
        inflow: tx.type === "revenue" ? Number(tx.amount) : 0,
        outflow: tx.type === "expense" ? Number(tx.amount) : 0,
      });
    }
    return acc;
  }, [] as { date: string; inflow: number; outflow: number }[]).slice(0, 8).reverse() || [];

  if (isLoading) {
    return (
      <AppLayout title="FinancePilot">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="FinancePilot">
      {/* Stats */}
      <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue (MTD)"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change="+23.1%"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-success/10 text-success"
        />
        <StatCard
          title="Expenses (MTD)"
          value={`$${stats.totalExpenses.toLocaleString()}`}
          change="+8.5%"
          changeType="negative"
          icon={CreditCard}
          iconColor="bg-destructive/10 text-destructive"
        />
        <StatCard
          title="Net Profit"
          value={`$${stats.netProfit.toLocaleString()}`}
          change={stats.netProfit > 0 ? "+41.2%" : "-"}
          changeType={stats.netProfit > 0 ? "positive" : "negative"}
          icon={Wallet}
          iconColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Transactions"
          value={transactions?.length.toString() || "0"}
          change="This month"
          changeType="neutral"
          icon={PiggyBank}
          iconColor="bg-blue-500/10 text-blue-500"
        />
      </div>

      {/* AI Insight */}
      <div className="mb-6">
        <AIInsightCard revenue={stats.totalRevenue} expenses={stats.totalExpenses} />
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 rounded-xl bg-card p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">Cash Flow</h3>
              <p className="text-sm text-muted-foreground">Recent transactions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-accent" />
                <span className="text-sm text-muted-foreground">Inflow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/50" />
                <span className="text-sm text-muted-foreground">Outflow</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            {cashFlowData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData}>
                  <defs>
                    <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(165 82% 51%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(165 82% 51%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 90%)" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 15% 50%)", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215 15% 50%)", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(214 20% 90%)", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="outflow" stroke="hsl(0 84% 60%)" strokeWidth={2} fill="url(#outflowGrad)" />
                  <Area type="monotone" dataKey="inflow" stroke="hsl(165 82% 51%)" strokeWidth={2} fill="url(#inflowGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No transaction data yet
              </div>
            )}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="rounded-xl bg-card p-6 shadow-md">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Expense Breakdown</h3>
          {expenseCategories.length > 0 ? (
            <>
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      dataKey="value"
                      stroke="none"
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {expenseCategories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm text-muted-foreground">{cat.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      ${cat.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              No expenses recorded yet
            </div>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-xl bg-card p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-heading font-semibold text-foreground">Recent Transactions</h3>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="teal" size="sm" onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {transactions && transactions.length > 0 ? (
            transactions.slice(0, 10).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    tx.type === "revenue" ? "bg-success/10" : "bg-destructive/10"
                  )}>
                    {tx.type === "revenue" ? (
                      <ArrowUpRight className="h-5 w-5 text-success" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{tx.description || "Transaction"}</p>
                    <p className="text-sm text-muted-foreground">{tx.category || "Uncategorized"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-semibold",
                    tx.type === "revenue" ? "text-success" : "text-destructive"
                  )}>
                    {tx.type === "revenue" ? "+" : "-"}${Number(tx.amount).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">{format(new Date(tx.date), "MMM d")}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet. Add your first transaction to get started.
            </div>
          )}
        </div>
      </div>

      <AddTransactionDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </AppLayout>
  );
};

export default Finance;
