import { useState, useEffect } from 'react';
import useCategories from '../hooks/useCategories.js';
import Button from './ui/Button.jsx';
import Input from './ui/Input.jsx';
import { toInputDate } from '../utils/format.js';

const TransactionModal = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const { categories } = useCategories();
  const [form, setForm] = useState({
    type: 'expense',
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
        category: editData.category._id,
        date:     toInputDate(editData.date),
        note:     editData.note || '',
      });
    } else {
      setForm({
        type: 'expense', amount: '', category: '',
        date: toInputDate(new Date()), note: '',
      });
    }
    setError('');
  }, [editData, isOpen]);

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
    if (!form.category) { setError('Please select a category'); return; }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md card z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text-primary">
            {editData ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-expense-400 text-sm flex items-center gap-2"
            style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)' }}>
            <i className="fa-solid fa-triangle-exclamation text-xs" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Type toggle */}
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Type
            </p>
            <div className="grid grid-cols-2 gap-2 p-1 bg-dark-700 rounded-xl">
              {['expense', 'income'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: t, category: '' }))}
                  className={`py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                    form.type === t
                      ? t === 'income'
                        ? 'bg-income-500 text-dark-900'
                        : 'bg-expense-500 text-white'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <i className={`fa-solid fa-${t === 'income' ? 'arrow-down' : 'arrow-up'} mr-1.5 text-xs`} />
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <Input
            label="Amount"
            name="amount"
            type="number"
            placeholder="0"
            icon="money-bill"
            value={form.amount}
            onChange={handleChange}
            min="1"
            required
          />

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl px-4 py-2.5 text-sm bg-dark-700 border border-dark-500 text-text-primary outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/60 hover:border-dark-400 transition-all"
            >
              <option value="">Select category</option>
              {filteredCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <Input
            label="Date"
            name="date"
            type="date"
            icon="calendar"
            value={form.date}
            onChange={handleChange}
            required
          />

          {/* Note */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Note <span className="normal-case font-normal text-text-muted">(optional)</span>
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Add a note..."
              rows={2}
              className="w-full rounded-xl px-4 py-2.5 text-sm bg-dark-700 border border-dark-500 text-text-primary outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/60 hover:border-dark-400 transition-all resize-none placeholder:text-text-muted"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-1">
            <Button variant="secondary" className="flex-1" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" type="submit" loading={loading}>
              {editData ? 'Save Changes' : 'Add Transaction'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TransactionModal;