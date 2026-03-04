const InsightCard = ({ monthly }) => {
  if (monthly.length < 2) return null;

  const current  = monthly[monthly.length - 1];
  const previous = monthly[monthly.length - 2];

  const insights = [];

  // Insight 1: perbandingan pengeluaran bulan ini vs bulan lalu
  if (previous.expense > 0) {
    const diff    = current.expense - previous.expense;
    const percent = Math.abs((diff / previous.expense) * 100).toFixed(1);
    const isUp    = diff > 0;

    insights.push({
      icon:  isUp ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down',
      color: isUp ? 'text-expense-400' : 'text-income-400',
      bg:    isUp ? 'rgba(244,63,94,0.08)' : 'rgba(34,197,94,0.08)',
      border: isUp ? 'rgba(244,63,94,0.15)' : 'rgba(34,197,94,0.15)',
      text: isUp
        ? `Pengeluaran naik ${percent}% dari bulan lalu`
        : `Pengeluaran turun ${percent}% dari bulan lalu 🎉`,
    });
  }

  // Insight 2: saving rate bulan ini
  if (current.income > 0) {
    const saving = current.income - current.expense;
    const rate   = ((saving / current.income) * 100).toFixed(1);
    const isGood = saving >= 0;

    insights.push({
      icon:  isGood ? 'fa-piggy-bank' : 'fa-triangle-exclamation',
      color: isGood ? 'text-income-400' : 'text-warning-400',
      bg:    isGood ? 'rgba(34,197,94,0.08)' : 'rgba(251,191,36,0.08)',
      border: isGood ? 'rgba(34,197,94,0.15)' : 'rgba(251,191,36,0.15)',
      text: isGood
        ? `Saving rate bulan ini ${rate}% — good job!`
        : `Pengeluaran melebihi pemasukan bulan ini`,
    });
  }

  // Insight 3: bulan terbaik
  const bestMonth = [...monthly].sort((a, b) => (b.income - b.expense) - (a.income - a.expense))[0];
  if (bestMonth) {
    insights.push({
      icon:  'fa-trophy',
      color: 'text-warning-400',
      bg:    'rgba(251,191,36,0.08)',
      border: 'rgba(251,191,36,0.15)',
      text: `Bulan terbaik kamu: ${bestMonth.month}`,
    });
  }

  return (
    <div className="flex flex-col gap-2.5">
      {insights.map((ins, i) => (
        <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border"
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