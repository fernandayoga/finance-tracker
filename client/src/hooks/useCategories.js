import { useState, useEffect } from 'react';
import api from '../services/api.js';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch {
      console.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const createCategory = async (data) => {
    await api.post('/categories', data);
    await fetchCategories();
  };

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`);
    await fetchCategories();
  };

  return { categories, loading, createCategory, deleteCategory };
};

export default useCategories;