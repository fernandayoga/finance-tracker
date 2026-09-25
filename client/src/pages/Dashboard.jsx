import { useState } from "react";
import { Link } from "react-router-dom";
import useTransactions from "../hooks/useTransactions.js";
import useAuth from "../hooks/useAuth.js";
import TransactionModal from "../components/TransactionModal.jsx";
import { formatCurrency, formatDate } from "../utils/format.js";
import CategoryIcon from '../components/ui/CategoryIcon.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const { transactions, summary, loading, createTransaction } = useTransactions();
  const [modalOpen, setModalOpen] = useState(false);

  const recent = transactions.slice(0, 8);
  const thisMonthIncome = summary?.thisMonth?.income || 0;
  const thisMonthExpense = summary?.thisMonth?.expense || 0;
  const netMonthly = thisMonthIncome - thisMonthExpense;
  const totalBalance = summary?.balance || 0;

  // Calculate monthly savings rate
  const savingRate = thisMonthIncome > 0
    ? Math.max(0, Math.min(100, Math.round(((thisMonthIncome - thisMonthExpense) / thisMonthIncome) * 100)))
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            {user?.name ? `Welcome back, ${user.name}` : "Financial Overview"}
          </h1>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-primary-500/10 active:scale-95"
        >
          <i className="fa-solid fa-plus text-xs" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Primary Financial Overview Canvas */}
      {loading ? (
        <div className="card-hero animate-pulse">
          <div className="h-4 bg-dark-700/80 rounded w-28 mb-3" />
          <div className="h-10 bg-dark-700/80 rounded w-56 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-dark-600/50">
            <div className="h-16 bg-dark-700/60 rounded-xl" />
            <div className="h-16 bg-dark-700/60 rounded-xl" />
            <div className="h-16 bg-dark-700/60 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="card-hero">
          {/* Main Balance Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Total Net Balance
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-700 border border-dark-600 text-text-muted">
                  All accounts
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${
                  totalBalance < 0 ? 'text-expense-400' : 'text-text-primary'
                }`}>
                  {formatCurrency(totalBalance)}
                </p>
              </div>
            </div>

            {/* Savings Rate Pill indicator */}
            {thisMonthIncome > 0 && (
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-dark-750/90 border border-dark-600/70 text-xs">
                <div className="w-6 h-6 rounded-lg bg-primary-500/15 flex items-center justify-center text-primary-400">
                  <i className="fa-solid fa-piggy-bank text-xs" />
                </div>
                <div>
                  <p className="text-[11px] text-text-muted font-medium">Monthly Savings Rate</p>
                  <p className="font-semibold text-text-primary tabular-nums">{savingRate}% saved</p>
                </div>
              </div>
            )}
          </div>

          {/* Sub Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-dark-600/60">
            {/* Income */}
            <div className="p-3.5 rounded-xl bg-dark-750/50 border border-dark-600/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-text-muted">Income this month</span>
                <div className="w-6 h-6 rounded-md bg-income-500/15 flex items-center justify-center text-income-400">
                  <i className="fa-solid fa-arrow-down-left text-xs" />
                </div>
              </div>
              <p className="text-lg font-bold text-income-400 tabular-nums">
                +{formatCurrency(thisMonthIncome)}
              </p>
            </div>

            {/* Expenses */}
            <div className="p-3.5 rounded-xl bg-dark-750/50 border border-dark-600/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-text-muted">Expenses this month</span>
                <div className="w-6 h-6 rounded-md bg-expense-500/15 flex items-center justify-center text-expense-400">
                  <i className="fa-solid fa-arrow-up-right text-xs" />
                </div>
              </div>
              <p className="text-lg font-bold text-expense-400 tabular-nums">
                -{formatCurrency(thisMonthExpense)}
              </p>
            </div>

            {/* Net Cash Flow */}
            <div className="p-3.5 rounded-xl bg-dark-750/50 border border-dark-600/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-text-muted">Net Cash Flow</span>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                  netMonthly >= 0 ? 'bg-primary-500/15 text-primary-400' : 'bg-expense-500/15 text-expense-400'
                }`}>
                  <i className={`fa-solid fa-${netMonthly >= 0 ? 'arrow-trend-up' : 'arrow-trend-down'} text-xs`} />
                </div>
              </div>
              <p className={`text-lg font-bold tabular-nums ${
                netMonthly >= 0 ? 'text-primary-400' : 'text-expense-400'
              }`}>
                {netMonthly >= 0 ? '+' : ''}{formatCurrency(netMonthly)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              Recent Transactions
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Latest financial activity recorded in your account
            </p>
          </div>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-dark-700/60"
          >
            <span>View all</span>
            <i className="fa-solid fa-chevron-right text-[10px]" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-dark-750/40 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-dark-600" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-dark-600 rounded w-1/3" />
                  <div className="h-2.5 bg-dark-600 rounded w-1/5" />
                </div>
                <div className="h-4 bg-dark-600 rounded w-20" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-dark-600/70 bg-dark-850/50">
            <div className="w-12 h-12 rounded-2xl bg-dark-750 border border-dark-600 flex items-center justify-center mx-auto mb-3 text-text-muted">
              <i className="fa-solid fa-receipt text-lg" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">No transactions yet</h3>
            <p className="text-xs text-text-muted max-w-xs mx-auto mt-1 mb-4">
              Start tracking your income and expenses to visualize your cash flow and financial health.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold"
            >
              <i className="fa-solid fa-plus text-[10px]" />
              <span>Add First Transaction</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-dark-600/40 -mx-2 sm:mx-0">
            {recent.map((tx) => (
              <div
                key={tx._id}
                className="flex items-center justify-between p-3 sm:px-4 rounded-xl hover:bg-dark-750/50 transition-colors group"
              >
                {/* Left: Icon & Description */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <CategoryIcon icon={tx.category?.icon} type={tx.type} size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary-300 transition-colors">
                      {tx.note || tx.category?.name || "Uncategorized"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
                      <span>{formatDate(tx.date)}</span>
                      {tx.category?.name && tx.note && (
                        <>
                          <span>•</span>
                          <span className="truncate">{tx.category.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Badge */}
                <div className="flex items-center gap-3 flex-shrink-0 text-right">
                  <div>
                    <p className={`text-sm font-bold tabular-nums ${
                      tx.type === "income" ? "text-income-400" : "text-text-primary"
                    }`}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </p>
                    <span className={tx.type === "income" ? "badge-income text-[10px] py-0 px-2 mt-0.5" : "badge-expense text-[10px] py-0 px-2 mt-0.5"}>
                      {tx.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={createTransaction}
      />
    </div>
  );
};

export default Dashboard;
