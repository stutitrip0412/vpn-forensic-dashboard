import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchCaseLogs } from "../../services/log.service";

import LogFilters from "./LogFilters";
import LogsTable from "./LogsTable";
import Pagination from "./Pagination";

const LogsTab = () => {
  const { id } = useParams();

  const [logs, setLogs] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    page: 1,
    limit: 100,
    user: "",
    sourceIp: "",
    action: "",
    from: "",
    to: "",
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetchCaseLogs(id, filters);

      setLogs(response.entries || []);

      setPagination(
        response.pagination || {
          page: 1,
          limit: 100,
          total: 0,
          totalPages: 1,
        }
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
          "Unable to load parsed logs."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      [key]: value,
    }));
  };

  const changePage = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-72">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
          <p className="text-slate-400">
            Loading parsed VPN logs...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-700 bg-red-950/20 p-6">
        <h2 className="text-xl font-semibold text-red-400 mb-3">
          Failed to Load Logs
        </h2>

        <p className="text-slate-300">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Parsed VPN Logs
        </h2>

        <p className="text-slate-400 mt-2">
          Browse and investigate parsed VPN log entries.
        </p>

      </div>

      <LogFilters
        filters={filters}
        updateFilter={updateFilter}
      />

      <LogsTable logs={logs} />

      <Pagination
        pagination={pagination}
        onPageChange={changePage}
      />

    </div>
  );
};

export default LogsTab;