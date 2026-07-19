import { useEffect, useState } from "react";

import EvidenceToolbar from "../components/evidence/EvidenceToolbar";
import EvidenceTable from "../components/evidence/EvidenceTable";
import EmptyEvidence from "../components/evidence/EmptyEvidence";
import LoadingTable from "../components/evidence/LoadingTable";

import { fetchCases } from "../services/case.service";
import { fetchEvidence } from "../services/evidence.service";

const EvidencePage = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState("");

  const [evidence, setEvidence] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  useEffect(() => {
    loadCases();
  }, []);

  useEffect(() => {
    if (selectedCase) {
      loadEvidence(selectedCase);
    }
  }, [selectedCase]);

  const loadCases = async () => {
    try {
      const data = await fetchCases();

      setCases(data);

      if (data.length > 0) {
        setSelectedCase(data[0]._id);
      }

    } catch (err) {
      console.error(err);
    }
  };

  const loadEvidence = async (caseId) => {
    try {
      setLoading(true);

      const response = await fetchEvidence(caseId);

      setEvidence(response.evidence || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvidence = evidence.filter((item) => {

    const filename =
      item.originalFilename?.toLowerCase() || "";

    const matchesSearch =
      filename.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      item.parseStatus === statusFilter;

    const matchesSource =
      sourceFilter === "all" ||
      item.sourceType === sourceFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesSource
    );
  });

  return (
    <div className="space-y-8">

      {/* Page Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Evidence Repository
          </h1>

          <p className="text-slate-400 mt-2">
            Browse, verify and manage uploaded forensic evidence.
          </p>

        </div>

        <div className="w-72">

          <select
            value={selectedCase}
            onChange={(e) =>
              setSelectedCase(e.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"
          >
            {cases.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.title ||
                  item.caseName ||
                  item.name ||
                  item._id}
              </option>
            ))}
          </select>

        </div>

      </div>

      <EvidenceToolbar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
      />

      {loading ? (
        <LoadingTable />
      ) : filteredEvidence.length === 0 ? (
        <EmptyEvidence />
      ) : (
        <EvidenceTable
          evidence={filteredEvidence}
        />
      )}

    </div>
  );
};

export default EvidencePage;