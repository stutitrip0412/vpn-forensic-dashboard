import { useContext } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DashboardContext } from "../../context/DashboardContext";

const TimelineChart = () => {
  const { dashboard, loading } = useContext(DashboardContext);

  if (loading)
    return (
      <div className="min-h-[380px] rounded-2xl bg-[#111827] animate-pulse" />
    );

  const data = dashboard?.timeline || [];

  return (
    <div className="bg-[#111827] rounded-2xl border border-slate-800 p-6">
      <h2 className="text-xl font-semibold mb-5">
        VPN Connections Timeline
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid stroke="#1f2937" />

          <XAxis
            dataKey="time"
            stroke="#94a3b8"
          />

          <YAxis stroke="#94a3b8" />

          <Tooltip />

          <Line
            dataKey="sessions"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={false}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;