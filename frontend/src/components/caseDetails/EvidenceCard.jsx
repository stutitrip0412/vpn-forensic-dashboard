import {
  FileText,
  ShieldCheck,
  Download,
  History,
  User,
  CalendarDays,
  Fingerprint,
} from "lucide-react";

import {
  verifyEvidence,
  downloadEvidence,
  getEvidenceCustody,
} from "../../services/evidence.service";

const StatusBadge = ({ status }) => {
  const styles = {
    parsed:
      "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    pending:
      "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    failed:
      "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full border text-sm font-medium ${
        styles[status?.toLowerCase()] || styles.pending
      }`}
    >
      {status || "Pending"}
    </span>
  );
};

const SourceBadge = ({ source }) => {
  return (
    <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm">
      {source || "Unknown"}
    </span>
  );
};

const EvidenceCard = ({ evidence }) => {
  const handleVerify = async () => {
    try {
      const result = await verifyEvidence(evidence._id);

      alert(
        result.match
          ? "✅ Evidence integrity verified.\n\nSHA-256 hash matches."
          : "❌ Hash mismatch detected!"
      );
    } catch (err) {
      console.error(err);

      alert("Verification failed.");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await downloadEvidence(evidence._id);

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.download =
        evidence.originalFilename || "evidence.log";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);

      alert("Unable to download evidence.");
    }
  };

  const handleCustody = async () => {
    try {
      const response = await getEvidenceCustody(evidence._id);

      console.log(response);

      alert(
        "Chain of custody loaded.\n\n(We'll replace this alert with a professional timeline modal in the next phase.)"
      );

    } catch (err) {
      console.error(err);

      alert("Unable to fetch custody history.");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-xl bg-cyan-600/20 flex items-center justify-center">

            <FileText
              className="text-cyan-400"
              size={26}
            />

          </div>

          <div>

            <h3 className="text-xl font-semibold">

              {evidence.originalFilename}

            </h3>

            <p className="text-slate-400 text-sm mt-1">

              Digital Evidence File

            </p>

          </div>

        </div>

        <StatusBadge
          status={evidence.parseStatus}
        />

      </div>

      {/* Information */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <div>

          <div className="flex items-center gap-2 text-slate-400 mb-2">

            <Fingerprint size={16} />

            SHA-256 Hash

          </div>

          <div className="bg-[#111827] rounded-lg border border-slate-800 p-3 break-all text-xs font-mono">

            {evidence.sha256Hash}

          </div>

        </div>

        <div className="space-y-4">

          <div className="flex justify-between">

            <span className="text-slate-400">

              Source

            </span>

            <SourceBadge
              source={evidence.sourceType}
            />

          </div>

          <div className="flex justify-between">

            <span className="text-slate-400">

              Uploaded By

            </span>

            <span className="flex items-center gap-2">

              <User size={15} />

              {evidence.uploadedBy?.username || "--"}

            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-400">

              Uploaded

            </span>

            <span className="flex items-center gap-2">

              <CalendarDays size={15} />

              {new Date(
                evidence.createdAt
              ).toLocaleString()}
            </span>

          </div>

        </div>

      </div>

      {/* Buttons */}

      <div className="flex flex-wrap gap-3 mt-8">

        <button
          onClick={handleVerify}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition"
        >
          <ShieldCheck size={18} />

          Verify Integrity
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 transition"
        >
          <Download size={18} />

          Download
        </button>

        <button
          onClick={handleCustody}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
        >
          <History size={18} />

          Chain of Custody
        </button>

      </div>

    </div>
  );
};

export default EvidenceCard;