import { Play, Loader2, ShieldAlert } from "lucide-react";

const AnalysisHeader = ({
  onAnalyze,
  loading,
  totalAnomalies = 0,
}) => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8">

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

        {/* Left */}

        <div>

          <div className="flex items-center gap-3 mb-3">

            <ShieldAlert
              size={28}
              className="text-red-400"
            />

            <h1 className="text-3xl font-bold">
              VPN Anomaly Analysis
            </h1>

          </div>

          <p className="text-slate-400 leading-7 max-w-2xl">

            Run forensic analysis on uploaded VPN logs to detect
            suspicious activities such as impossible travel,
            brute-force attacks, after-hours access,
            and unusual login behaviour.

          </p>

        </div>

        {/* Right */}

        <div className="text-center">

          <div className="mb-4">

            <h3 className="text-4xl font-bold text-cyan-400">

              {totalAnomalies}

            </h3>

            <p className="text-slate-400">

              Total Anomalies

            </p>

          </div>

          <button
            onClick={onAnalyze}
            disabled={loading}
            className="
              flex
              items-center
              gap-3
              bg-cyan-600
              hover:bg-cyan-500
              px-6
              py-3
              rounded-xl
              transition
              disabled:opacity-50
            "
          >

            {loading ? (
              <Loader2
                size={20}
                className="animate-spin"
              />
            ) : (
              <Play size={20} />
            )}

            {loading
              ? "Analyzing..."
              : "Start Analysis"}

          </button>

        </div>

      </div>

      {/* Information Box */}

      <div className="mt-8 border border-cyan-800/40 bg-cyan-950/20 rounded-xl p-5">

        <h3 className="font-semibold text-cyan-400 mb-3">

          Analysis Engine

        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">

          <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">

            🌍 Impossible Travel

          </div>

          <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">

            🔐 Brute Force Detection

          </div>

          <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">

            🌙 After-Hours Access

          </div>

          <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">

            🚨 Suspicious Login Activity

          </div>

        </div>

      </div>

    </div>
  );
};

export default AnalysisHeader;