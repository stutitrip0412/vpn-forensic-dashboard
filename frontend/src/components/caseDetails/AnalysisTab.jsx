import { useEffect, useState } from "react";

import {
  analyzeCase,
  fetchCaseAnomalies,
} from "../../services/anomaly.service";

import AnalysisHeader from "../anomalies/AnalysisHeader";
import AnalysisLoading from "../anomalies/AnalysisLoading";
import AnomalyStats from "../anomalies/AnomalyStats";
import AnomalyList from "../anomalies/AnomalyList";

const AnalysisTab = ({ caseId }) => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadAnomalies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const loadAnomalies = async () => {
    try {
      setLoading(true);

      const data = await fetchCaseAnomalies(caseId);

      setAnomalies(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);

      await analyzeCase(caseId);

      await loadAnomalies();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.error ||
          "Unable to analyze VPN logs."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">

      <AnalysisHeader
        loading={analyzing}
        onAnalyze={handleAnalyze}
        totalAnomalies={anomalies.length}
      />

      {loading || analyzing ? (
        <AnalysisLoading />
      ) : (
        <>
          {anomalies.length > 0 && (
            <AnomalyStats anomalies={anomalies} />
          )}

          <AnomalyList
            anomalies={anomalies}
            loading={analyzing}
            onAnalyze={handleAnalyze}
          />
        </>
      )}

    </div>
  );
};

export default AnalysisTab;