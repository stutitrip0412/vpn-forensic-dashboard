import { useContext } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DashboardContext } from "../../context/DashboardContext";
import { Cell } from "recharts";

const COLORS = {
  critical: "#dc2626",
  high: "#f97316",
  medium: "#eab308",
  low: "#06b6d4",
};
const ThreatChart = () => {
  const { dashboard, loading } = useContext(DashboardContext);

  if (loading)
    return (
      <div className="min-h-[380px] rounded-2xl bg-[#111827] animate-pulse" />
    );

  const threats = dashboard?.threats || [];

  return (
    <div className="bg-[#111827] rounded-2xl border border-slate-800 p-6">
      <h2 className="text-xl font-semibold mb-5">
        Threat Distribution
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={threats}>
          <XAxis
            dataKey="type"
            stroke="#94a3b8"
          />

          <YAxis stroke="#94a3b8" />

          <Tooltip />

          <Bar dataKey="count">
  {threats.map((entry, index) => (
    <Cell
      key={index}
      fill={COLORS[entry.type] || "#64748b"}
    />
  ))}
</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThreatChart;