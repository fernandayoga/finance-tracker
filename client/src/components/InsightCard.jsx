import { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Receipt,
  PiggyBank,
  AlertTriangle,
  Flame,
  Calendar,
  Info,
} from 'lucide-react';

const InsightCard = ({ transactions = [] }) => {
  const insights = useMemo(() => {
    const now   = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const thisWeekTx = transactions.filter((t) => new Date(t.date) >= startOfWeek);
    const lastWeekTx = transactions.filter(
      (t) => new Date(t.date) >= startOfLastWeek && new Date(t.date) < startOfWeek
    );

    const result = [];

    const calcTotal = (txList, type) =>
      txList.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);

    const thisExpense = calcTotal(thisWeekTx, 'expense');
    const lastExpense = calcTotal(lastWeekTx, 'expense');
    const thisIncome  = calcTotal(thisWeekTx, 'income');

    const fmt = (val) => `Rp ${Number(val).toLocaleString('id-ID')}`;

    // ── Insight 1: Perbandingan pengeluaran minggu ini vs minggu lalu
    if (lastExpense > 0) {
      const diff    = thisExpense - lastExpense;
      const percent = Math.abs((diff / lastExpense) * 100).toFixed(1);
      const isUp    = diff > 0;

      result.push({
        Icon:   isUp ? TrendingUp : TrendingDown,
        badgeStyle: isUp
          ? 'bg-gradient-to-br from-rose-500/25 via-pink-500/15 to-rose-950/40 border-rose-400/40 text-rose-300 shadow-[0_2px_10px_rgba(251,113,133,0.3)]'
          : 'bg-gradient-to-br from-emerald-400/25 via-teal-500/15 to-emerald-950/40 border-emerald-400/40 text-emerald-300 shadow-[0_2px_10px_rgba(45,212,191,0.3)]',
        title:  isUp ? 'Spending Increased' : 'Spending Decreased',
        text:   isUp
          ? `Weekly spending is up by ${percent}% compared to last week.`
          : `Weekly spending dropped by ${percent}% compared to last week. Good job!`,
      });
    } else if (thisExpense > 0) {
      result.push({
        Icon:   Receipt,
        badgeStyle: 'bg-gradient-to-br from-indigo-500/25 via-purple-500/15 to-indigo-950/40 border-indigo-400/40 text-indigo-300 shadow-[0_2px_10px_rgba(99,102,241,0.3)]',
        title:  'Weekly Expenses',
        text:   `Total expenses recorded this week: ${fmt(thisExpense)}.`,
      });
    }

    // ── Insight 2: Saving rate minggu ini
    if (thisIncome > 0) {
      const saving = thisIncome - thisExpense;
      const rate   = ((saving / thisIncome) * 100).toFixed(1);
      const isGood = saving >= 0;

      result.push({
        Icon:   isGood ? PiggyBank : AlertTriangle,
        badgeStyle: isGood
          ? 'bg-gradient-to-br from-emerald-400/25 via-teal-500/15 to-emerald-950/40 border-emerald-400/40 text-emerald-300 shadow-[0_2px_10px_rgba(45,212,191,0.3)]'
          : 'bg-gradient-to-br from-amber-400/25 via-orange-500/15 to-amber-950/40 border-amber-400/40 text-amber-300 shadow-[0_2px_10px_rgba(245,158,11,0.3)]',
        title:  isGood ? 'Positive Savings' : 'Cashflow Warning',
        text:   isGood
          ? `Your weekly savings rate is ${rate}%. Keep up the momentum!`
          : `Current spending exceeds income recorded for this week.`,
      });
    }

    // ── Insight 3: Kategori terboros minggu ini
    const categoryMap = {};
    thisWeekTx
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const name = t.category?.name || 'Other';
        categoryMap[name] = (categoryMap[name] || 0) + t.amount;
      });

    const topCategory = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])[0];

    if (topCategory) {
      result.push({
        Icon:   Flame,
        badgeStyle: 'bg-gradient-to-br from-orange-500/25 via-rose-500/15 to-red-950/40 border-orange-400/40 text-orange-300 shadow-[0_2px_10px_rgba(249,115,22,0.3)]',
        title:  'Top Expense Category',
        text:   `${topCategory[0]} is your highest spending category this week at ${fmt(topCategory[1])}.`,
      });
    }

    // ── Insight 4: Hari paling boros minggu ini
    const dayMap = {};
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    thisWeekTx
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const day = dayNames[new Date(t.date).getDay()];
        dayMap[day] = (dayMap[day] || 0) + t.amount;
      });

    const highestDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0];
    if (highestDay) {
      result.push({
        Icon:   Calendar,
        badgeStyle: 'bg-gradient-to-br from-indigo-500/25 via-purple-500/15 to-indigo-950/40 border-indigo-400/40 text-indigo-300 shadow-[0_2px_10px_rgba(99,102,241,0.3)]',
        title:  'Peak Spending Day',
        text:   `${highestDay[0]} was your peak spending day with ${fmt(highestDay[1])}.`,
      });
    }

    // ── Fallback
    if (result.length === 0) {
      result.push({
        Icon:   Info,
        badgeStyle: 'bg-gradient-to-br from-slate-600/25 via-dark-700 to-dark-850 border-slate-500/30 text-slate-300 shadow-sm',
        title:  'Getting Started',
        text:   'No transactions recorded this week. Add some transactions to unlock automated weekly financial insights.',
      });
    }

    return result;
  }, [transactions]);

  return (
    <div className="space-y-2.5">
      {insights.map((ins, i) => (
        <div
          key={i}
          className="group flex items-start gap-3 p-3.5 rounded-xl bg-dark-750/50 border border-dark-600/50 hover:border-dark-500/70 transition-all duration-200"
        >
          <div className={`relative w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ring-1 ring-inset ring-white/15 transition-transform duration-300 group-hover:scale-110 ${ins.badgeStyle}`}>
            <span className="absolute inset-x-1.5 top-0.5 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
            <ins.Icon size={15} strokeWidth={2.4} fill="currentColor" fillOpacity={0.2} className="relative z-10" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-text-primary mb-0.5">{ins.title}</p>
            <p className="text-xs text-text-secondary leading-relaxed">{ins.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InsightCard;