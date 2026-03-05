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
        icon:   isUp ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down',
        color:  isUp ? 'text-expense-400' : 'text-income-400',
        bg:     isUp ? 'rgba(244,63,94,0.08)'  : 'rgba(34,197,94,0.08)',
        border: isUp ? 'rgba(244,63,94,0.15)'  : 'rgba(34,197,94,0.15)',
        text:   isUp
          ? `Pengeluaran minggu ini naik ${percent}% dari minggu lalu`
          : `Pengeluaran minggu ini turun ${percent}% dari minggu lalu 🎉`,
      });
    } else if (thisExpense > 0) {
      result.push({
        icon:   'fa-receipt',
        color:  'text-text-secondary',
        bg:     'rgba(148,163,184,0.08)',
        border: 'rgba(148,163,184,0.15)',
        text:   `Pengeluaran minggu ini: ${fmt(thisExpense)}`,
      });
    }

    // ── Insight 2: Saving rate minggu ini
    if (thisIncome > 0) {
      const saving = thisIncome - thisExpense;
      const rate   = ((saving / thisIncome) * 100).toFixed(1);
      const isGood = saving >= 0;

      result.push({
        icon:   isGood ? 'fa-piggy-bank' : 'fa-triangle-exclamation',
        color:  isGood ? 'text-income-400' : 'text-warning-400',
        bg:     isGood ? 'rgba(34,197,94,0.08)'  : 'rgba(251,191,36,0.08)',
        border: isGood ? 'rgba(34,197,94,0.15)'  : 'rgba(251,191,36,0.15)',
        text:   isGood
          ? `Saving rate minggu ini ${rate}% — good job! 💪`
          : `Pengeluaran melebihi pemasukan minggu ini`,
      });
    }

    // ── Insight 3: Kategori terboros minggu ini
    const categoryMap = {};
    thisWeekTx
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const name = t.category?.name || 'Lainnya';
        categoryMap[name] = (categoryMap[name] || 0) + t.amount;
      });

    const topCategory = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])[0];

    if (topCategory) {
      result.push({
        icon:   'fa-fire',
        color:  'text-warning-400',
        bg:     'rgba(251,191,36,0.08)',
        border: 'rgba(251,191,36,0.15)',
        text:   `Pengeluaran terbesar minggu ini: ${fmt(topCategory[1])}`,
      });
    }

    // ── Insight 4: Hari paling boros minggu ini
    const dayMap = {};
    const dayNames = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    thisWeekTx
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const day = dayNames[new Date(t.date).getDay()];
        dayMap[day] = (dayMap[day] || 0) + t.amount;
      });

    const borostDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0];
    if (borostDay) {
      result.push({
        icon:   'fa-calendar-day',
        color:  'text-primary-400',
        bg:     'rgba(34,197,94,0.08)',
        border: 'rgba(34,197,94,0.15)',
        text:   `Hari paling boros minggu ini: ${borostDay[0]} (${fmt(borostDay[1])})`,
      });
    }

    // ── Fallback kalau tidak ada transaksi minggu ini
    if (result.length === 0) {
      result.push({
        icon:   'fa-info-circle',
        color:  'text-text-secondary',
        bg:     'rgba(148,163,184,0.08)',
        border: 'rgba(148,163,184,0.15)',
        text:   'Belum ada transaksi minggu ini. Yuk mulai catat! 📝',
      });
    }

    return result;
  }, [transactions]);

  return (
    <div className="flex flex-col gap-2.5">
      {insights.map((ins, i) => (
        <div key={i}
          className="flex items-center gap-3 p-3.5 rounded-xl border"
          style={{ background: ins.bg, borderColor: ins.border }}>
          <div className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0">
            <i className={`fa-solid ${ins.icon} text-xs ${ins.color}`} />
          </div>
          <p className="text-text-secondary text-sm">{ins.text}</p>
        </div>
      ))}
    </div>
  );
};

export default InsightCard;