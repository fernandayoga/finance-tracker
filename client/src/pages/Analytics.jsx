import MonthlyChart from "../components/charts/MonthlyChart.jsx";
import CategoryChart from "../components/charts/CategoryChart.jsx";
import InsightCard from "../components/InsightCard.jsx";
import useAnalytics from "../hooks/useAnalytics.js";
import useTransactions from "../hooks/useTransactions.js";
import { exportToCSV } from "../utils/exportCSV.js";
import { formatCurrency } from "../utils/format.js";
import FlowBadge from "../components/ui/FlowBadge.jsx";
import {
  Download,
  Wallet,
  BarChart3,
  PieChart,
  Receipt,
  Lightbulb,
} from 'lucide-react';

const Analytics = () => {
  const { monthly, categories, loading } = useAnalytics();
  const { transactions, summary } = useTransactions();

  // Hitung total expense per kategori untuk list
  const totalExpense = categories.reduce((sum, c) => sum + c.value, 0);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-text-muted">Loading financial analytics...</p>
        </div>
      </div>
    );

  const categoryBarColors = [
    "#6366f1", // Indigo
    "#2dd4bf", // Soft Mint
    "#38bdf8", // Sky Blue
    "#fb7185", // Warm Coral
    "#a78bfa", // Soft Violet
    "#fbbf24", // Warm Amber
    "#34d399", // Mint Green
    "#818cf8", // Periwinkle
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Analytics & Trends</h1>
          <p className="text-xs text-text-muted mt-1">
            Visualizing cashflow trends, spending categories, and performance
          </p>
        </div>

        <button
          onClick={() => exportToCSV(transactions)}
          disabled={!transactions?.length}
          className="btn-secondary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold shadow-sm disabled:opacity-40 cursor-pointer"
        >
          <Download size={14} strokeWidth={2} className="text-income-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Balance */}
        <div className="stat-card group hover:border-primary-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">All-Time Balance</span>
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400/25 via-primary-500/15 to-primary-950/40 border border-primary-400/40 ring-1 ring-inset ring-white/15 flex items-center justify-center text-primary-300 shadow-[0_4px_16px_-2px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-transform duration-300">
              <span className="absolute inset-x-1.5 top-0.5 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
              <Wallet size={15} strokeWidth={2.4} fill="currentColor" fillOpacity={0.22} className="relative z-10 drop-shadow-[0_2px_6px_rgba(99,102,241,0.6)]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary tabular-nums">
            {formatCurrency(summary.balance || 0)}
          </p>
        </div>

        {/* Income This Month */}
        <div className="stat-card group hover:border-income-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Monthly Inflow</span>
            <FlowBadge type="income" size="sm" />
          </div>
          <p className="text-2xl font-bold text-income-400 tabular-nums">
            +{formatCurrency(summary.thisMonth?.income || 0)}
          </p>
        </div>

        {/* Expense This Month */}
        <div className="stat-card group hover:border-expense-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Monthly Outflow</span>
            <FlowBadge type="expense" size="sm" />
          </div>
          <p className="text-2xl font-bold text-expense-400 tabular-nums">
            -{formatCurrency(summary.thisMonth?.expense || 0)}
          </p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 12-Month Area / Bar Chart (2 cols) */}
        <div className="card lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-text-primary tracking-tight">
                Income vs Expense
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Comparative historical performance over the last 12 months
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-dark-750 border border-dark-600/60 flex items-center justify-center text-text-muted">
              <BarChart3 size={15} strokeWidth={2} />
            </div>
          </div>
          <MonthlyChart data={monthly} />
        </div>

        {/* Expense by Category Donut Chart (1 col) */}
        <div className="card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-text-primary tracking-tight">
                Category Share
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Current month distribution
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-dark-750 border border-dark-600/60 flex items-center justify-center text-text-muted">
              <PieChart size={15} strokeWidth={2} />
            </div>
          </div>
          <CategoryChart data={categories} />
        </div>
      </div>

      {/* Detailed Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Spending Categories with Progress Bars */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-text-primary tracking-tight">
                Top Spending Categories
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Categorized expenses ranked by highest total
              </p>
            </div>
            <span className="text-[11px] text-text-muted bg-dark-750 px-2 py-0.5 rounded-full border border-dark-600">
              {categories.length} categories
            </span>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <Receipt size={24} strokeWidth={1.8} className="text-dark-500 mx-auto mb-2" />
              <p className="text-xs">No expense data recorded this month</p>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {categories.map((cat, i) => {
                const percent = totalExpense > 0 ? ((cat.value / totalExpense) * 100).toFixed(1) : 0;
                const barColor = categoryBarColors[i % categoryBarColors.length];

                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: barColor }}
                        />
                        <span className="font-medium text-text-primary truncate">
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-medium tabular-nums flex-shrink-0">
                        <span className="text-text-muted">{percent}%</span>
                        <span className="text-text-primary font-semibold">
                          {formatCurrency(cat.value)}
                        </span>
                      </div>
                    </div>

                    {/* Clean Progress track */}
                    <div className="h-1.5 bg-dark-750 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Automated Weekly Insights */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-text-primary tracking-tight">
                Automated Insights
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Heuristic spending patterns and savings velocity
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-dark-750 border border-dark-600/60 flex items-center justify-center text-primary-400">
              <Lightbulb size={15} strokeWidth={2} />
            </div>
          </div>

          <InsightCard transactions={transactions} />
        </div>
      </div>

    </div>
  );
};

export default Analytics;
