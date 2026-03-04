import MainLayout from "../components/layout/MainLayout.jsx";
import MonthlyChart from "../components/charts/MonthlyChart.jsx";
import CategoryChart from "../components/charts/CategoryChart.jsx";
import InsightCard from "../components/InsightCard.jsx";
import useAnalytics from "../hooks/useAnalytics.js";
import useTransactions from "../hooks/useTransactions.js";
import { exportToCSV } from "../utils/exportCSV.js";
import { formatCurrency } from "../utils/format.js";
import Sidebar from "../components/layout/Sidebar.jsx";
import BottomNav from "../components/layout/BottomNav.jsx";
import MobileHeader from "../components/layout/MobileHeader.jsx";

const Analytics = () => {
  const { monthly, categories, loading } = useAnalytics();
  const { transactions, summary } = useTransactions();

  // Hitung total expense per kategori untuk list
  const totalExpense = categories.reduce((sum, c) => sum + c.value, 0);

  if (loading)
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar />
      <MobileHeader />

      <div
        style={{ marginLeft: "0" }}
        className="lg:ml-[224px] pt-16 lg:pt-0 pb-24 lg:pb-0"
      >
        <div
          style={{ maxWidth: "900px", margin: "0 auto" }}
          className="px-4 lg:px-8 py-6"
        >
          {/* semua konten analytics di sini, tidak ada yang berubah */}
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-text-primary">Analytics</h1>
              <p className="text-text-muted text-sm mt-0.5">
                Your financial overview
              </p>
            </div>
            <button
              onClick={() => exportToCSV(transactions)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-dark-700 border border-dark-500 text-text-secondary hover:text-text-primary hover:border-dark-400 transition-all"
            >
              <i className="fa-solid fa-file-csv text-income-400" />
              Export CSV
            </button>
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Total Balance",
                value: summary.balance,
                icon: "wallet",
                color: "text-primary-400",
                bg: "rgba(34,197,94,0.1)",
                border: "rgba(34,197,94,0.2)",
              },
              {
                label: "Income This Month",
                value: summary.thisMonth?.income,
                icon: "arrow-trend-up",
                color: "text-income-400",
                bg: "rgba(34,197,94,0.08)",
                border: "rgba(34,197,94,0.15)",
              },
              {
                label: "Expense This Month",
                value: summary.thisMonth?.expense,
                icon: "arrow-trend-down",
                color: "text-expense-400",
                bg: "rgba(244,63,94,0.08)",
                border: "rgba(244,63,94,0.15)",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="stat-card"
                style={{ background: s.bg, borderColor: s.border }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-text-secondary text-xs font-medium">
                    {s.label}
                  </p>
                  <i className={`fa-solid fa-${s.icon} text-xs ${s.color}`} />
                </div>
                <p className={`text-xl font-bold ${s.color}`}>
                  {formatCurrency(s.value || 0)}
                </p>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Monthly Area Chart — 2/3 width */}
            <div className="card lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">
                    Income vs Expense
                  </h2>
                  <p className="text-text-muted text-xs mt-0.5">
                    Last 12 months
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center">
                  <i className="fa-solid fa-chart-area text-xs text-primary-400" />
                </div>
              </div>
              <MonthlyChart data={monthly} />
            </div>

            {/* Pie Chart — 1/3 width */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">
                    Expense by Category
                  </h2>
                  <p className="text-text-muted text-xs mt-0.5">This month</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center">
                  <i className="fa-solid fa-chart-pie text-xs text-primary-400" />
                </div>
              </div>
              <CategoryChart data={categories} />
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Category breakdown list */}
            <div className="card">
              <h2 className="text-sm font-semibold text-text-primary mb-4">
                Top Spending Categories
              </h2>

              {categories.length === 0 ? (
                <p className="text-text-muted text-sm text-center py-8">
                  No expense data this month
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {categories.map((cat, i) => {
                    const percent =
                      totalExpense > 0
                        ? ((cat.value / totalExpense) * 100).toFixed(1)
                        : 0;

                    const barColors = [
                      "#22c55e",
                      "#06b6d4",
                      "#8b5cf6",
                      "#f59e0b",
                      "#f43f5e",
                      "#3b82f6",
                      "#ec4899",
                      "#10b981",
                    ];

                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{cat.icon}</span>
                            <span className="text-text-primary text-sm font-medium">
                              {cat.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-text-muted text-xs">
                              {percent}%
                            </span>
                            <span className="text-text-primary text-sm font-semibold">
                              {formatCurrency(cat.value)}
                            </span>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: barColors[i % barColors.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Insights */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-dark-700 flex items-center justify-center">
                  <i className="fa-solid fa-lightbulb text-xs text-warning-400" />
                </div>
                <h2 className="text-sm font-semibold text-text-primary">
                  Insights
                </h2>
              </div>
              <InsightCard monthly={monthly} />
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Analytics;
