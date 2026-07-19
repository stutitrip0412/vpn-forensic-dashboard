import { Search, Filter } from "lucide-react";

const EvidenceToolbar = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sourceFilter,
  setSourceFilter,
}) => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">

      <div className="flex flex-col lg:flex-row gap-5 items-center justify-between">

        {/* Search */}

        <div className="relative w-full lg:w-96">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search evidence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              py-3
              pl-11
              pr-4
              outline-none
              focus:border-cyan-500
              transition
            "
          />

        </div>

        {/* Filters */}

        <div className="flex flex-wrap gap-4">

          {/* Status */}

          <div className="relative">

            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="
                bg-slate-900
                border
                border-slate-700
                rounded-xl
                pl-9
                pr-8
                py-3
                appearance-none
                outline-none
                focus:border-cyan-500
              "
            >
              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="processing">
                Processing
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="failed">
                Failed
              </option>

            </select>

          </div>

          {/* Source */}

          <select
            value={sourceFilter}
            onChange={(e) =>
              setSourceFilter(e.target.value)
            }
            className="
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-cyan-500
            "
          >
            <option value="all">
              All Sources
            </option>

            <option value="openvpn">
              OpenVPN
            </option>

            <option value="wireguard">
              WireGuard
            </option>

            <option value="syslog">
              Syslog
            </option>

          </select>

        </div>

      </div>

    </div>
  );
};

export default EvidenceToolbar;