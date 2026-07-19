import { useContext } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { DashboardContext } from "../../context/DashboardContext";

const COLORS = [
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#14b8a6",
  "#64748b",
];

const CountryChart = () => {
  const { dashboard, loading } = useContext(DashboardContext);

  if (loading)
    return (
      <div className="min-h-[380px] rounded-2xl bg-[#111827] animate-pulse" />
    );

  const countries = dashboard?.countries || [];

  return (
    <div className="bg-[#111827] rounded-2xl border border-slate-800 p-6">
      <h2 className="text-xl font-semibold mb-5">
        Top Countries
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={countries}
            dataKey="value"
            nameKey="country"
            outerRadius={110}
          >
            {countries.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountryChart;