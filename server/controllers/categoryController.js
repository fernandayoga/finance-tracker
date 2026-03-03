import Category from '../models/Category.js';

// ---------------------------------------------------
// @route   GET /api/categories
// @access  Private
// Ambil semua kategori: default + milik user yg login
// ---------------------------------------------------
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      $or: [
        { isDefault: true },           // kategori sistem
        { user: req.user._id },        // kategori milik user ini
      ],
    });

    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------------
// @route   POST /api/categories
// @access  Private
// ---------------------------------------------------
export const createCategory = async (req, res) => {
  try {
    const { name, type, icon } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    // Cek duplikat — user tidak boleh buat kategori dengan nama + type yang sama
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') }, // case-insensitive
      type,
      $or: [{ isDefault: true }, { user: req.user._id }],
    });

    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      type,
      icon: icon || '📦',
      isDefault: false,
      user: req.user._id,
    });

    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------------
// @route   DELETE /api/categories/:id
// @access  Private
// Hanya bisa hapus kategori milik sendiri, bukan default
// ---------------------------------------------------
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id, // pastikan milik user ini
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found or not yours' });
    }

    await category.deleteOne();

    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};