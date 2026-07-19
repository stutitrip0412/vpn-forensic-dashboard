import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const AnomalyStats = ({ anomalies = [] }) => {
  const stats = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };

  anomalies.forEach((anomaly) => {
    const severity = (anomaly.severity || "LOW").toUpperCase();

    if (stats[severity] !== undefined) {
      stats[severity]++;
    }
  });

  const cards = [
    {
      title: "Critical",
      value: stats.CRITICAL,
      icon: ShieldAlert,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
    },
    {
      title: "High",
      value: stats.HIGH,
      icon: AlertTriangle,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
    },
    {
      title: "Medium",
      value: stats.MEDIUM,
      icon: AlertCircle,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
    },
    {
      title: "Low",
      value: stats.LOW,
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">

      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`
              ${card.bg}
              ${card.border}
              border
              rounded-2xl
              p-6
            `}
          >
            <div className="flex justify-between items-center">

              <div>

                <p className="text-slate-400 text-sm">

                  {card.title}

                </p>

                <h2 className="text-4xl font-bold mt-2">

                  {card.value}

                </h2>

              </div>

              <div
                className={`
                  w-14
                  h-14
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  ${card.bg}
                `}
              >
                <Icon
                  size={28}
                  className={card.color}
                />
              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
};

export default AnomalyStats;