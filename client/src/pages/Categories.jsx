import { useState, useEffect, useCallback } from 'react';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import api from '../services/api.js';
import CategoryIcon from '../components/ui/CategoryIcon.jsx';
import FlowBadge from '../components/ui/FlowBadge.jsx';
import {
  Plus,
  X,
  AlertCircle,
  Trash2,
} from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [form, setForm]             = useState({ name: '', type: 'expense', icon: '' });
  const [error, setError]           = useState('');
  const [adding, setAdding]         = useState(false);
  const [showForm, setShowForm]     = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.categories);
    } catch {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAdding(true);
    try {
      await api.post('/categories', form);
      setForm({ name: '', type: 'expense', icon: '' });
      setShowForm(false);
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const income  = categories.filter((c) => c.type === 'income');
  const expense = categories.filter((c) => c.type === 'expense');

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Categories</h1>
          <p className="text-xs text-text-muted mt-1">
            Organize transactions with default system classifications or custom categories
          </p>
        </div>

        <button
          onClick={() => setShowForm((p) => !p)}
          className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold shadow-lg shadow-primary-500/10 active:scale-95 cursor-pointer"
        >
          {showForm ? <X size={14} strokeWidth={2.2} /> : <Plus size={14} strokeWidth={2.2} />}
          <span>{showForm ? 'Close Form' : 'New Category'}</span>
        </button>
      </div>

      {/* Add Category Form */}
      {showForm && (
        <div className="card border-primary-500/30 bg-dark-800/95 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-600/50">
            <div>
              <h2 className="text-sm font-bold text-text-primary">Create Custom Category</h2>
              <p className="text-xs text-text-muted mt-0.5">Define category type, visual icon (emoji or icon name), and label</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-expense-400 text-xs flex items-center gap-2 bg-expense-500/10 border border-expense-500/25">
              <AlertCircle size={14} strokeWidth={2} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-3">
            {/* Type toggle */}
            <div className="w-full sm:w-auto">
              <label className="text-xs font-semibold text-text-secondary tracking-tight block mb-1.5">
                Type
              </label>
              <div className="flex rounded-xl overflow-hidden border border-dark-600 bg-dark-750 p-1">
                {['expense', 'income'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, type: t }))}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize cursor-pointer ${
                      form.type === t
                        ? t === 'income'
                          ? 'bg-income-500/20 text-income-400 border border-income-500/30'
                          : 'bg-expense-500/20 text-expense-400 border border-expense-500/30'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon */}
            <div className="w-full sm:w-28 flex-shrink-0">
              <Input
                label="Icon / Emoji"
                placeholder="📦 or car"
                value={form.icon}
                onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                className="text-center"
              />
            </div>

            {/* Name */}
            <div className="flex-1 w-full">
              <Input
                label="Category Name"
                placeholder="e.g. Groceries, Gym, Investments"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>

            <Button type="submit" loading={adding} className="w-full sm:w-auto py-2.5 px-5 text-xs flex-shrink-0">
              Save Category
            </Button>
          </form>
        </div>
      )}

      {/* Category Columns */}
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Categories */}
          <div className="card">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-600/50">
              <div className="flex items-center gap-3">
                <FlowBadge type="income" size="sm" />
                <div>
                  <h2 className="text-sm font-bold text-text-primary">Income Categories</h2>
                  <p className="text-[11px] text-text-muted">Inflow tags for compensation and returns</p>
                </div>
              </div>
              <span className="text-xs text-text-muted bg-dark-750 px-2 py-0.5 rounded-full border border-dark-600">
                {income.length} categories
              </span>
            </div>

            <div className="space-y-1.5">
              {income.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-dark-750/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <CategoryIcon icon={cat.icon} type={cat.type} size="sm" />
                    <span className="text-sm font-medium text-text-primary">{cat.name}</span>
                  </div>

                  <div>
                    {cat.isDefault ? (
                      <span className="text-[10px] text-text-muted px-2 py-0.5 bg-dark-750 rounded-md border border-dark-600/50">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDelete(cat._id)}
                        title="Delete custom category"
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-dark-700 hover:bg-expense-500/15 text-text-muted hover:text-expense-400 transition-all flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 size={13} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Categories */}
          <div className="card">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-600/50">
              <div className="flex items-center gap-3">
                <FlowBadge type="expense" size="sm" />
                <div>
                  <h2 className="text-sm font-bold text-text-primary">Expense Categories</h2>
                  <p className="text-[11px] text-text-muted">Outflow tags for expenses and bills</p>
                </div>
              </div>
              <span className="text-xs text-text-muted bg-dark-750 px-2 py-0.5 rounded-full border border-dark-600">
                {expense.length} categories
              </span>
            </div>

            <div className="space-y-1.5">
              {expense.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-dark-750/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <CategoryIcon icon={cat.icon} type={cat.type} size="sm" />
                    <span className="text-sm font-medium text-text-primary">{cat.name}</span>
                  </div>

                  <div>
                    {cat.isDefault ? (
                      <span className="text-[10px] text-text-muted px-2 py-0.5 bg-dark-750 rounded-md border border-dark-600/50">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDelete(cat._id)}
                        title="Delete custom category"
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-dark-700 hover:bg-expense-500/15 text-text-muted hover:text-expense-400 transition-all flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 size={13} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;