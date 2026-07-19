import { useContext } from "react";
import {
  FolderOpen,
  Activity,
  AlertTriangle,
  FileSearch,
} from "lucide-react";

import StatCard from "./StatCard";
import { DashboardContext } from "../../context/DashboardContext";

const StatsGrid = () => {
  const { dashboard, loading } = useContext(DashboardContext);

  if (loading) {
    return (
      <div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-6
mb-8
">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 rounded-2xl bg-[#111827] animate-pulse"
          />
        ))}
      </div>
    );
  }

  const stats = dashboard?.stats || {};

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Active Cases"
        value={stats.activeCases ?? 0}
        color="bg-blue-600"
        icon={FolderOpen}
      />

    <StatCard
  title="Verified Evidence"
  value={stats.verifiedEvidence ?? 0}
  color="bg-cyan-600"
  icon={Activity}
/>

<StatCard
  title="Critical Anomalies"
  value={stats.criticalAnomalies ?? 0}
  color="bg-red-600"
  icon={AlertTriangle}
/>

      <StatCard
        title="Evidence Files"
        value={stats.totalEvidence ?? 0}
        color="bg-indigo-600"
        icon={FileSearch}
      />
    </div>
  );
};

export default StatsGrid;