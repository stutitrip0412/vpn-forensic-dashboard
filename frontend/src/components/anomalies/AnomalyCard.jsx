import {
  ShieldAlert,
  User,
  Globe,
  Clock3,
  MapPin,
  Server,
} from "lucide-react";

import SeverityBadge from "./SeverityBadge";

const icons = {
  impossible_travel: "🌍",
  brute_force: "🔐",
  after_hours: "🌙",
  suspicious_country: "🚩",
};

const labels = {
  impossible_travel: "Impossible Travel",
  brute_force: "Brute Force",
  after_hours: "After Hours Login",
  suspicious_country: "Suspicious Country",
};

const AnomalyCard = ({ anomaly }) => {
  const metadata = anomaly.metadata || {};

  const type =
    anomaly.type ||
    metadata.type ||
    "unknown";

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 hover:border-cyan-600 transition">

      {/* Header */}

      <div className="flex justify-between items-start gap-4">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-full bg-cyan-600/20 flex items-center justify-center text-2xl">

            {icons[type] || "🚨"}

          </div>

          <div>

            <h3 className="text-xl font-semibold">

              {labels[type] || anomaly.type}

            </h3>

            <p className="text-slate-400 text-sm mt-1">

              {anomaly.description || "Security anomaly detected"}

            </p>

          </div>

        </div>

        <SeverityBadge severity={anomaly.severity} />

      </div>

      {/* Details */}

      <div className="grid md:grid-cols-2 gap-5 mt-8">

        {(metadata.user || anomaly.user) && (
          <InfoRow
            icon={<User size={18} />}
            label="User"
            value={metadata.user || anomaly.user}
          />
        )}

        {(metadata.ip ||
          metadata.sourceIp ||
          anomaly.sourceIp) && (
          <InfoRow
            icon={<Server size={18} />}
            label="Source IP"
            value={
              metadata.ip ||
              metadata.sourceIp ||
              anomaly.sourceIp
            }
          />
        )}

        {(metadata.country ||
          metadata.location) && (
          <InfoRow
            icon={<Globe size={18} />}
            label="Country"
            value={
              metadata.country ||
              metadata.location
            }
          />
        )}

        {(metadata.fromCountry ||
          metadata.toCountry) && (
          <InfoRow
            icon={<MapPin size={18} />}
            label="Travel"
            value={`${metadata.fromCountry || "Unknown"} → ${
              metadata.toCountry || "Unknown"
            }`}
          />
        )}

        {anomaly.createdAt && (
          <InfoRow
            icon={<Clock3 size={18} />}
            label="Detected"
            value={new Date(
              anomaly.createdAt
            ).toLocaleString()}
          />
        )}

        {metadata.failedAttempts && (
          <InfoRow
            icon={<ShieldAlert size={18} />}
            label="Failed Attempts"
            value={metadata.failedAttempts}
          />
        )}

        {metadata.riskScore && (
          <InfoRow
            icon={<ShieldAlert size={18} />}
            label="Risk Score"
            value={`${metadata.riskScore}%`}
          />
        )}
      </div>

      {/* Raw Metadata */}

      {Object.keys(metadata).length > 0 && (
        <div className="mt-8 border-t border-slate-800 pt-5">

          <h4 className="text-sm font-semibold text-cyan-400 mb-3">

            Additional Information

          </h4>

          <pre className="bg-slate-900 rounded-xl p-4 overflow-auto text-xs text-slate-400">

{JSON.stringify(metadata, null, 2)}

          </pre>

        </div>
      )}

    </div>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}) => (
  <div className="flex gap-3 items-start">

    <div className="text-cyan-400 mt-1">

      {icon}

    </div>

    <div>

      <p className="text-xs uppercase text-slate-500">

        {label}

      </p>

      <p className="text-slate-200 break-all">

        {value}

      </p>

    </div>

  </div>
);

export default AnomalyCard;