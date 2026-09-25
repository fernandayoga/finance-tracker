import { useState, useEffect } from 'react';
import useCategories from '../hooks/useCategories.js';
import Button from './ui/Button.jsx';
import Input from './ui/Input.jsx';
import { toInputDate } from '../utils/format.js';
import { Plus, SquarePen, X, AlertCircle, ArrowDown, ArrowUp } from 'lucide-react';

const TransactionModal = ({ isOpen, onClose, onSubmit, editData = null, defaultType = 'expense' }) => {
  const { categories } = useCategories();
  const [form, setForm] = useState({
    type: defaultType,
    amount: '',
    category: '',
    date: toInputDate(new Date()),
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Kalau edit, isi form dengan data yang ada
  useEffect(() => {
    if (editData) {
      setForm({
        type:     editData.type,
        amount:   editData.amount,
        category: editData.category?._id || editData.category || '',
        date:     toInputDate(editData.date),
        note:     editData.note || '',
      });
    } else {
      setForm({
        type: defaultType, amount: '', category: '',
        date: toInputDate(new Date()), note: '',
      });
    }
    setError('');
  }, [editData, isOpen, defaultType]);

  const filteredCategories = categories.filter((c) => c.type === form.type);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset category kalau ganti type
      ...(name === 'type' ? { category: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) {
      setError('Please select a category for this transaction');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md card bg-dark-800 border-dark-600 shadow-2xl z-10 p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-dark-600/50">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              form.type === 'income' ? 'bg-income-500/15 text-income-400' : 'bg-expense-500/15 text-expense-400'
            }`}>
              {editData ? <SquarePen size={15} strokeWidth={2} /> : <Plus size={16} strokeWidth={2.2} />}
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary tracking-tight">
                {editData ? 'Edit Transaction' : 'Record Transaction'}
              </h2>
              <p className="text-[11px] text-text-muted">Fill in details to log your cashflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-dark-700 transition-colors cursor-pointer"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-expense-400 text-xs flex items-center gap-2 bg-expense-500/10 border border-expense-500/25">
            <AlertCircle size={14} strokeWidth={2} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Type Segmented Toggle */}
          <div>
            <label className="text-xs font-semibold text-text-secondary tracking-tight block mb-1.5">
              Transaction Flow
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-dark-750 rounded-xl border border-dark-600/70">
              {['expense', 'income'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: t, category: '' }))}
                  className={`py-2 rounded-lg text-xs font-semibold capitalize transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    form.type === t
                      ? t === 'income'
                        ? 'bg-income-500/20 text-income-400 border border-income-500/30 shadow-sm'
                        : 'bg-expense-500/20 text-expense-400 border border-expense-500/30 shadow-sm'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {t === 'income' ? <ArrowDown size={13} strokeWidth={2.5} /> : <ArrowUp size={13} strokeWidth={2.5} />}
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <Input
            label="Amount (IDR)"
            name="amount"
            type="number"
            placeholder="0"
            icon="money-bill"
            value={form.amount}
            onChange={handleChange}
            min="1"
            required
            className="tabular-nums font-semibold"
          />

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary tracking-tight">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl px-3.5 py-2.5 text-sm bg-dark-750/70 border border-dark-600/80 text-text-primary outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/60 hover:border-dark-500 transition-all cursor-pointer"
            >
              <option value="" disabled>Choose a category</option>
              {filteredCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <Input
            label="Transaction Date"
            name="date"
            type="date"
            icon="calendar"
            value={form.date}
            onChange={handleChange}
            required
          />

          {/* Note */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary tracking-tight flex items-center justify-between">
              <span>Description / Note</span>
              <span className="text-[11px] font-normal text-text-muted">Optional</span>
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="e.g. Starbucks Coffee, Monthly WiFi bill, Client invoice..."
              rows={2}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm bg-dark-750/70 border border-dark-600/80 text-text-primary outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/60 hover:border-dark-500 transition-all resize-none placeholder:text-text-muted/60"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2">
            <Button variant="secondary" className="flex-1 py-2.5 text-xs" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" className="flex-1 py-2.5 text-xs" type="submit" loading={loading}>
              {editData ? 'Save Changes' : 'Record Transaction'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TransactionModal;