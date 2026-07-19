import { ArrowLeft, CalendarDays, User, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusColors = {
  open: "bg-emerald-500",
  closed: "bg-red-500",
  archived: "bg-slate-500",
  investigating: "bg-cyan-500",
};

const CaseHeader = ({ caseData }) => {
  const navigate = useNavigate();

  const status =
    caseData?.status?.toLowerCase() || "open";

  const createdDate = caseData?.createdAt
    ? new Date(caseData.createdAt).toLocaleDateString()
    : "--";

  const updatedDate = caseData?.updatedAt
    ? new Date(caseData.updatedAt).toLocaleDateString()
    : "--";

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-8">

      {/* Top Row */}

      <div className="flex items-center justify-between">

        <button
          onClick={() => navigate("/cases")}
          className="
            flex
            items-center
            gap-2
            text-slate-400
            hover:text-cyan-400
            transition
          "
        >
          <ArrowLeft size={18} />
          Back to Cases
        </button>

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            bg-slate-900
            px-4
            py-2
            border
            border-slate-700
          "
        >
          <Circle
            size={10}
            fill="currentColor"
            className={statusColors[status]}
          />

          <span className="capitalize font-medium">
            {caseData?.status || "Open"}
          </span>
        </div>

      </div>

      {/* Case Title */}

      <div className="mt-8">

        <h1 className="text-3xl font-bold text-white">

          {caseData?.name || "Untitled Investigation"}

        </h1>

        <p className="text-slate-400 mt-3 leading-7">

          {caseData?.description ||
            "No description provided."}

        </p>

      </div>

      {/* Information Row */}

      <div className="grid grid-cols-3 gap-6 mt-10">

        <div
          className="
            rounded-xl
            bg-slate-900
            border
            border-slate-800
            p-5
          "
        >
          <div className="flex items-center gap-2 text-cyan-400 mb-3">

            <User size={18} />

            <span className="font-medium">
              Created By
            </span>

          </div>

          <p className="text-lg font-semibold">

            {caseData?.createdBy?.username || "--"}

          </p>

        </div>

        <div
          className="
            rounded-xl
            bg-slate-900
            border
            border-slate-800
            p-5
          "
        >
          <div className="flex items-center gap-2 text-cyan-400 mb-3">

            <CalendarDays size={18} />

            <span className="font-medium">
              Created
            </span>

          </div>

          <p className="text-lg font-semibold">

            {createdDate}

          </p>

        </div>

        <div
          className="
            rounded-xl
            bg-slate-900
            border
            border-slate-800
            p-5
          "
        >
          <div className="flex items-center gap-2 text-cyan-400 mb-3">

            <CalendarDays size={18} />

            <span className="font-medium">
              Updated
            </span>

          </div>

          <p className="text-lg font-semibold">

            {updatedDate}

          </p>

        </div>

      </div>

    </div>
  );
};

export default CaseHeader;