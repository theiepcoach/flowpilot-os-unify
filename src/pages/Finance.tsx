import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Sparkles,
  CreditCard,
  Wallet,
  PiggyBank
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { cn } from "@/lib/utils";

const cashFlowData = [
  { date: "Week 1", inflow: 18500, outflow: 12200 },
  { date: "Week 2", inflow: 22300, outflow: 14800 },
  { date: "Week 3", inflow: 15600, outflow: 11200 },
  { date: "Week 4", inflow: 28900, outflow: 16500 },
];

const expenseCategories = [
  { name: "Payroll", value: 35000, color: "hsl(165 82% 51%)" },
  { name: "Software", value: 8500, color: "hsl(213 68% 11%)" },
  { name: "Marketing", value: 12000, color: "hsl(38 92% 50%)" },
  { name: "Operations", value: 6800, color: "hsl(215 25% 27%)" },
  { name: "Other", value: 4200, color: "hsl(215 15% 50%)" },
];

const transactions = [
  { id: "1", description: "Project payment - Tech Corp", amount: 12500, type: "income", category: "Revenue", date: "Today" },
  { id: "2", description: "Software subscription - Figma", amount: -42, type: "expense", category: "Software", date: "Today" },
  { id: "3", description: "Client retainer - Acme Inc", amount: 5000, type: "income", category: "Revenue", date: "Yesterday" },
  { id: "4", description: "Marketing ads - Google", amount: -850, type: "expense", category: "Marketing", date: "Yesterday" },
  { id: "5", description: "Contractor payment", amount: -2400, type: "expense", category: "Payroll", date: "2 days ago" },
  { id: "6", description: "Consulting fee - Global Net", amount: 8200, type: "income", category: "Revenue", date: "3 days ago" },
];

function AIInsightCard() {
  return (
    <div className="rounded-xl bg-gradient-to-br from-navy to-navy-light p-6 text-primary-foreground">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-semibold mb-2">AI Financial Insight</h3>
          <p className="text-sm text-primary-foreground/80 leading-relaxed">
            Your revenue is up <span className="text-accent font-semibold">23%</span> this month, 
            primarily driven by the Tech Corp project. Consider allocating 15% of the surplus to 
            emergency reserves. Marketing spend efficiency has improved by 12%.
          </p>
          <Button variant="teal" size="sm" className="mt-4">
            View Full Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}

const Finance = () => {
  const totalExpenses = expenseCategories.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <AppLayout title="FinancePilot">
      {/* Stats */}
      <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue (MTD)"
          value="$68,450"
          change="+23.1%"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-success/10 text-success"
        />
        <StatCard
          title="Expenses (MTD)"
          value="$42,800"
          change="+8.5%"
          changeType="negative"
          icon={CreditCard}
          iconColor="bg-destructive/10 text-destructive"
        />
        <StatCard
          title="Net Profit"
          value="$25,650"
          change="+41.2%"
          changeType="positive"
          icon={Wallet}
          iconColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Cash Reserves"
          value="$124,500"
          change="+$12,400"
          changeType="positive"
          icon={PiggyBank}
          iconColor="bg-blue-500/10 text-blue-500"
        />
      </div>

      {/* AI Insight */}
      <div className="mb-6">
        <AIInsightCard />
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 rounded-xl bg-card p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">Cash Flow</h3>
              <p className="text-sm text-muted-foreground">Last 4 weeks</p>
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
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="rounded-xl bg-card p-6 shadow-md">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Expense Breakdown</h3>
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
            <Button variant="teal" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  tx.type === "income" ? "bg-success/10" : "bg-destructive/10"
                )}>
                  {tx.type === "income" ? (
                    <ArrowUpRight className="h-5 w-5 text-success" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{tx.description}</p>
                  <p className="text-sm text-muted-foreground">{tx.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-semibold",
                  tx.type === "income" ? "text-success" : "text-destructive"
                )}>
                  {tx.type === "income" ? "+" : ""}${Math.abs(tx.amount).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Finance;
