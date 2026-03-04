import { useState } from 'react';
import useTransactions from '../hooks/useTransactions.js';
import TransactionModal from '../components/TransactionModal.jsx';
import { formatCurrency, formatDate } from '../utils/format.js';

const StatCard = ({ label, value, icon, iconBg, trend }) => (
  <div className="stat-card">
    <div className="flex items-start justify-between mb-3">
      <p className="text-text-muted text-xs font-medium">{label}</p>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
        <i className={`fa-solid fa-${icon} text-xs`} />
      </div>
    </div>
    <p className={`text-xl font-bold text-text-primary `}>{value}</p>
    {trend && (
      <p className={`text-xs mt-1 ${trend > 0 ? 'text-income-400' : 'text-expense-400'}`}>
        <i className={`fa-solid fa-arrow-${trend > 0 ? 'up' : 'down'} mr-1`} />
        {Math.abs(trend)}% from last month
      </p>
    )}
  </div>
);

const Dashboard = () => {
  const { transactions, summary, loading, createTransaction } = useTransactions();
  const [modalOpen, setModalOpen] = useState(false);

  const recent = transactions.slice(0, 8);

  return (
    <div className="max-w-6xl mx-auto mt-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Overview</h1>
          <p className="text-text-muted text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
       
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1,2,3].map(i => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-4 bg-dark-600 rounded w-24 mb-3" />
              <div className="h-7 bg-dark-600 rounded w-32" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Total Balance"
            value={formatCurrency(summary.balance)}
            icon="wallet"
            iconBg="bg-primary-500/20 text-primary-400"
          />
          <StatCard
            label="Income This Month"
            value={formatCurrency(summary.thisMonth.income)}
            icon="arrow-down"
            iconBg="bg-income-500/20 text-income-400"
          />
          <StatCard
            label="Expenses This Month"
            value={formatCurrency(summary.thisMonth.expense)}
            icon="arrow-up"
            iconBg="bg-expense-500/20 text-expense-400"
          />
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary">Recent Transactions</h2>
          <a href="/transactions" className="text-primary-400 text-xs hover:text-primary-300">
            View all →
          </a>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-dark-600" />
                <div className="flex-1">
                  <div className="h-3.5 bg-dark-600 rounded w-32 mb-1.5" />
                  <div className="h-3 bg-dark-600 rounded w-20" />
                </div>
                <div className="h-4 bg-dark-600 rounded w-20" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-10">
            <i className="fa-solid fa-receipt text-dark-500 text-3xl mb-3" />
            <p className="text-text-muted text-sm">No transactions yet</p>
            <button
              onClick={() => setModalOpen(true)}
              className="text-primary-400 text-sm hover:text-primary-300 mt-1"
            >
              Add your first transaction →
            </button>
          </div>
        ) : (
         <div className="grid grid-cols-1 xs:flex xs:overflow-x-auto gap-3 pb-2 -mx-1 px-1"
  style={{ scrollbarWidth: 'none' }}>
  {recent.map((tx) => (
    <div key={tx._id}
      className="xs:flex-shrink-0 xs:w-48 bg-dark-700 border border-dark-600 rounded-xl p-3.5 hover:border-dark-400 transition-colors">

      {/* Top: icon + badge */}
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base
          ${tx.type === 'income' ? 'bg-income-500/15' : 'bg-expense-500/15'}`}>
          {tx.category?.icon || '💸'}
        </div>
        <span className={tx.type === 'income' ? 'badge-income' : 'badge-expense'}>
          {tx.type}
        </span>
      </div>

      {/* Amount */}
      <p className={`text-base font-bold mb-1 ${tx.type === 'income' ? 'text-income-400' : 'text-expense-400'}`}>
        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
      </p>

      {/* Category */}
      <p className="text-text-primary text-xs font-medium truncate">
        {tx.category?.name || 'Uncategorized'}
      </p>

      {/* Date + note */}
      <p className="text-text-muted text-xs mt-0.5 truncate">
        {formatDate(tx.date)}
        {tx.note && <span> · {tx.note}</span>}
      </p>

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