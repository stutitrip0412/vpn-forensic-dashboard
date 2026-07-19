import AnomalyCard from "./AnomalyCard";
import EmptyAnalysis from "./EmptyAnalysis";

const AnomalyList = ({
  anomalies = [],
  loading = false,
  onAnalyze,
}) => {
  if (!loading && anomalies.length === 0) {
    return (
      <EmptyAnalysis
        onAnalyze={onAnalyze}
        loading={loading}
      />
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <div>

          <h2 className="text-2xl font-bold">

            Detected Anomalies

          </h2>

          <p className="text-slate-400 mt-1">

            {anomalies.length} anomal
            {anomalies.length === 1 ? "y" : "ies"} detected during
            forensic analysis.

          </p>

        </div>

      </div>

      {/* Cards */}

      <div className="grid gap-6">

        {anomalies.map((anomaly) => (

          <AnomalyCard
            key={anomaly._id}
            anomaly={anomaly}
          />

        ))}

      </div>

    </div>
  );
};

export default AnomalyList;