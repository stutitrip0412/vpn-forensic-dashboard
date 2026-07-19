import { useContext } from "react";

import { DashboardContext } from "../../context/DashboardContext";

const RecentActivity = () => {
  const { dashboard, loading } = useContext(DashboardContext);

  if (loading)
    return (
      <div className="min-h-[380px] rounded-2xl bg-[#111827] animate-pulse" />
    );

  const activity = dashboard?.activity || [];

  return (
    <div className="bg-[#111827] rounded-2xl border border-slate-800 p-6">
      <h2 className="text-xl font-semibold mb-5">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activity.length === 0 ? (
          <p className="text-slate-400">
            No recent activity found.
          </p>
        ) : (
          activity.map((item) => (
            <div
              key={item._id}
              className="flex items-start gap-3 border-b border-slate-800 pb-4"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />

              <div>
                <p className="text-white">
                  {item.message}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {item.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;