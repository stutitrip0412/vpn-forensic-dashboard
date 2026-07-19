import {
  FolderOpen,
  Upload,
  ShieldCheck,
  Download,
  FileText,
  AlertTriangle,
  Activity,
  User,
  CalendarDays,
} from "lucide-react";

const iconMap = {
  CASE_CREATED: FolderOpen,
  CASE_UPDATED: FolderOpen,

  EVIDENCE_UPLOADED: Upload,

  EVIDENCE_VERIFIED: ShieldCheck,

  EVIDENCE_DOWNLOADED: Download,

  NOTE_CREATED: FileText,

  ANOMALY_DETECTED: AlertTriangle,

  ANALYSIS_COMPLETED: Activity,
};

const colorMap = {
  CASE_CREATED: "bg-cyan-600",
  CASE_UPDATED: "bg-cyan-600",

  EVIDENCE_UPLOADED: "bg-indigo-600",

  EVIDENCE_VERIFIED: "bg-emerald-600",

  EVIDENCE_DOWNLOADED: "bg-orange-600",

  NOTE_CREATED: "bg-purple-600",

  ANOMALY_DETECTED: "bg-red-600",

  ANALYSIS_COMPLETED: "bg-yellow-600",
};

const AuditEvent = ({ event }) => {
  const Icon =
    iconMap[event.action] || Activity;

  const color =
    colorMap[event.action] || "bg-slate-600";

  return (
    <div className="relative flex gap-6">

      {/* Timeline Dot */}

      <div
        className={`
          w-14
          h-14
          rounded-full
          flex
          items-center
          justify-center
          ${color}
          z-10
          shadow-lg
        `}
      >
        <Icon size={24} />
      </div>

      {/* Event Card */}

      <div className="flex-1 bg-[#111827] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition">

        <div className="flex justify-between items-start flex-wrap gap-4">

          <div>

            <h3 className="text-lg font-semibold">

              {(event.action || "UNKNOWN")
                .replaceAll("_", " ")}

            </h3>

            <p className="text-slate-400 mt-2">

              {event.metadata?.description ||
                "Investigation event"}

            </p>

          </div>

          <span className="px-3 py-1 rounded-full bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">

            {event.targetType || "Audit"}

          </span>

        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-6">

          <div className="flex items-center gap-2 text-slate-400">

            <User
              size={16}
              className="text-cyan-400"
            />

            <span>

              {event.actorUsername ||
                "System"}

            </span>

          </div>

          <div className="flex items-center gap-2 text-slate-400">

            <CalendarDays
              size={16}
              className="text-cyan-400"
            />

            <span>

              {new Date(
                event.createdAt
              ).toLocaleString()}

            </span>

          </div>

        </div>

        {/* Metadata */}

        {event.metadata &&
          Object.keys(event.metadata).length > 0 && (
            <div className="mt-6">

              <h4 className="text-sm text-slate-400 mb-3">

                Event Details

              </h4>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

                <pre className="text-xs text-slate-300 whitespace-pre-wrap break-words">

{JSON.stringify(
  event.metadata,
  null,
  2
)}

                </pre>

              </div>

            </div>
          )}

      </div>

    </div>
  );
};

export default AuditEvent;

