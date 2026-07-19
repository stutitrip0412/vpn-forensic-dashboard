const severityConfig = {
  CRITICAL: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/40",
    label: "Critical",
  },
  HIGH: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/40",
    label: "High",
  },
  MEDIUM: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/40",
    label: "Medium",
  },
  LOW: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    border: "border-green-500/40",
    label: "Low",
  },
};

const SeverityBadge = ({ severity = "LOW" }) => {
  const config =
    severityConfig[severity?.toUpperCase()] ||
    severityConfig.LOW;

  return (
    <span
      className={`
        inline-flex
        items-center
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
        uppercase
        tracking-wide
        border
        ${config.bg}
        ${config.text}
        ${config.border}
      `}
    >
      {config.label}
    </span>
  );
};

export default SeverityBadge;