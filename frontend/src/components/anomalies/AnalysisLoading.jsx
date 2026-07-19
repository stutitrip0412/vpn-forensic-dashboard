import {
  Loader2,
  ScanSearch,
} from "lucide-react";

const analysisSteps = [
  "Loading VPN log entries...",
  "Parsing authentication sessions...",
  "Detecting impossible travel...",
  "Checking brute-force login attempts...",
  "Analyzing after-hours access...",
  "Calculating anomaly risk scores...",
  "Generating forensic report...",
];

const AnalysisLoading = () => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-10">

      <div className="flex flex-col items-center">

        {/* Animated Icon */}

        <div className="relative mb-8">

          <div className="w-24 h-24 rounded-full bg-cyan-600/20 flex items-center justify-center">

            <ScanSearch
              size={42}
              className="text-cyan-400"
            />

          </div>

          <Loader2
            size={30}
            className="absolute -bottom-2 -right-2 animate-spin text-cyan-400"
          />

        </div>

        {/* Title */}

        <h2 className="text-3xl font-bold mb-3">

          Running Forensic Analysis

        </h2>

        <p className="text-slate-400 text-center max-w-2xl mb-10">

          The analysis engine is examining uploaded VPN logs,
          identifying suspicious behaviour, correlating events,
          and generating investigation findings.

        </p>

      </div>

      {/* Analysis Steps */}

      <div className="max-w-3xl mx-auto space-y-4">

        {analysisSteps.map((step, index) => (

          <div
            key={index}
            className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4"
          >

            <Loader2
              size={18}
              className="animate-spin text-cyan-400"
            />

            <span className="text-slate-300">

              {step}

            </span>

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="mt-10 text-center">

        <p className="text-sm text-slate-500">

          Depending on the number of uploaded log records,
          this may take a few seconds.

        </p>

      </div>

    </div>
  );
};

export default AnalysisLoading;