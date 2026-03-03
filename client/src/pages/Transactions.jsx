import { useState } from 'react';
import useTransactions from '../hooks/useTransactions.js';
import TransactionModal from '../components/TransactionModal.jsx';
import { formatCurrency, formatDate } from '../utils/format.js';

const Transactions = () => {
  const [filters, setFilters]   = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData]   = useState(null);
  const [deleteId, setDeleteId]   = useState(null);

  const {
    transactions, loading,
    createTransaction, updateTransaction, deleteTransaction,
  } = useTransactions(filters);

  const handleEdit = (tx) => {
    setEditData(tx);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const handleSubmit = async (data) => {
    if (editData) {
      await updateTransaction(editData._id, data);
    } else {
      await createTransaction(data);
    }
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    setDeleteId(null);
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Transactions</h1>
          <p className="text-text-muted text-sm mt-0.5">{transactions.length} records</p>
        </div>
        <button
          onClick={() => { setEditData(null); setModalOpen(true); }}
          className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
        >
          <i className="fa-solid fa-plus text-xs" />
          Add Transaction
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card-sm mb-4 flex items-center gap-3 flex-wrap">
        <i className="fa-solid fa-filter text-text-muted text-xs" />

        <select
          className="bg-dark-700 border border-dark-500 text-text-secondary text-xs rounded-lg px-3 py-1.5 outline-none focus:border-primary-500/60"
          onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value || undefined }))}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="date"
          className="bg-dark-700 border border-dark-500 text-text-secondary text-xs rounded-lg px-3 py-1.5 outline-none focus:border-primary-500/60"
          onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value || undefined }))}
        />
        <span className="text-text-muted text-xs">to</span>
        <input
          type="date"
          className="bg-dark-700 border border-dark-500 text-text-secondary text-xs rounded-lg px-3 py-1.5 outline-none focus:border-primary-500/60"
          onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value || undefined }))}
        />

        {Object.keys(filters).some(Boolean) && (
          <button
            onClick={() => setFilters({})}
            className="text-expense-400 text-xs hover:text-expense-300 ml-auto"
          >
            <i className="fa-solid fa-xmark mr-1" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">

        {/* Table header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-dark-600">
          {['', 'Category', 'Date', 'Amount', ''].map((h, i) => (
            <span key={i} className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-dark-600" />
                <div className="flex-1 h-4 bg-dark-600 rounded" />
                <div className="w-24 h-4 bg-dark-600 rounded" />
                <div className="w-28 h-4 bg-dark-600 rounded" />
                <div className="w-16 h-4 bg-dark-600 rounded" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <i className="fa-solid fa-inbox text-dark-500 text-4xl mb-3" />
            <p className="text-text-muted text-sm">No transactions found</p>
          </div>
        ) : (
          <div>
            {transactions.map((tx) => (
              <div
                key={tx._id}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-5 py-3.5 border-b border-dark-700 hover:bg-dark-700/50 transition-colors"
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm
                  ${tx.type === 'income' ? 'bg-income-500/15' : 'bg-expense-500/15'}`}>
                  {tx.category?.icon || '💸'}
                </div>

                {/* Name + note */}
                <div>
                  <p className="text-text-primary text-sm font-medium">{tx.category?.name}</p>
                  {tx.note && <p className="text-text-muted text-xs mt-0.5">{tx.note}</p>}
                </div>

                {/* Date */}
                <span className="text-text-muted text-xs">{formatDate(tx.date)}</span>

                {/* Amount */}
                <span className={`text-sm font-semibold ${
                  tx.type === 'income' ? 'text-income-400' : 'text-expense-400'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(tx)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-dark-600 hover:text-text-primary transition-all"
                  >
                    <i className="fa-solid fa-pen text-xs" />
                  </button>
                  <button
                    onClick={() => setDeleteId(tx._id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-expense-500/15 hover:text-expense-400 transition-all"
                  >
                    <i className="fa-solid fa-trash text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative card w-full max-w-sm z-10 text-center">
            <div className="w-12 h-12 rounded-full bg-expense-500/15 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-trash text-expense-400" />
            </div>
            <h3 className="text-text-primary font-semibold mb-1">Delete Transaction?</h3>
            <p className="text-text-muted text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-xl text-sm font-medium bg-dark-700 border border-dark-500 text-text-secondary hover:bg-dark-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-expense-500 text-white hover:bg-expense-600"
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
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editData={editData}
      />
    </div>
  );
};

export default Transactions;