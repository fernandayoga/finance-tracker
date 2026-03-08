import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

dotenv.config();

const defaultCategories = [
  // Income
  { name: 'Gaji',       type: 'income',  icon: 'fa-money-bill-wave',  isDefault: true },
  { name: 'Freelance',  type: 'income',  icon: 'fa-laptop-code',      isDefault: true },
  { name: 'Investasi',  type: 'income',  icon: 'fa-chart-line',       isDefault: true },
  { name: 'Hadiah',     type: 'income',  icon: 'fa-gift',             isDefault: true },
  { name: 'Lainnya',    type: 'income',  icon: 'fa-circle-plus',      isDefault: true },

  // Expense
  { name: 'Makan',      type: 'expense', icon: 'fa-utensils',         isDefault: true },
  { name: 'Transport',  type: 'expense', icon: 'fa-car',              isDefault: true },
  { name: 'Belanja',    type: 'expense', icon: 'fa-bag-shopping',     isDefault: true },
  { name: 'Tagihan',    type: 'expense', icon: 'fa-file-invoice',     isDefault: true },
  { name: 'Kesehatan',  type: 'expense', icon: 'fa-heart-pulse',      isDefault: true },
  { name: 'Hiburan',    type: 'expense', icon: 'fa-gamepad',          isDefault: true },
  { name: 'Pendidikan', type: 'expense', icon: 'fa-book',             isDefault: true },
  { name: 'Lainnya',    type: 'expense', icon: 'fa-circle-minus',     isDefault: true },
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