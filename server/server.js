import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; 
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';        
import transactionRoutes from './routes/transactionRoutes.js';
dotenv.config();
connectDB();

const app = express();

// Daftarkan semua origin yang boleh akses
const allowedOrigins = [
  'http://localhost:5173',          // dev
  process.env.CLIENT_URL,          // production (diisi nanti)
];

app.use(cors({
  origin: (origin, callback) => {
    // Izinkan request tanpa origin (Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);           // tambah
app.use('/api/transactions', transactionRoutes);  

app.get('/', (req, res) => {
  res.json({ message: 'Finance Tracker API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));