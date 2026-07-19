import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  fetchEvidence,
} from "../../services/evidence.service";

import EvidenceCard from "./EvidenceCard";

const EvidenceTab = () => {
  const { id } = useParams();

  const [evidence, setEvidence] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadEvidence();
  }, [id]);

  const loadEvidence = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchEvidence(id);

      setEvidence(data);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        "Unable to load evidence."
      );

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-72">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-5" />

          <p className="text-slate-400">

            Loading evidence repository...

          </p>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-700 bg-red-950/20 p-6">

        <h2 className="text-xl font-semibold text-red-400 mb-3">

          Unable to load evidence

        </h2>

        <p className="text-slate-300">

          {error}

        </p>

      </div>
    );
  }

  if (evidence.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 py-24">

        <div className="text-center">

          <h2 className="text-2xl font-semibold mb-3">

            No Evidence Available

          </h2>

          <p className="text-slate-400">

            Upload VPN logs to begin the investigation.

          </p>

        </div>

      </div>
    );
  }

  return (

    <div>

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-2xl font-bold">

            Evidence Repository

          </h2>

          <p className="text-slate-400 mt-2">

            Digital evidence associated with this investigation.

          </p>

        </div>

        <div className="bg-cyan-600 px-5 py-2 rounded-xl font-semibold">

          {evidence.length} Files

        </div>

      </div>

      <div className="grid gap-6">

        {evidence.map((item) => (

          <EvidenceCard
            key={item._id}
            evidence={item}
            onRefresh={loadEvidence}
          />

        ))}

      </div>

    </div>

  );
};

export default EvidenceTab;