import MonthlyChart from "../components/charts/MonthlyChart.jsx";
import CategoryChart from "../components/charts/CategoryChart.jsx";
import InsightCard from "../components/InsightCard.jsx";
import useAnalytics from "../hooks/useAnalytics.js";
import useTransactions from "../hooks/useTransactions.js";
import { exportToCSV } from "../utils/exportCSV.js";
import { formatCurrency } from "../utils/format.js";

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
          className="btn-secondary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold shadow-sm disabled:opacity-40"
        >
          <i className="fa-solid fa-file-csv text-income-400 text-sm" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Balance */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">All-Time Balance</span>
            <div className="w-7 h-7 rounded-lg bg-dark-750 flex items-center justify-center text-primary-400">
              <i className="fa-solid fa-wallet text-xs" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary tabular-nums">
            {formatCurrency(summary.balance || 0)}
          </p>
        </div>

        {/* Income This Month */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Monthly Inflow</span>
            <div className="w-7 h-7 rounded-lg bg-income-500/15 flex items-center justify-center text-income-400">
              <i className="fa-solid fa-arrow-down-left text-xs" />
            </div>
          </div>
          <p className="text-2xl font-bold text-income-400 tabular-nums">
            +{formatCurrency(summary.thisMonth?.income || 0)}
          </p>
        </div>

        {/* Expense This Month */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Monthly Outflow</span>
            <div className="w-7 h-7 rounded-lg bg-expense-500/15 flex items-center justify-center text-expense-400">
              <i className="fa-solid fa-arrow-up-right text-xs" />
            </div>
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
              <i className="fa-solid fa-chart-column text-xs" />
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
              <i className="fa-solid fa-chart-pie text-xs" />
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
              <i className="fa-solid fa-receipt text-2xl text-dark-500 mb-2" />
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
              <i className="fa-solid fa-lightbulb text-xs" />
            </div>
          </div>

          <InsightCard transactions={transactions} />
        </div>
      </div>

    </div>
  );
};

export default Analytics;
