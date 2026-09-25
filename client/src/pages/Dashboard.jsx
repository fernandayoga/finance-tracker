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
  
  // State for modal & preset type
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');
  
  // State for interactive features
  const [showBalance, setShowBalance] = useState(true);
  const [filterType, setFilterType] = useState('all');

  const thisMonthIncome = summary?.thisMonth?.income || 0;
  const thisMonthExpense = summary?.thisMonth?.expense || 0;
  const netMonthly = thisMonthIncome - thisMonthExpense;
  const totalBalance = summary?.balance || 0;

  // Filter transactions for recent list
  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });
  const recent = filteredTransactions.slice(0, 6);

  // Calculate monthly savings rate and cashflow ratio
  const savingRate = thisMonthIncome > 0
    ? Math.max(0, Math.min(100, Math.round(((thisMonthIncome - thisMonthExpense) / thisMonthIncome) * 100)))
    : 0;

  const expenseRatio = thisMonthIncome > 0
    ? Math.min(100, Math.round((thisMonthExpense / thisMonthIncome) * 100))
    : thisMonthExpense > 0 ? 100 : 0;

  const handleOpenModal = (type = 'expense') => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleOpenChatbot = () => {
    const chatBtn = document.querySelector('button[aria-label="Toggle Financial AI Assistant"]');
    if (chatBtn) chatBtn.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-7">

      {/* Page Header with Greeting & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-dark-800/80 border border-dark-600/60 mb-2">
            <span className="w-2 h-2 rounded-full bg-income-400 animate-pulse" />
            <p className="text-[11px] font-semibold text-text-muted tracking-wider uppercase">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            {user?.name ? `Welcome back, ${user.name}` : "Financial Overview"}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Real-time summary of your balances, cashflow, and recent transactions
          </p>
        </div>

        {/* Header Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenModal('expense')}
            className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-lg shadow-primary-500/20 active:scale-95 transition-transform"
          >
            <i className="fa-solid fa-plus text-xs" />
            <span>Add Transaction</span>
          </button>
        </div>
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
        <div className="relative card-hero overflow-hidden bg-gradient-to-br from-dark-800 via-dark-800 to-dark-850 border border-dark-600/80 shadow-2xl">
          {/* Subtle Ambient Glow Elements */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-income-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Main Balance Row */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-7">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Total Net Balance
                </span>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  title={showBalance ? "Hide balance" : "Show balance"}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-dark-700/60 transition-colors"
                >
                  <i className={`fa-solid fa-${showBalance ? 'eye' : 'eye-slash'} text-xs`} />
                </button>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-dark-750 border border-dark-600 text-text-muted">
                  Live Accounts
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <p className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight tabular-nums ${
                  totalBalance < 0 ? 'text-expense-400' : 'text-text-primary'
                }`}>
                  {showBalance ? formatCurrency(totalBalance) : "Rp ••••••••"}
                </p>
              </div>
            </div>

            {/* Savings Rate Pill / Status */}
            <div className="flex flex-wrap items-center gap-3">
              {thisMonthIncome > 0 && (
                <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-xl bg-dark-750/90 border border-dark-600/70 text-xs shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-income-500/15 flex items-center justify-center text-income-400">
                    <i className="fa-solid fa-piggy-bank text-xs" />
                  </div>
                  <div>
                    <p className="text-[11px] text-text-muted font-medium">Monthly Savings</p>
                    <p className="font-semibold text-text-primary tabular-nums">{savingRate}% retained</p>
                  </div>
                </div>
              )}

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-750/70 border border-dark-600/60 text-xs">
                <span className={`w-2 h-2 rounded-full ${netMonthly >= 0 ? 'bg-income-400 animate-pulse' : 'bg-expense-400'}`} />
                <span className="text-text-secondary font-medium">
                  {netMonthly >= 0 ? 'Cashflow Surplus' : 'Deficit Outflow'}
                </span>
              </div>
            </div>
          </div>

          {/* Cash Flow Utilization Bar */}
          {thisMonthIncome > 0 && (
            <div className="relative z-10 mb-6 p-3.5 rounded-xl bg-dark-900/50 border border-dark-600/40">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-text-muted flex items-center gap-1.5">
                  <i className="fa-solid fa-gauge-high text-[11px] text-primary-400" />
                  <span>Monthly Budget Utilization</span>
                </span>
                <span className="font-semibold text-text-primary tabular-nums">
                  {expenseRatio}% spent <span className="text-text-muted font-normal">({100 - expenseRatio}% saved)</span>
                </span>
              </div>
              <div className="h-2 w-full bg-dark-750 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-expense-500 to-expense-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, expenseRatio)}%` }}
                />
              </div>
            </div>
          )}

          {/* Sub Metrics Grid (Income, Expenses, Net Cash Flow) */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-dark-600/60">
            {/* Income Card */}
            <div className="group p-4 rounded-xl bg-dark-750/50 hover:bg-dark-750/80 border border-dark-600/50 hover:border-income-500/40 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-muted">Income this month</span>
                <div className="w-7 h-7 rounded-lg bg-income-500/15 group-hover:bg-income-500/25 flex items-center justify-center text-income-400 transition-colors">
                  <i className="fa-solid fa-arrow-down text-xs" />
                </div>
              </div>
              <p className="text-lg sm:text-xl font-bold text-income-400 tabular-nums">
                +{formatCurrency(thisMonthIncome)}
              </p>
              <p className="text-[11px] text-text-muted mt-1">Total verified inflow</p>
            </div>

            {/* Expenses Card */}
            <div className="group p-4 rounded-xl bg-dark-750/50 hover:bg-dark-750/80 border border-dark-600/50 hover:border-expense-500/40 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-muted">Expenses this month</span>
                <div className="w-7 h-7 rounded-lg bg-expense-500/15 group-hover:bg-expense-500/25 flex items-center justify-center text-expense-400 transition-colors">
                  <i className="fa-solid fa-arrow-up text-xs" />
                </div>
              </div>
              <p className="text-lg sm:text-xl font-bold text-expense-400 tabular-nums">
                -{formatCurrency(thisMonthExpense)}
              </p>
              <p className="text-[11px] text-text-muted mt-1">Total recorded outflow</p>
            </div>

            {/* Net Cash Flow Card */}
            <div className="group p-4 rounded-xl bg-dark-750/50 hover:bg-dark-750/80 border border-dark-600/50 hover:border-primary-500/40 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-muted">Net Cash Flow</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  netMonthly >= 0
                    ? 'bg-income-500/15 text-income-400 group-hover:bg-income-500/25'
                    : 'bg-expense-500/15 text-expense-400 group-hover:bg-expense-500/25'
                }`}>
                  <i className={`fa-solid fa-${netMonthly >= 0 ? 'arrow-trend-up' : 'arrow-trend-down'} text-xs`} />
                </div>
              </div>
              <p className={`text-lg sm:text-xl font-bold tabular-nums ${
                netMonthly >= 0 ? 'text-income-400' : 'text-expense-400'
              }`}>
                {netMonthly >= 0 ? '+' : ''}{formatCurrency(netMonthly)}
              </p>
              <p className="text-[11px] text-text-muted mt-1">Net variance this cycle</p>
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Bento Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column (8 cols): Recent Activity with Live Filter Tabs */}
        <div className="lg:col-span-8 card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-dark-600/50">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-text-primary tracking-tight">
                  Recent Activity
                </h2>
                <span className="text-[11px] font-semibold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full border border-primary-500/20">
                  {filteredTransactions.length} items
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Overview of latest transactions logged to your ledger
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-dark-750 rounded-xl border border-dark-600/70 self-start sm:self-auto">
              {[
                { key: 'all', label: 'All' },
                { key: 'income', label: 'Income' },
                { key: 'expense', label: 'Expense' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterType(tab.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filterType === tab.key
                      ? 'bg-dark-600 text-text-primary shadow-sm'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          {loading ? (
            <div className="space-y-3 pt-1">
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
              <h3 className="text-sm font-semibold text-text-primary">No transactions found</h3>
              <p className="text-xs text-text-muted max-w-xs mx-auto mt-1 mb-4">
                {filterType === 'all'
                  ? 'Start tracking your income and expenses to visualize your cash flow and financial health.'
                  : `No ${filterType} transactions recorded in your ledger yet.`}
              </p>
              <button
                onClick={() => handleOpenModal(filterType === 'income' ? 'income' : 'expense')}
                className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold"
              >
                <i className="fa-solid fa-plus text-[10px]" />
                <span>Add {filterType === 'income' ? 'Income' : 'Expense'}</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-dark-600/40 -mx-2 sm:mx-0">
              {recent.map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between p-3 sm:px-3.5 rounded-xl hover:bg-dark-750/60 transition-all duration-150 group"
                >
                  {/* Left: Icon & Description */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <CategoryIcon icon={tx.category?.icon} type={tx.type} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate group-hover:text-primary-300 transition-colors">
                        {tx.note || tx.category?.name || "Uncategorized"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
                        <span>{formatDate(tx.date)}</span>
                        {tx.category?.name && tx.note && (
                          <>
                            <span>•</span>
                            <span className="truncate px-1.5 py-0.2 rounded bg-dark-750 text-[11px] text-text-secondary border border-dark-600/40">
                              {tx.category.name}
                            </span>
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

          {/* Card Footer Link */}
          {transactions.length > 0 && (
            <div className="pt-3 border-t border-dark-600/40 flex justify-end">
              <Link
                to="/transactions"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-dark-750"
              >
                <span>View all {transactions.length} transactions</span>
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Quick Actions & Financial Pulse Widgets */}
        <div className="lg:col-span-4 space-y-6">

          {/* Widget 1: Quick Actions Shortcuts */}
          <div className="card">
            <h2 className="text-sm font-bold text-text-primary tracking-tight mb-1">
              Quick Shortcuts
            </h2>
            <p className="text-xs text-text-muted mb-4">
              Fast actions to log cashflow or analyze data
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Add Expense shortcut */}
              <button
                onClick={() => handleOpenModal('expense')}
                className="p-3 rounded-xl bg-dark-750/70 hover:bg-dark-700 border border-dark-600/60 hover:border-expense-500/40 text-left transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-expense-500/15 flex items-center justify-center text-expense-400 mb-2 group-hover:scale-105 transition-transform">
                  <i className="fa-solid fa-arrow-up text-xs" />
                </div>
                <p className="text-xs font-bold text-text-primary group-hover:text-expense-400 transition-colors">
                  Add Expense
                </p>
                <p className="text-[10px] text-text-muted">Record spending</p>
              </button>

              {/* Add Income shortcut */}
              <button
                onClick={() => handleOpenModal('income')}
                className="p-3 rounded-xl bg-dark-750/70 hover:bg-dark-700 border border-dark-600/60 hover:border-income-500/40 text-left transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-income-500/15 flex items-center justify-center text-income-400 mb-2 group-hover:scale-105 transition-transform">
                  <i className="fa-solid fa-arrow-down text-xs" />
                </div>
                <p className="text-xs font-bold text-text-primary group-hover:text-income-400 transition-colors">
                  Add Income
                </p>
                <p className="text-[10px] text-text-muted">Record earnings</p>
              </button>

              {/* Deep Analytics */}
              <Link
                to="/analytics"
                className="p-3 rounded-xl bg-dark-750/70 hover:bg-dark-700 border border-dark-600/60 hover:border-primary-500/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center text-primary-400 mb-2 group-hover:scale-105 transition-transform">
                  <i className="fa-solid fa-chart-pie text-xs" />
                </div>
                <p className="text-xs font-bold text-text-primary group-hover:text-primary-300 transition-colors">
                  Analytics
                </p>
                <p className="text-[10px] text-text-muted">Breakdown trends</p>
              </Link>

              {/* Manage Categories */}
              <Link
                to="/categories"
                className="p-3 rounded-xl bg-dark-750/70 hover:bg-dark-700 border border-dark-600/60 hover:border-primary-500/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-dark-600/60 flex items-center justify-center text-text-secondary mb-2 group-hover:scale-105 transition-transform">
                  <i className="fa-solid fa-tags text-xs" />
                </div>
                <p className="text-xs font-bold text-text-primary group-hover:text-primary-300 transition-colors">
                  Categories
                </p>
                <p className="text-[10px] text-text-muted">Manage labels</p>
              </Link>
            </div>
          </div>

          {/* Widget 2: Financial Pulse Summary */}
          <div className="card bg-gradient-to-br from-dark-800 to-dark-850">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-text-primary tracking-tight">
                Monthly Health
              </h2>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                netMonthly >= 0
                  ? 'bg-income-500/10 text-income-400 border-income-500/30'
                  : 'bg-expense-500/10 text-expense-400 border-expense-500/30'
              }`}>
                {netMonthly >= 0 ? 'Healthy Surplus' : 'Deficit Alert'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-750/50">
                <span className="text-text-muted">Total Recorded Activity</span>
                <span className="font-semibold text-text-primary tabular-nums">
                  {transactions.length} transactions
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-750/50">
                <span className="text-text-muted">Net Monthly Retained</span>
                <span className={`font-semibold tabular-nums ${netMonthly >= 0 ? 'text-income-400' : 'text-expense-400'}`}>
                  {netMonthly >= 0 ? '+' : ''}{formatCurrency(netMonthly)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-750/50">
                <span className="text-text-muted">Savings Retention</span>
                <span className="font-semibold text-text-primary tabular-nums">
                  {savingRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Widget 3: AI Financial Co-pilot Teaser */}
          <div className="card relative overflow-hidden bg-gradient-to-br from-primary-950/30 via-dark-800 to-dark-800 border-primary-500/30">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-primary-500/20">
                <i className="fa-solid fa-robot text-xs" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-primary">Finance AI Co-pilot</h3>
                <p className="text-[11px] text-text-muted">Ask anything about your spending habits</p>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed mb-3">
              "Need advice on how to optimize your expenses or boost your monthly savings rate?"
            </p>

            <button
              onClick={handleOpenChatbot}
              className="w-full py-2 px-3 rounded-xl bg-primary-500/15 hover:bg-primary-500/25 border border-primary-500/30 text-primary-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Ask AI Assistant</span>
              <i className="fa-solid fa-arrow-right text-[10px]" />
            </button>
          </div>

        </div>

      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={modalOpen}
        defaultType={modalType}
        onClose={() => setModalOpen(false)}
        onSubmit={createTransaction}
      />
    </div>
  );
};

export default Dashboard;
