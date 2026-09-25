import { useMemo } from 'react';

const InsightCard = ({ transactions = [] }) => {
  const insights = useMemo(() => {
    if (!transactions.length) return [];

    const now       = new Date();
    const result    = [];

    // Rentang minggu ini & minggu lalu
    const dayOfWeek     = now.getDay();
    const startThisWeek = new Date(now);
    startThisWeek.setDate(now.getDate() - dayOfWeek);
    startThisWeek.setHours(0, 0, 0, 0);

    const startLastWeek = new Date(startThisWeek);
    startLastWeek.setDate(startThisWeek.getDate() - 7);
    const endLastWeek = new Date(startThisWeek);
    endLastWeek.setMilliseconds(-1);

    // Filter transaksi per minggu
    const thisWeekTx = transactions.filter(t => new Date(t.date) >= startThisWeek);
    const lastWeekTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d >= startLastWeek && d <= endLastWeek;
    });

    const calcTotal = (txList, type) =>
      txList.filter(t => t.type === type).reduce((s, t) => s + t.amount, 0);

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
        icon:   isUp ? 'arrow-trend-up' : 'arrow-trend-down',
        color:  isUp ? 'text-expense-400' : 'text-income-400',
        badgeBg: isUp ? 'bg-expense-500/15' : 'bg-income-500/15',
        title:  isUp ? 'Spending Increased' : 'Spending Decreased',
        text:   isUp
          ? `Weekly spending is up by ${percent}% compared to last week.`
          : `Weekly spending dropped by ${percent}% compared to last week. Good job!`,
      });
    } else if (thisExpense > 0) {
      result.push({
        icon:   'receipt',
        color:  'text-text-secondary',
        badgeBg: 'bg-dark-700',
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
        icon:   isGood ? 'piggy-bank' : 'triangle-exclamation',
        color:  isGood ? 'text-income-400' : 'text-warning-400',
        badgeBg: isGood ? 'bg-income-500/15' : 'bg-warning-500/15',
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
        icon:   'fire-flame-curved',
        color:  'text-warning-400',
        badgeBg: 'bg-warning-500/15',
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
        icon:   'calendar-day',
        color:  'text-primary-400',
        badgeBg: 'bg-primary-500/15',
        title:  'Peak Spending Day',
        text:   `${highestDay[0]} was your peak spending day with ${fmt(highestDay[1])}.`,
      });
    }

    // ── Fallback
    if (result.length === 0) {
      result.push({
        icon:   'circle-info',
        color:  'text-text-muted',
        badgeBg: 'bg-dark-700',
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
          className="flex items-start gap-3 p-3.5 rounded-xl bg-dark-750/50 border border-dark-600/50 hover:border-dark-500/70 transition-colors"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ins.badgeBg} ${ins.color}`}>
            <i className={`fa-solid fa-${ins.icon} text-xs`} />
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