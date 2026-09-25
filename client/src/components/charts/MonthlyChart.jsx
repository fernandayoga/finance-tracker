import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const fmt = (val) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="rounded-xl border border-dark-600 bg-dark-800/95 backdrop-blur-md px-3.5 py-2.5 text-xs shadow-xl">
      <p className="text-text-secondary font-semibold mb-1.5">{label}</p>
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-text-muted">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="capitalize">{p.name}</span>
            </span>
            <span className="font-bold tabular-nums" style={{ color: p.color }}>
              {fmt(p.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MonthlyChart = ({ data }) => {
  if (!data?.length) return (
    <div className="flex flex-col items-center justify-center h-64 text-text-muted text-center p-4">
      <div className="w-10 h-10 rounded-xl bg-dark-750 border border-dark-600 flex items-center justify-center mb-2">
        <i className="fa-solid fa-chart-simple text-sm text-text-muted" />
      </div>
      <p className="text-xs font-medium text-text-secondary">No transaction history yet</p>
      <p className="text-[11px] text-text-muted mt-0.5">Transactions across months will visualize here</p>
    </div>
  );

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          barCategoryGap="28%"
          barGap={6}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#252d42" vertical={false} />

          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => val.split(' ')[0]}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => {
              if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)}B`;
              if (val >= 1000000) return `${(val / 1000000).toFixed(0)}M`;
              if (val >= 1000)    return `${(val / 1000).toFixed(0)}K`;
              return val;
            }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
            formatter={(val) => (
              <span className="text-text-secondary text-xs font-medium capitalize ml-1">
                {val}
              </span>
            )}
          />

          <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
          <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;