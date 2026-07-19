import {
  User,
  Globe,
  Clock3,
  Activity,
} from "lucide-react";

const actionColors = {
  LOGIN_SUCCESS:
    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",

  LOGIN_FAILED:
    "bg-red-500/20 text-red-400 border-red-500/30",

  AUTH_SUCCESS:
    "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",

  AUTH_FAILURE:
    "bg-orange-500/20 text-orange-400 border-orange-500/30",

  CONNECTED:
    "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",

  DISCONNECTED:
    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const ActionBadge = ({ action }) => (
  <span
    className={`px-3 py-1 rounded-full border text-xs font-semibold ${
      actionColors[action] ||
      "bg-slate-700 text-slate-300 border-slate-600"
    }`}
  >
    {action || "UNKNOWN"}
  </span>
);

const LogsTable = ({ logs }) => {
  if (!logs.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 py-24 text-center">
        <Activity
          size={42}
          className="mx-auto text-slate-500 mb-4"
        />

        <h2 className="text-2xl font-semibold">
          No Parsed Logs Found
        </h2>

        <p className="text-slate-400 mt-3">
          Try changing the filters or upload a VPN log.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-900 border-b border-slate-800">

            <tr>

              <th className="text-left px-6 py-4">
                Timestamp
              </th>

              <th className="text-left px-6 py-4">
                User
              </th>

              <th className="text-left px-6 py-4">
                Source IP
              </th>

              <th className="text-left px-6 py-4">
                Destination IP
              </th>

              <th className="text-left px-6 py-4">
                Country
              </th>

              <th className="text-left px-6 py-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {logs.map((log) => (

              <tr
                key={log._id}
                className="border-b border-slate-800 hover:bg-slate-900 transition-colors"
              >

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <Clock3
                      size={15}
                      className="text-cyan-400"
                    />

                    <span className="text-sm">

                      {log.timestampUTC
                        ? new Date(
                            log.timestampUTC
                          ).toLocaleString()
                        : "--"}

                    </span>

                  </div>

                </td>

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <User
                      size={15}
                      className="text-cyan-400"
                    />

                    {log.user || "--"}

                  </div>

                </td>

                <td className="px-6 py-5 font-mono text-sm">

                  {log.sourceIp || "--"}

                </td>

                <td className="px-6 py-5 font-mono text-sm">

                  {log.destinationIp ||
                    log.destinationIP ||
                    "--"}

                </td>

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <Globe
                      size={15}
                      className="text-cyan-400"
                    />

                    {log.country || "--"}

                  </div>

                </td>

                <td className="px-6 py-5">

                  <ActionBadge
                    action={log.action}
                  />

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default LogsTable;