import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchAuditTimeline } from "../../services/audit.service";
import AuditTimeline from "./AuditTimeline";

const AuditTab = () => {
  const { id } = useParams();

  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadTimeline();
  }, [id]);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchAuditTimeline(id);

      setEvents(data);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        "Unable to load investigation timeline."
      );

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-5" />

          <p className="text-slate-400">
            Loading audit timeline...
          </p>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/20 border border-red-700 rounded-2xl p-6">

        <h2 className="text-xl font-semibold text-red-400 mb-3">
          Unable to Load Timeline
        </h2>

        <p className="text-slate-300">
          {error}
        </p>

      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="border border-dashed border-slate-700 rounded-2xl py-24 text-center">

        <h2 className="text-2xl font-semibold">
          No Audit Events Found
        </h2>

        <p className="text-slate-400 mt-3">
          Audit records will appear here as investigators interact with
          the case and evidence.
        </p>

      </div>
    );
  }

  return (

    <div className="space-y-8">

      {/* Header */}

      <div>

        <h2 className="text-2xl font-bold">

          Investigation Timeline

        </h2>

        <p className="text-slate-400 mt-2">

          Complete chain of custody and audit history for this
          investigation.

        </p>

      </div>

      {/* Timeline */}

      <AuditTimeline events={events} />

    </div>

  );
};

export default AuditTab;