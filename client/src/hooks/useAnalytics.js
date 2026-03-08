import { useState, useEffect } from 'react';
import api from '../services/api.js';

const useAnalytics = () => {
  const [monthly, setMonthly]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const [monthRes, catRes] = await Promise.all([
          api.get('/transactions/analytics/monthly'),
          api.get('/transactions/analytics/category'),
        ]);
        setMonthly(monthRes.data.monthly);
        setCategories(catRes.data.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { monthly, categories, loading };
};

export default useAnalytics;