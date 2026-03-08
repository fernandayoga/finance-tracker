import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const fmt = (val) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="rounded-xl border border-dark-500 px-4 py-3 text-xs"
      style={{ backgroundColor: '#1c2333' }}>
      <p className="text-text-secondary font-semibold mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name.charAt(0).toUpperCase() + p.name.slice(1)}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

const MonthlyChart = ({ data }) => {
  if (!data.length) return (
    <div className="flex flex-col items-center justify-center h-64 text-text-muted">
      <i className="fa-solid fa-chart-bar text-3xl mb-3" />
      <p className="text-sm">No data yet</p>
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        barCategoryGap="30%" barGap={4}>

        <CartesianGrid strokeDasharray="3 3" stroke="#232d42" vertical={false} />

        <XAxis
          dataKey="month"
          tick={{ fill: '#4b5d7a', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(val) => val.split(' ')[0]}
        />
        <YAxis
          tick={{ fill: '#4b5d7a', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(val) => {
            if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
            if (val >= 1000)    return `${(val / 1000).toFixed(0)}K`;
            return val;
          }}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend
          wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
          formatter={(val) => (
            <span style={{ color: '#94a3b8' }}>
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </span>
          )}
        />

        <Bar dataKey="income"  fill="#22c55e" radius={[6, 6, 0, 0]} />
        <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />

      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyChart;