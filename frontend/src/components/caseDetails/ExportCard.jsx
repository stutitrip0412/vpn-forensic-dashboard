import { useParams } from "react-router-dom";
import {
  FileText,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";

import ExportButton from "./ExportButton";
import {
  exportCasePdf,
  exportCaseCsv,
} from "../../services/export.service";

const ExportCard = () => {
  const { id } = useParams();

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8">

      {/* Header */}

      <div className="mb-8">

        <h2 className="text-2xl font-bold">
          Export Investigation
        </h2>

        <p className="text-slate-400 mt-2">
          Generate professional investigation reports for legal review,
          evidence submission, or offline analysis.
        </p>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* PDF Export */}

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">

          <div className="flex items-center gap-3 mb-5">

            <FileText
              className="text-cyan-400"
              size={28}
            />

            <h3 className="text-xl font-semibold">
              PDF Investigation Report
            </h3>

          </div>

          <div className="space-y-3 mb-8">

            {[
              "Case Summary",
              "Evidence Inventory",
              "Investigator Notes",
              "Chain of Custody",
              "Audit Timeline",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <CheckCircle2
                  size={18}
                  className="text-green-400"
                />

                <span className="text-slate-300">
                  {item}
                </span>

              </div>
            ))}

          </div>

          <ExportButton
            label="Download PDF"
            icon={FileText}
            fileName={`case-${id}.pdf`}
            onExport={() => exportCasePdf(id)}
          />

        </div>

        {/* CSV Export */}

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">

          <div className="flex items-center gap-3 mb-5">

            <FileSpreadsheet
              className="text-green-400"
              size={28}
            />

            <h3 className="text-xl font-semibold">
              CSV Timeline Export
            </h3>

          </div>

          <div className="space-y-3 mb-8">

            {[
              "Timeline Events",
              "Audit Records",
              "Parsed VPN Logs",
              "Investigation History",
              "Evidence Actions",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <CheckCircle2
                  size={18}
                  className="text-green-400"
                />

                <span className="text-slate-300">
                  {item}
                </span>

              </div>
            ))}

          </div>

          <ExportButton
            label="Download CSV"
            icon={FileSpreadsheet}
            fileName={`case-${id}.csv`}
            onExport={() => exportCaseCsv(id)}
          />

        </div>

      </div>

      {/* Footer */}

      <div className="mt-8 rounded-xl border border-cyan-700/30 bg-cyan-950/20 p-5">

        <h4 className="text-cyan-400 font-semibold mb-2">
          Investigation Export
        </h4>

        <p className="text-slate-300 text-sm leading-7">
          Every export is automatically recorded in the audit log,
          preserving the chain of custody and maintaining forensic
          integrity for legal and compliance purposes.
        </p>

      </div>

    </div>
  );
};

export default ExportCard;