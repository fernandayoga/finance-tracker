import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'], // hanya boleh dua nilai ini
      required: true,
    },
    icon: {
      type: String,
      default: '📦', // emoji default jika tidak diisi
    },
    isDefault: {
      type: Boolean,
      default: false, // true = kategori bawaan sistem
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null = kategori default (milik semua user)
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Category', categorySchema);