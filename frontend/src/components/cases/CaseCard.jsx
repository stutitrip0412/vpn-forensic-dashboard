import {
  Calendar,
  FolderOpen,
  Shield,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CaseCard = ({ data }) => {

    const navigate = useNavigate();
  return (

    <div
      className="
      bg-[#111827]
      border
      border-slate-800
      rounded-2xl
      p-6
      hover:border-cyan-500
      transition
      "
    >

      <div className="flex justify-between">

        <div>

          <h2 className="text-xl font-semibold">

          {data.name ||
 data.title ||
 data.caseName ||
 "Untitled Case"}

          </h2>

          <p className="text-slate-400 mt-2">

            {data.description}

          </p>

        </div>

        <span
          className="
          px-3
          py-1
          rounded-full
          bg-cyan-600/20
          text-cyan-400
          h-fit
          "
        >

          {data.status || "Open"}

        </span>

      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">

        <div className="flex items-center gap-2">

          <FolderOpen size={18} />

          {data.priority || "Medium"}

        </div>

        <div className="flex items-center gap-2">

          <Shield size={18} />

          {data.assignedTo?.username || "Unassigned"}

        </div>

        <div className="flex items-center gap-2">

          <Calendar size={18} />

          {new Date(
            data.createdAt
          ).toLocaleDateString()}

        </div>

      </div>

     
<button
  onClick={() => navigate(`/cases/${data._id}`)}
  className="
    mt-6
    flex
    items-center
    gap-2
    text-cyan-400
    hover:text-cyan-300
  "
>
  View Case
</button>

    </div>

  );

};

export default CaseCard;