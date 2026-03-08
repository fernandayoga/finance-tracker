import Groq from 'groq-sdk';
import Transaction from '../models/Transaction.js';



// ============================================================
// HELPERS
// ============================================================

const formatRupiah = (amount) =>
  `Rp ${Number(amount).toLocaleString('id-ID')}`;

const getDateRange = (monthOffset = 0) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const end   = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 0, 23, 59, 59);
  return { start, end };
};

const calcSummary = (transactions) => {
  const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expense, balance: income - expense };
};

const getTopCategories = (transactions) => {
  const map = {};

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const name = t.category?.name || 'Lainnya';
      map[name] = (map[name] || 0) + t.amount;
    });

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, amount]) => `  - ${name}: ${formatRupiah(amount)}`)
    .join('\n');
};

const getRecentTransactions = (transactions) =>
  transactions
    .slice(0, 10)
    .map(t => {
      const sign     = t.type === 'income' ? '+' : '-';
      const category = t.category?.name || 'Lainnya';
      const note     = t.note ? ` · ${t.note}` : '';
      const date     = new Date(t.date).toLocaleDateString('id-ID');
      return `  - ${sign}${formatRupiah(t.amount)} (${category})${note} — ${date}`;
    })
    .join('\n');

// ============================================================
// FETCH USER FINANCIAL DATA
// ============================================================

const getUserFinancialData = async (userId) => {
  const thisMonthRange = getDateRange(0);
  const lastMonthRange = getDateRange(-1);

  const [thisMonthTx, lastMonthTx, allTx] = await Promise.all([
    Transaction.find({ user: userId, date: { $gte: thisMonthRange.start, $lte: thisMonthRange.end } })
      .populate('category', 'name icon type'),

    Transaction.find({ user: userId, date: { $gte: lastMonthRange.start, $lte: lastMonthRange.end } })
      .populate('category', 'name icon type'),

    Transaction.find({ user: userId })
      .populate('category', 'name icon type')
      .sort({ date: -1 })
      .limit(50),
  ]);

  return { thisMonthTx, lastMonthTx, allTx };
};

// ============================================================
// BUILD SYSTEM PROMPT
// ============================================================

const buildSystemPrompt = ({ thisMonthTx, lastMonthTx, allTx }) => {
  const now       = new Date();
  const thisMonth = calcSummary(thisMonthTx);
  const lastMonth = calcSummary(lastMonthTx);
  const allTime   = calcSummary(allTx);

  const monthLabel = now.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  return `
Kamu adalah asisten keuangan personal yang cerdas dan friendly.
Tugasmu membantu user memahami dan menganalisis kondisi keuangan mereka.

================================================================
DATA KEUANGAN USER
================================================================

📅 BULAN INI — ${monthLabel}
  Pemasukan  : ${formatRupiah(thisMonth.income)}
  Pengeluaran: ${formatRupiah(thisMonth.expense)}
  Selisih    : ${formatRupiah(thisMonth.balance)}

📅 BULAN LALU
  Pemasukan  : ${formatRupiah(lastMonth.income)}
  Pengeluaran: ${formatRupiah(lastMonth.expense)}
  Selisih    : ${formatRupiah(lastMonth.balance)}

💰 TOTAL SALDO KESELURUHAN
  ${formatRupiah(allTime.income - allTime.expense)}

🏷️ TOP PENGELUARAN BULAN INI PER KATEGORI
${getTopCategories(thisMonthTx) || '  Belum ada data pengeluaran bulan ini'}

📋 10 TRANSAKSI TERBARU
${getRecentTransactions(allTx) || '  Belum ada transaksi'}

================================================================
INSTRUKSI
================================================================
- Jawab dalam Bahasa Indonesia yang santai dan friendly
- Gunakan emoji secukupnya agar lebih menarik
- Berikan insight atau saran yang berguna jika relevan
- Jika data tidak tersedia, sampaikan dengan jujur
- Format angka selalu dalam Rupiah (Rp)
- Jawaban singkat dan to the point, maksimal 3-4 paragraf
  `.trim();
};

// ============================================================
// CONTROLLER
// @route   POST /api/chat
// @access  Private
// ============================================================

export const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // 1. Ambil data keuangan user
    const financialData = await getUserFinancialData(req.user._id);

    // 2. Build system prompt dengan data terbaru
    const systemPrompt = buildSystemPrompt(financialData);

    // 3. Susun messages — ambil 6 history terakhir sebagai konteks
    const messages = [
      { role: 'system',  content: systemPrompt },
      ...history.slice(-6).map(({ role, content }) => ({ role, content })),
      { role: 'user',    content: message.trim() },
    ];

    // 4. Kirim ke Groq
    const completion = await groq.chat.completions.create({
      model:       'llama-3.1-8b-instant',
      messages,
      max_tokens:  1024,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content
      ?? 'Maaf, aku tidak bisa memproses pertanyaan kamu saat ini. Coba lagi ya!';

    res.status(200).json({ reply });

  } catch (error) {
    console.error('[ChatController]', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};