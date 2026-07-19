import { Eye, ShieldCheck, Download, FileText } from "lucide-react";

import StatusBadge from "./StatusBadge";
import SourceBadge from "./SourceBadge";

const formatFileSize = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`;

  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const formatDate = (date) => {
  if (!date) return "--";

  return new Date(date).toLocaleString();
};

const EvidenceRow = ({
  evidence,
  onView,
  onVerify,
  onDownload,
}) => {
  return (
    <tr className="border-b border-slate-800 hover:bg-slate-900/60 transition-colors">

      {/* Filename */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-4">

          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">

            <FileText
              size={20}
              className="text-cyan-400"
            />

          </div>

          <div>

            <h4 className="font-medium text-white">

              {evidence.originalFilename}

            </h4>

            <p className="text-xs text-slate-500">

              {evidence._id}

            </p>

          </div>

        </div>

      </td>

      {/* Source */}

      <td className="px-6 py-5">

        <SourceBadge
          source={evidence.sourceType}
        />

      </td>

      {/* Status */}

      <td className="px-6 py-5">

        <StatusBadge
          status={evidence.parseStatus}
        />

      </td>

      {/* File Size */}

      <td className="px-6 py-5 text-slate-300">

        {formatFileSize(
          evidence.fileSizeBytes
        )}

      </td>

      {/* Uploaded */}

      <td className="px-6 py-5 text-slate-400 text-sm">

        {formatDate(
          evidence.createdAt
        )}

      </td>

      {/* Actions */}

      <td className="px-6 py-5">

        <div className="flex justify-center gap-3">

          <button
            onClick={() =>
              onView?.(evidence)
            }
            className="
              h-10
              w-10
              rounded-xl
              bg-slate-800
              hover:bg-cyan-600
              transition
              flex
              items-center
              justify-center
            "
            title="View Evidence"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() =>
              onVerify?.(evidence)
            }
            className="
              h-10
              w-10
              rounded-xl
              bg-slate-800
              hover:bg-green-600
              transition
              flex
              items-center
              justify-center
            "
            title="Verify Integrity"
          >
            <ShieldCheck size={18} />
          </button>

          <button
            onClick={() =>
              onDownload?.(evidence)
            }
            className="
              h-10
              w-10
              rounded-xl
              bg-slate-800
              hover:bg-indigo-600
              transition
              flex
              items-center
              justify-center
            "
            title="Download Evidence"
          >
            <Download size={18} />
          </button>

        </div>

      </td>

    </tr>
  );
};

export default EvidenceRow;