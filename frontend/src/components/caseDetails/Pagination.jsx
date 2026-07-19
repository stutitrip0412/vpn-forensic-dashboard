import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Pagination = ({
  pagination,
  onPageChange,
}) => {
  const {
    page,
    totalPages,
    total,
    limit,
  } = pagination;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

        {/* Left Side */}

        <div>

          <h3 className="font-semibold text-lg">
            Log Navigation
          </h3>

          <p className="text-slate-400 text-sm mt-1">

            Showing page{" "}
            <span className="text-cyan-400 font-semibold">
              {page}
            </span>{" "}
            of{" "}
            <span className="text-cyan-400 font-semibold">
              {totalPages}
            </span>

          </p>

        </div>

        {/* Center */}

        <div className="flex items-center gap-4">

          <button
            disabled={page <= 1}
            onClick={() =>
              onPageChange(page - 1)
            }
            className={`
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-xl
              transition

              ${
                page <= 1
                  ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                  : "bg-slate-700 hover:bg-slate-600"
              }
            `}
          >
            <ChevronLeft size={18} />

            Previous

          </button>

          <div
            className="
              px-6
              py-3
              rounded-xl
              bg-cyan-600
              font-semibold
            "
          >
            {page}
          </div>

          <button
            disabled={page >= totalPages}
            onClick={() =>
              onPageChange(page + 1)
            }
            className={`
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-xl
              transition

              ${
                page >= totalPages
                  ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                  : "bg-slate-700 hover:bg-slate-600"
              }
            `}
          >
            Next

            <ChevronRight size={18} />

          </button>

        </div>

        {/* Right Side */}

        <div className="text-right">

          <h3 className="text-cyan-400 text-2xl font-bold">

            {total}

          </h3>

          <p className="text-slate-400 text-sm">

            Total Log Entries

          </p>

          <p className="text-xs text-slate-500 mt-1">

            {limit} entries per page

          </p>

        </div>

      </div>

    </div>
  );
};

export default Pagination;