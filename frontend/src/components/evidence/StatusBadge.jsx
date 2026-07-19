const statusConfig = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  },

  processing: {
    label: "Processing",
    className:
      "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  },

  completed: {
    label: "Completed",
    className:
      "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  },

  parsed: {
    label: "Parsed",
    className:
      "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  },

  failed: {
    label: "Failed",
    className:
      "bg-red-500/15 text-red-400 border border-red-500/30",
  },
};

const StatusBadge = ({ status }) => {
  const badge =
    statusConfig[status?.toLowerCase()] || {
      label: status || "Unknown",
      className:
        "bg-slate-500/15 text-slate-300 border border-slate-500/30",
    };

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

export default StatusBadge;