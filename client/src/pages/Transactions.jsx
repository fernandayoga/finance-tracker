import { useState } from "react";
import useTransactions from "../hooks/useTransactions.js";
import TransactionModal from "../components/TransactionModal.jsx";
import { formatCurrency, formatDate } from "../utils/format.js";
import CategoryIcon from '../components/ui/CategoryIcon.jsx';
import {
  Plus,
  Filter,
  X,
  RotateCcw,
  Pen,
  Trash2,
  FilterX,
} from 'lucide-react';

const Transactions = () => {
  const [filters, setFilters] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const {
    transactions,
    loading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions(filters);

  const handleEdit = (tx) => {
    setEditData(tx);
    setModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    if (editData) {
      await updateTransaction(editData._id, formData);
    } else {
      await createTransaction(formData);
    }
    setModalOpen(false);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteTransaction(deleteId);
      setDeleteId(null);
    }
  };

  const hasActiveFilters = Boolean(
    filters.type || filters.startDate || filters.endDate
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Transactions</h1>
          <p className="text-xs text-text-muted mt-1">
            {loading ? "Loading records..." : `${transactions.length} total transaction${transactions.length === 1 ? '' : 's'} recorded`}
          </p>
        </div>

        <button
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
          className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-primary-500/10 active:scale-95 cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.2} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="card-sm flex items-center justify-between gap-3 flex-wrap bg-dark-800/90 border-dark-600/80">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap flex-1">
          <div className="flex items-center gap-2 text-text-muted text-xs font-medium mr-1">
            <Filter size={13} strokeWidth={2} />
            <span className="hidden sm:inline">Filter:</span>
          </div>

          {/* Type Filter */}
          <select
            value={filters.type || ""}
            className="bg-dark-750 border border-dark-600/80 text-text-primary text-xs rounded-xl px-3 py-2 outline-none focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/30 transition-all cursor-pointer"
            onChange={(e) =>
              setFilters((p) => ({ ...p, type: e.target.value || undefined }))
            }
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Date Range Start */}
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="text-[11px] hidden sm:inline">From:</span>
            <input
              type="date"
              value={filters.startDate || ""}
              className="bg-dark-750 border border-dark-600/80 text-text-primary text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/30 transition-all cursor-pointer"
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  startDate: e.target.value || undefined,
                }))
              }
            />
          </div>

          {/* Date Range End */}
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="text-[11px] hidden sm:inline">To:</span>
            <input
              type="date"
              value={filters.endDate || ""}
              className="bg-dark-750 border border-dark-600/80 text-text-primary text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/30 transition-all cursor-pointer"
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  endDate: e.target.value || undefined,
                }))
              }
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => setFilters({})}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-expense-400 hover:bg-expense-500/10 transition-colors cursor-pointer"
          >
            <X size={13} strokeWidth={2} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Transactions Table / List Container */}
      <div className="card p-0 overflow-hidden border-dark-600/80 shadow-xl">
        {/* Table Column Headers (Desktop) */}
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1.2fr_70px] items-center px-5 py-3 border-b border-dark-600/60 bg-dark-850/60 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
          <span>Transaction</span>
          <span>Category</span>
          <span>Date</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-dark-750/30 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-dark-600" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-dark-600 rounded w-1/4" />
                  <div className="h-2.5 bg-dark-600 rounded w-1/6" />
                </div>
                <div className="w-24 h-4 bg-dark-600 rounded" />
                <div className="w-20 h-4 bg-dark-600 rounded" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-dark-750 border border-dark-600 flex items-center justify-center mx-auto mb-3 text-text-muted">
              <FilterX size={22} strokeWidth={1.8} />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">No transactions found</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto mt-1 mb-4">
              {hasActiveFilters
                ? "No records match your selected filters. Try broadening your date range or reset filters."
                : "You haven't recorded any transactions yet. Click below to add your first one."}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={() => setFilters({})}
                className="btn-secondary inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold cursor-pointer"
              >
                <RotateCcw size={12} strokeWidth={2} />
                <span>Reset Filters</span>
              </button>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                <Plus size={14} strokeWidth={2.2} />
                <span>Add Transaction</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-dark-600/40">
            {transactions.map((tx) => (
              <div
                key={tx._id}
                className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1.2fr_70px] items-center p-3.5 sm:px-5 hover:bg-dark-750/40 transition-colors gap-2 sm:gap-4"
              >
                {/* 1. Transaction Details (Icon + Note) */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <CategoryIcon
                    icon={tx.category?.icon}
                    type={tx.type}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {tx.note || tx.category?.name || "Uncategorized"}
                    </p>
                    <div className="flex sm:hidden items-center gap-2 mt-0.5 text-xs text-text-muted">
                      <span>{formatDate(tx.date)}</span>
                      {tx.category?.name && (
                        <>
                          <span>•</span>
                          <span className="truncate">{tx.category.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Category (Desktop) */}
                <div className="hidden sm:flex items-center min-w-0">
                  <span className="text-xs text-text-secondary truncate bg-dark-750 px-2 py-0.5 rounded-md border border-dark-600/50">
                    {tx.category?.name || "Uncategorized"}
                  </span>
                </div>

                {/* 3. Date (Desktop) */}
                <div className="hidden sm:block text-xs text-text-muted">
                  {formatDate(tx.date)}
                </div>

                {/* 4. Amount */}
                <div className="flex items-center justify-between sm:justify-end gap-2 text-right">
                  <span className="sm:hidden text-xs text-text-muted">Amount:</span>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      tx.type === "income"
                        ? "text-income-400"
                        : "text-text-primary"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>

                {/* 5. Actions */}
                <div className="flex items-center justify-end gap-1.5 pl-2 sm:pl-0">
                  <button
                    onClick={() => handleEdit(tx)}
                    title="Edit transaction"
                    className="w-7 h-7 rounded-lg bg-dark-750/80 hover:bg-dark-700 text-text-muted hover:text-primary-400 transition-all flex items-center justify-center border border-dark-600/50 cursor-pointer"
                  >
                    <Pen size={12} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => setDeleteId(tx._id)}
                    title="Delete transaction"
                    className="w-7 h-7 rounded-lg bg-dark-750/80 hover:bg-expense-500/15 text-text-muted hover:text-expense-400 transition-all flex items-center justify-center border border-dark-600/50 cursor-pointer"
                  >
                    <Trash2 size={12} strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative card w-full max-w-sm z-10 text-center border-dark-600/80 shadow-2xl p-6">
            <div className="w-12 h-12 rounded-2xl bg-expense-500/15 border border-expense-500/20 flex items-center justify-center mx-auto mb-4 text-expense-400">
              <Trash2 size={20} strokeWidth={2} />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1">
              Delete Transaction?
            </h3>
            <p className="text-xs text-text-muted mb-5 leading-relaxed">
              This action cannot be undone and will permanently remove this record from your account balance.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteId(null)}
                className="btn-secondary flex-1 py-2.5 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn-danger flex-1 py-2.5 text-xs font-semibold bg-expense-500 text-white hover:bg-expense-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleModalSubmit}
        editData={editData}
      />
    </div>
  );
};

export default Transactions;
