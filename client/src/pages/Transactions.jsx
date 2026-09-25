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
  Search,
  Calendar,
  ChevronDown,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';

const Transactions = () => {
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('all');
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
    filters.type || filters.startDate || filters.endDate || searchQuery
  );

  const displayedTransactions = transactions.filter((tx) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const note = (tx.note || '').toLowerCase();
    const catName = (tx.category?.name || '').toLowerCase();
    return note.includes(q) || catName.includes(q);
  });

  const datePresets = [
    { id: 'all', label: 'All Time' },
    { id: 'this_month', label: 'This Month' },
    { id: 'last_month', label: 'Last Month' },
    { id: 'last_30_days', label: 'Last 30 Days' },
    { id: 'this_year', label: 'This Year' },
  ];

  const applyDatePreset = (presetId) => {
    setActivePreset(presetId);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const pad = (n) => String(n).padStart(2, '0');
    const fmtYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (presetId === 'this_month') {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);
      setFilters((p) => ({ ...p, startDate: fmtYMD(start), endDate: fmtYMD(end) }));
    } else if (presetId === 'last_month') {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      setFilters((p) => ({ ...p, startDate: fmtYMD(start), endDate: fmtYMD(end) }));
    } else if (presetId === 'last_30_days') {
      const start = new Date();
      start.setDate(now.getDate() - 30);
      setFilters((p) => ({ ...p, startDate: fmtYMD(start), endDate: fmtYMD(now) }));
    } else if (presetId === 'this_year') {
      const start = new Date(year, 0, 1);
      setFilters((p) => ({ ...p, startDate: fmtYMD(start), endDate: fmtYMD(now) }));
    } else {
      setFilters((p) => ({ ...p, startDate: undefined, endDate: undefined }));
    }
    setDateMenuOpen(false);
  };

  const getDateLabel = () => {
    if (!filters.startDate && !filters.endDate) return "All Time";
    if (activePreset === "this_month") return "This Month";
    if (activePreset === "last_month") return "Last Month";
    if (activePreset === "last_30_days") return "Last 30 Days";
    if (activePreset === "this_year") return "This Year";

    if (filters.startDate && filters.endDate) {
      if (filters.startDate === filters.endDate) {
        return formatDate(filters.startDate);
      }
      return `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}`;
    }
    if (filters.startDate) return `From ${formatDate(filters.startDate)}`;
    if (filters.endDate) return `Until ${formatDate(filters.endDate)}`;
    return "Custom Date";
  };

  const clearDateRange = (e) => {
    e.stopPropagation();
    setActivePreset('all');
    setFilters((p) => ({ ...p, startDate: undefined, endDate: undefined }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Transactions</h1>
          <p className="text-xs text-text-muted mt-1">
            {loading ? "Loading records..." : (
              searchQuery || hasActiveFilters
                ? `Showing ${displayedTransactions.length} of ${transactions.length} transactions`
                : `${transactions.length} total transaction${transactions.length === 1 ? '' : 's'} recorded`
            )}
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

      {/* Fluid Floating Filter & Control Toolbar */}
      <div className="bg-dark-800/80 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-dark-600/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side: Live Search Bar (Swapped to Left) */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes / category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-900/70 border border-dark-600/50 rounded-xl pl-9.5 pr-8 py-2 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer p-0.5"
            >
              <X size={13} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Right Side: Filters (Type Pills + Date Range Popover + Reset) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Segmented Type Toggle Pills */}
          <div className="flex items-center bg-dark-900/70 p-1 rounded-xl border border-dark-600/50">
            <button
              type="button"
              onClick={() => setFilters((p) => ({ ...p, type: undefined }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                !filters.type
                  ? 'bg-dark-700 text-text-primary shadow-xs'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => setFilters((p) => ({ ...p, type: 'income' }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                filters.type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs'
                  : 'text-text-muted hover:text-emerald-400'
              }`}
            >
              <ArrowDown size={12} strokeWidth={2.4} />
              <span>Income</span>
            </button>
            <button
              type="button"
              onClick={() => setFilters((p) => ({ ...p, type: 'expense' }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                filters.type === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-xs'
                  : 'text-text-muted hover:text-rose-400'
              }`}
            >
              <ArrowUp size={12} strokeWidth={2.4} />
              <span>Expense</span>
            </button>
          </div>

          {/* Intuitive Date Range Popover Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDateMenuOpen(!dateMenuOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-150 cursor-pointer ${
                filters.startDate || filters.endDate
                  ? 'bg-primary-500/15 border-primary-500/40 text-primary-300 shadow-xs'
                  : 'bg-dark-900/70 border-dark-600/50 text-text-secondary hover:text-text-primary hover:border-dark-500'
              }`}
            >
              <Calendar size={13} strokeWidth={2} className={filters.startDate || filters.endDate ? "text-primary-400" : "text-text-muted"} />
              <span className="font-semibold">{getDateLabel()}</span>
              
              {(filters.startDate || filters.endDate) ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={clearDateRange}
                  className="p-0.5 rounded-md hover:bg-primary-500/20 text-primary-400 hover:text-white cursor-pointer ml-0.5"
                  title="Clear date filter"
                >
                  <X size={12} strokeWidth={2.2} />
                </span>
              ) : (
                <ChevronDown size={12} strokeWidth={2} className={`text-text-muted transition-transform duration-200 ${dateMenuOpen ? 'rotate-180' : ''}`} />
              )}
            </button>

            {/* Date Range Dropdown Popover */}
            {dateMenuOpen && (
              <>
                {/* Backdrop overlay */}
                <div className="fixed inset-0 z-40" onClick={() => setDateMenuOpen(false)} />

                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-dark-800 border border-dark-600/80 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2 px-1">
                    Quick Presets
                  </div>

                  {/* Presets Grid */}
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    {datePresets.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => applyDatePreset(p.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-all cursor-pointer ${
                          activePreset === p.id && (p.id === 'all' || filters.startDate)
                            ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30 font-semibold'
                            : 'text-text-secondary hover:bg-dark-750 hover:text-text-primary'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Date Inputs with Clean Labels */}
                  <div className="pt-2.5 border-t border-dark-600/60">
                    <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2 px-1">
                      Custom Date Range
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-text-muted block mb-1">From Date</span>
                        <input
                          type="date"
                          value={filters.startDate || ""}
                          onChange={(e) => {
                            setActivePreset('custom');
                            setFilters((prev) => ({ ...prev, startDate: e.target.value || undefined }));
                          }}
                          className="w-full bg-dark-750 border border-dark-600/80 rounded-xl px-2 py-1.5 text-xs text-text-primary outline-none focus:border-primary-500/50 [color-scheme:dark] cursor-pointer"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted block mb-1">To Date</span>
                        <input
                          type="date"
                          value={filters.endDate || ""}
                          onChange={(e) => {
                            setActivePreset('custom');
                            setFilters((prev) => ({ ...prev, endDate: e.target.value || undefined }));
                          }}
                          className="w-full bg-dark-750 border border-dark-600/80 rounded-xl px-2 py-1.5 text-xs text-text-primary outline-none focus:border-primary-500/50 [color-scheme:dark] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Popover Actions */}
                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-dark-600/60">
                    <button
                      type="button"
                      onClick={() => {
                        setActivePreset('all');
                        setFilters((prev) => ({ ...prev, startDate: undefined, endDate: undefined }));
                      }}
                      className="text-[11px] text-text-muted hover:text-expense-400 font-medium cursor-pointer"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateMenuOpen(false)}
                      className="btn-primary py-1 px-3 text-[11px] font-semibold cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Reset Filters Pill */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setFilters({});
                setSearchQuery('');
                setActivePreset('all');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-expense-400 bg-expense-500/10 hover:bg-expense-500/20 border border-expense-500/25 transition-all cursor-pointer flex-shrink-0"
              title="Reset all filters"
            >
              <RotateCcw size={12} strokeWidth={2.2} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
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
        ) : displayedTransactions.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-dark-750 border border-dark-600 flex items-center justify-center mx-auto mb-3 text-text-muted">
              <FilterX size={22} strokeWidth={1.8} />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">No transactions found</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto mt-1 mb-4">
              {hasActiveFilters
                ? "No records match your selected filters or search query. Try broadening your criteria or reset filters."
                : "You haven't recorded any transactions yet. Click below to add your first one."}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={() => {
                  setFilters({});
                  setSearchQuery('');
                }}
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
            {displayedTransactions.map((tx) => (
              <div
                key={tx._id}
                className="group grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1.2fr_70px] items-center p-3.5 sm:px-5 hover:bg-dark-750/50 transition-colors gap-2 sm:gap-4"
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
