const sourceConfig = {
  openvpn: {
    label: "OpenVPN",
    className:
      "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
  },

  wireguard: {
    label: "WireGuard",
    className:
      "bg-violet-500/15 text-violet-400 border border-violet-500/30",
  },

  syslog: {
    label: "Syslog",
    className:
      "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  },

  unknown: {
    label: "Unknown",
    className:
      "bg-slate-500/15 text-slate-300 border border-slate-500/30",
  },
};

const SourceBadge = ({ source }) => {
  const badge =
    sourceConfig[source?.toLowerCase()] ||
    sourceConfig.unknown;

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${badge.className}
      `}
    >
      {badge.label}
    </span>
  );
};

export default SourceBadge;