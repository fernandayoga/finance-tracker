import express from 'express';
import {
  getTransactions,
  getSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Semua route transaction butuh login
router.use(protect);

router.get('/summary', getSummary);  // harus di atas /:id
router.get('/', getTransactions);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;