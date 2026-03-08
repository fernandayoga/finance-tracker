import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes
import authRoutes from '../server/routes/authRoutes.js';
import categoryRoutes from '../server/routes/categoryRoutes.js';
import transactionRoutes from '../server/routes/transactionRoutes.js';
import chatRoutes from '../server/routes/chatRoutes.js';

dotenv.config();

const app = express();

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

app.use(express.json());

// Koneksi MongoDB — pakai cached connection
// karena serverless function bisa cold start
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
};

// Middleware koneksi DB di setiap request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Finance Tracker API is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

export default app;