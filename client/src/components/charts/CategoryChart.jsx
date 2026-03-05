import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#f43f5e",
  "#3b82f6",
  "#ec4899",
  "#10b981",
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const fmt = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  return (
    <div
      className="rounded-xl border border-dark-500 px-4 py-3 text-xs"
      style={{ backgroundColor: "#1c2333" }}
    >
      <p className="text-text-primary font-semibold flex items-center gap-2">
        <i className={`fa-solid ${payload[0].payload.icon} text-xs`} />
        {payload[0].name}
      </p>
      <p className="text-text-secondary mt-1">{fmt(payload[0].value)}</p>
    </div>
  );
};

const CategoryChart = ({ data }) => {
  if (!data.length)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-text-muted">
        <i className="fa-solid fa-chart-pie text-3xl mb-3" />
        <p className="text-sm">No expense data this month</p>
      </div>
    );

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(val, entry) => (
            <span style={{ color: "#94a3b8", fontSize: "12px" }}>
              {entry.payload.icon} {val}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryChart;
