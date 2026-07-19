import {
  Search,
  RotateCcw,
  Filter,
} from "lucide-react";

const actions = [
  "",
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",
  "CONNECTED",
  "DISCONNECTED",
  "AUTH_SUCCESS",
  "AUTH_FAILURE",
];

const LogFilters = ({ filters, updateFilter }) => {
  const clearFilters = () => {
    updateFilter("user", "");
    updateFilter("sourceIp", "");
    updateFilter("action", "");
    updateFilter("from", "");
    updateFilter("to", "");
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">

      <div className="flex items-center gap-3 mb-6">

        <Filter
          size={20}
          className="text-cyan-400"
        />

        <h3 className="text-xl font-semibold">
          Log Filters
        </h3>

      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* Username */}

        <div>

          <label className="block text-sm text-slate-400 mb-2">
            Username
          </label>

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-3.5 text-slate-500"
            />

            <input
              type="text"
              value={filters.user}
              placeholder="Search user..."
              onChange={(e) =>
                updateFilter("user", e.target.value)
              }
              className="
                w-full
                bg-slate-900
                border
                border-slate-700
                rounded-xl
                py-3
                pl-10
                pr-4
                focus:border-cyan-500
                focus:outline-none
              "
            />

          </div>

        </div>

        {/* Source IP */}

        <div>

          <label className="block text-sm text-slate-400 mb-2">
            Source IP
          </label>

          <input
            type="text"
            value={filters.sourceIp}
            placeholder="192.168.x.x"
            onChange={(e) =>
              updateFilter("sourceIp", e.target.value)
            }
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              p-3
              focus:border-cyan-500
              focus:outline-none
            "
          />

        </div>

        {/* Action */}

        <div>

          <label className="block text-sm text-slate-400 mb-2">
            Action
          </label>

          <select
            value={filters.action}
            onChange={(e) =>
              updateFilter("action", e.target.value)
            }
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              p-3
              focus:border-cyan-500
              focus:outline-none
            "
          >
            <option value="">
              All Actions
            </option>

            {actions
              .filter((item) => item !== "")
              .map((action) => (
                <option
                  key={action}
                  value={action}
                >
                  {action}
                </option>
              ))}

          </select>

        </div>

        {/* From */}

        <div>

          <label className="block text-sm text-slate-400 mb-2">
            From Date
          </label>

          <input
            type="date"
            value={filters.from}
            onChange={(e) =>
              updateFilter("from", e.target.value)
            }
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              p-3
              focus:border-cyan-500
              focus:outline-none
            "
          />

        </div>

        {/* To */}

        <div>

          <label className="block text-sm text-slate-400 mb-2">
            To Date
          </label>

          <input
            type="date"
            value={filters.to}
            onChange={(e) =>
              updateFilter("to", e.target.value)
            }
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              p-3
              focus:border-cyan-500
              focus:outline-none
            "
          />

        </div>

        {/* Clear */}

        <div className="flex items-end">

          <button
            onClick={clearFilters}
            className="
              flex
              items-center
              justify-center
              gap-2
              w-full
              bg-slate-700
              hover:bg-slate-600
              rounded-xl
              p-3
              transition
            "
          >
            <RotateCcw size={18} />

            Clear Filters

          </button>

        </div>

      </div>

    </div>
  );
};

export default LogFilters;