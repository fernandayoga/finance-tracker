import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // wajib pakai .js di ES Module

dotenv.config();
connectDB();

const app = express();

// CORS — hanya izinkan request dari frontend kita
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

// Routes — akan dibuka satu per satu di step berikutnya
// app.use('/api/auth', authRoutes);
// app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Finance Tracker API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));