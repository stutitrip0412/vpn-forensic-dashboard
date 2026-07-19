import {
  ScanSearch,
  Play,
} from "lucide-react";

const EmptyAnalysis = ({
  onAnalyze,
  loading,
}) => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12">

      <div className="flex flex-col items-center text-center">

        {/* Icon */}

        <div className="w-28 h-28 rounded-full bg-cyan-600/15 flex items-center justify-center mb-8">

          <ScanSearch
            size={52}
            className="text-cyan-400"
          />

        </div>

        {/* Heading */}

        <h2 className="text-3xl font-bold mb-4">

          No Analysis Results Available

        </h2>

        <p className="text-slate-400 max-w-2xl leading-8 mb-10">

          This investigation has not been analyzed yet.
          Start the forensic analysis engine to detect
          suspicious VPN activity, impossible travel,
          brute-force attacks, after-hours access,
          and other security anomalies.

        </p>

        {/* Features */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-5xl mb-10">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

            <div className="text-3xl mb-3">
              🌍
            </div>

            <h3 className="font-semibold mb-2">

              Impossible Travel

            </h3>

            <p className="text-sm text-slate-400">

              Detect impossible login locations.

            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

            <div className="text-3xl mb-3">
              🔐
            </div>

            <h3 className="font-semibold mb-2">

              Brute Force

            </h3>

            <p className="text-sm text-slate-400">

              Identify repeated authentication failures.

            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

            <div className="text-3xl mb-3">
              🌙
            </div>

            <h3 className="font-semibold mb-2">

              After-Hours Access

            </h3>

            <p className="text-sm text-slate-400">

              Detect VPN access outside business hours.

            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

            <div className="text-3xl mb-3">
              🚨
            </div>

            <h3 className="font-semibold mb-2">

              Risk Assessment

            </h3>

            <p className="text-sm text-slate-400">

              Assign severity and investigation priority.

            </p>

          </div>

        </div>

        {/* Button */}

        <button
          onClick={onAnalyze}
          disabled={loading}
          className="
            flex
            items-center
            gap-3
            px-8
            py-4
            rounded-xl
            bg-cyan-600
            hover:bg-cyan-500
            transition
            disabled:opacity-50
          "
        >

          <Play size={20} />

          {loading
            ? "Starting Analysis..."
            : "Start Investigation Analysis"}

        </button>

      </div>

    </div>
  );
};

export default EmptyAnalysis;