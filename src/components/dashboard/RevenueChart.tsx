import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useTransactions } from "@/hooks/useTransactions";
import { Loader2 } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { useMemo } from "react";

export function RevenueChart() {
  const { data: transactions, isLoading } = useTransactions();

  const chartData = useMemo(() => {
    if (!transactions) return [];

    // Get last 7 months
    const months = [];
    for (let i = 6; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      months.push({
        month: format(date, "MMM"),
        start: startOfMonth(date),
        end: endOfMonth(date),
        revenue: 0,
        expenses: 0,
      });
    }

    // Aggregate transactions by month
    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const monthData = months.find(
        (m) => txDate >= m.start && txDate <= m.end
      );
      if (monthData) {
        if (tx.type === "revenue") {
          monthData.revenue += Number(tx.amount);
        } else {
          monthData.expenses += Number(tx.amount);
        }
      }
    });

    return months.map((m) => ({
      month: m.month,
      revenue: m.revenue,
      expenses: m.expenses,
    }));
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-md flex items-center justify-center h-80">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasData = chartData.some((d) => d.revenue > 0 || d.expenses > 0);

  return (
    <div className="rounded-xl bg-card p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Revenue Overview
          </h3>
          <p className="text-sm text-muted-foreground">Monthly performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-accent" />
            <span className="text-sm text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
            <span className="text-sm text-muted-foreground">Expenses</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        {!hasData ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No transaction data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(165 82% 51%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(165 82% 51%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(215 15% 50%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(215 15% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 90%)" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "hsl(215 15% 50%)", fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "hsl(215 15% 50%)", fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0 0% 100%)",
                  border: "1px solid hsl(214 20% 90%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px hsl(213 68% 11% / 0.08)",
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="hsl(215 15% 50%)"
                strokeWidth={2}
                fill="url(#expensesGradient)"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(165 82% 51%)"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
