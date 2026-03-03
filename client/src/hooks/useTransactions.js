import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

const useTransactions = (filters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary]           = useState({ balance: 0, thisMonth: { income: 0, expense: 0 } });
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.type)      params.append('type', filters.type);
      if (filters.category)  params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate)   params.append('endDate', filters.endDate);

      const [txRes, sumRes] = await Promise.all([
        api.get(`/transactions?${params}`),
        api.get('/transactions/summary'),
      ]);

      setTransactions(txRes.data.transactions);
      setSummary(sumRes.data);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [filters.type, filters.category, filters.startDate, filters.endDate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const createTransaction = async (data) => {
    await api.post('/transactions', data);
    await fetchAll();
  };

  const updateTransaction = async (id, data) => {
    await api.put(`/transactions/${id}`, data);
    await fetchAll();
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    await fetchAll();
  };

  return {
    transactions, summary, loading, error,
    createTransaction, updateTransaction, deleteTransaction,
    refetch: fetchAll,
  };
};

export default useTransactions;