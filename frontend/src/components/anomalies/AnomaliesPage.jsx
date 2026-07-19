import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  analyzeCase,
  fetchCaseAnomalies,
} from "../../services/anomaly.service";

import AnalysisHeader from "../../components/anomalies/AnalysisHeader";
import AnalysisLoading from "../../components/anomalies/AnalysisLoading";
import AnomalyStats from "../../components/anomalies/AnomalyStats";
import AnomalyList from "../../components/anomalies/AnomalyList";

const AnomaliesPage = () => {
  const { id } = useParams();

  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadAnomalies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadAnomalies = async () => {
    try {
      const data = await fetchCaseAnomalies(id);
      setAnomalies(data);
    } catch (err) {
      console.error("Failed to load anomalies", err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setLoading(true);

      await analyzeCase(id);

      await loadAnomalies();
    } catch (err) {
      console.error("Analysis failed", err);

      alert(
        err.response?.data?.error ||
          "Unable to complete forensic analysis."
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="p-8">
        <AnalysisLoading />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <AnalysisHeader
        loading={loading}
        onAnalyze={handleAnalyze}
        totalAnomalies={anomalies.length}
      />

      {loading ? (
        <AnalysisLoading />
      ) : (
        <>
          {anomalies.length > 0 && (
            <AnomalyStats anomalies={anomalies} />
          )}

          <AnomalyList
            anomalies={anomalies}
            loading={loading}
            onAnalyze={handleAnalyze}
          />
        </>
      )}

    </div>
  );
};

export default AnomaliesPage;