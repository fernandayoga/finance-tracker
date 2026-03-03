import Transaction from '../models/Transaction.js';

// ---------------------------------------------------
// @route   GET /api/transactions
// @access  Private
// Support filter: type, category, startDate, endDate
// ---------------------------------------------------
export const getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    // Selalu filter berdasarkan user yang login
    const filter = { user: req.user._id };

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
      .populate('category', 'name icon type') // tampilkan detail kategori
      .sort({ date: -1 });                    // terbaru dulu

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------------
// @route   GET /api/transactions/summary
// @access  Private
// Total saldo, pemasukan & pengeluaran bulan ini
// ---------------------------------------------------
export const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Rentang waktu bulan ini
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Agregasi: hitung total per type dalam bulan ini
    const monthlySummary = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Agregasi: total semua waktu untuk hitung saldo
    const allTimeSummary = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Format hasil agregasi jadi object yang mudah dibaca
    const monthly = { income: 0, expense: 0 };
    monthlySummary.forEach((item) => {
      monthly[item._id] = item.total;
    });

    const allTime = { income: 0, expense: 0 };
    allTimeSummary.forEach((item) => {
      allTime[item._id] = item.total;
    });

    res.status(200).json({
      balance: allTime.income - allTime.expense,
      thisMonth: {
        income: monthly.income,
        expense: monthly.expense,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------------
// @route   POST /api/transactions
// @access  Private
// ---------------------------------------------------
export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, note } = req.body;

    if (!type || !amount || !category || !date) {
      return res.status(400).json({ message: 'type, amount, category, date are required' });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      date: new Date(date),
      note: note || '',
    });

    // Populate category agar response langsung lengkap
    await transaction.populate('category', 'name icon type');

    res.status(201).json({ message: 'Transaction created', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------------
// @route   PUT /api/transactions/:id
// @access  Private
// ---------------------------------------------------
export const updateTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, note } = req.body;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id, // pastikan milik user ini
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update hanya field yang dikirim
    if (type) transaction.type = type;
    if (amount) transaction.amount = amount;
    if (category) transaction.category = category;
    if (date) transaction.date = new Date(date);
    if (note !== undefined) transaction.note = note;

    await transaction.save();
    await transaction.populate('category', 'name icon type');

    res.status(200).json({ message: 'Transaction updated', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------------
// @route   DELETE /api/transactions/:id
// @access  Private
// ---------------------------------------------------
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.deleteOne();

    res.status(200).json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};