import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchCaseById } from "../../services/case.service";

import CaseHeader from "../../components/caseDetails/CaseHeader";
import CaseTabs from "../../components/caseDetails/CaseTabs";
import OverviewTab from "../../components/caseDetails/OverviewTab";
import EvidenceTab from "../../components/caseDetails/EvidenceTab";
import LogsTab from "../../components/caseDetails/LogsTab";
import NotesTab from "../../components/caseDetails/NotesTab";
import AuditTab from "../../components/caseDetails/AuditTab";
import ExportCard from "../../components/caseDetails/ExportCard";
import AnalysisTab from "../../components/caseDetails/AnalysisTab";

const CaseDetailsPage = () => {
  const { id } = useParams();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadCase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadCase = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchCaseById(id);

      setCaseData(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
          "Unable to load investigation case."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[75vh]">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-5" />

          <h2 className="text-xl font-semibold text-white">
            Loading Investigation...
          </h2>

          <p className="text-slate-400 mt-2">
            Fetching case information
          </p>

        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-700 bg-red-950/20 p-8">

        <h2 className="text-2xl font-semibold text-red-400">
          Failed to Load Case
        </h2>

        <p className="text-slate-300 mt-3">
          {error}
        </p>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      <CaseHeader caseData={caseData} />

      <CaseTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="bg-[#111827] rounded-2xl border border-slate-800 p-6 min-h-[500px]">

        {activeTab === "overview" && (
          <OverviewTab caseData={caseData} />
        )}

        {activeTab === "evidence" && (
          <EvidenceTab />
        )}

        {activeTab === "logs" && (
          <LogsTab />
        )}

        {activeTab === "notes" && (
          <NotesTab />
        )}

        {activeTab === "timeline" && (
          <AuditTab />
        )}

        {activeTab === "analysis" && (
          <AnalysisTab caseId={id} />
        )}

        {activeTab === "export" && (
          <ExportCard />
        )}

      </div>

    </div>
  );
};

export default CaseDetailsPage;