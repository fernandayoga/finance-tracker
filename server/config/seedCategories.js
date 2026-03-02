import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

dotenv.config();

const defaultCategories = [
  // Income
  { name: 'Gaji',        type: 'income',  icon: '💼', isDefault: true },
  { name: 'Freelance',   type: 'income',  icon: '💻', isDefault: true },
  { name: 'Investasi',   type: 'income',  icon: '📈', isDefault: true },
  { name: 'Hadiah',      type: 'income',  icon: '🎁', isDefault: true },
  { name: 'Lainnya',     type: 'income',  icon: '💰', isDefault: true },

  // Expense
  { name: 'Makan',       type: 'expense', icon: '🍜', isDefault: true },
  { name: 'Transport',   type: 'expense', icon: '🚗', isDefault: true },
  { name: 'Belanja',     type: 'expense', icon: '🛒', isDefault: true },
  { name: 'Tagihan',     type: 'expense', icon: '📄', isDefault: true },
  { name: 'Kesehatan',   type: 'expense', icon: '💊', isDefault: true },
  { name: 'Hiburan',     type: 'expense', icon: '🎮', isDefault: true },
  { name: 'Pendidikan',  type: 'expense', icon: '📚', isDefault: true },
  { name: 'Lainnya',     type: 'expense', icon: '💸', isDefault: true },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Hapus kategori default lama biar tidak duplikat
    await Category.deleteMany({ isDefault: true });

    await Category.insertMany(defaultCategories);
    console.log('Default categories seeded!');

  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

seed();