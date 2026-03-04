import express from 'express';
import {
  getTransactions,
  getSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlyAnalytics,
  getCategoryAnalytics,
} from '../controllers/transactionController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Urutan penting — route spesifik di atas route dinamis
router.get('/summary',            getSummary);
router.get('/analytics/monthly',  getMonthlyAnalytics);
router.get('/analytics/category', getCategoryAnalytics);
router.get('/',                   getTransactions);
router.post('/',                  createTransaction);
router.put('/:id',                updateTransaction);
router.delete('/:id',             deleteTransaction);

export default router;