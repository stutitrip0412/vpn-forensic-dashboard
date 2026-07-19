import { FolderSearch } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyEvidence = () => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-16">

      <div className="flex flex-col items-center text-center">

        <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center">

          <FolderSearch
            size={48}
            className="text-cyan-400"
          />

        </div>

        <h2 className="mt-8 text-2xl font-semibold">

          No Evidence Uploaded

        </h2>

        <p className="mt-4 text-slate-400 max-w-md">

          Upload VPN log files to begin your forensic
          investigation. Uploaded evidence will appear
          here with integrity verification and chain of
          custody information.

        </p>

        <Link
          to="/upload"
          className="
            mt-8
            px-6
            py-3
            rounded-xl
            bg-cyan-600
            hover:bg-cyan-700
            transition
            font-medium
          "
        >
          Upload Evidence
        </Link>

      </div>

    </div>
  );
};

export default EmptyEvidence;