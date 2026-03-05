import { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/layout/MainLayout.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import api from '../services/api.js';
import Sidebar from "../components/layout/Sidebar.jsx";
import BottomNav from "../components/layout/BottomNav.jsx";
import MobileHeader from "../components/layout/MobileHeader.jsx";
import CategoryIcon from '../components/ui/CategoryIcon.jsx';

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
    <div className="min-h-screen bg-dark-900">
  <Sidebar />
  <MobileHeader />

  {/* Geser konten manual sejauh lebar sidebar */}
  <div style={{ marginLeft: '0' }} className="lg:ml-[224px] pt-16 lg:pt-0 pb-24 lg:pb-0">
    <div style={{ maxWidth: '900px', margin: '0 auto' }} className="px-4 lg:px-8 py-6">
      {/* konten */}
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Categories</h1>
          <p className="text-text-muted text-sm mt-0.5">Manage your transaction categories</p>
        </div>
        <button
          onClick={() => setShowForm((p) => !p)}
          className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold glow-green"
        >
          <i className={`fa-solid fa-${showForm ? 'xmark' : 'plus'} text-xs`} />
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">New Category</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-expense-400 text-sm flex items-center gap-2"
              style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)' }}>
              <i className="fa-solid fa-triangle-exclamation text-xs" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            {/* Type toggle */}
            <div className="flex rounded-xl overflow-hidden border border-dark-500 flex-shrink-0">
              {['income', 'expense'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: t }))}
                  className={`px-4 py-2 text-xs font-semibold transition-all ${
                    form.type === t
                      ? t === 'income'
                        ? 'bg-income-500/20 text-income-400'
                        : 'bg-expense-500/20 text-expense-400'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Icon */}
            <Input
              placeholder="Icon (emoji)"
              value={form.icon}
              onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
              className="w-24 flex-shrink-0 text-center"
            />

            {/* Name */}
            <Input
              placeholder="Category name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="flex-1"
              required
            />

            <Button type="submit" loading={adding} className="flex-shrink-0">
              Add
            </Button>
          </form>
        </div>
      )}

      {/* Category Lists */}
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { label: 'Income',  data: income,  color: 'text-income-400',  bg: 'rgba(34,197,94,0.1)',  icon: 'arrow-trend-up' },
            { label: 'Expense', data: expense, color: 'text-expense-400', bg: 'rgba(244,63,94,0.1)', icon: 'arrow-trend-down' },
          ].map((section) => (
            <div key={section.label} className="card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: section.bg }}>
                  <i className={`fa-solid fa-${section.icon} text-xs ${section.color}`} />
                </div>
                <h2 className="text-sm font-semibold text-text-primary">{section.label}</h2>
                <span className="ml-auto text-text-muted text-xs">{section.data.length} categories</span>
              </div>

              <div className="flex flex-col gap-1">
                {section.data.map((cat) => (
                  <div key={cat._id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-dark-700 transition-colors group">
                    <CategoryIcon icon={cat.icon} type={cat.type} size="sm" />
                    <span className="text-text-primary text-sm font-medium flex-1">{cat.name}</span>

                    {cat.isDefault ? (
                      <span className="text-text-muted text-xs px-2 py-0.5 bg-dark-600 rounded-full">
                        default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-dark-600 hover:bg-expense-500/20 text-text-muted hover:text-expense-400 transition-all flex items-center justify-center"
                      >
                        <i className="fa-solid fa-trash text-xs" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

  <BottomNav />
</div>

      
      

    
  );
};

export default Categories;