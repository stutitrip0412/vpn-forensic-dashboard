import { Search } from "lucide-react";

const CaseFilters = ({
  search,
  setSearch,
  status,
  setStatus,
}) => {

  return (

    <div className="grid md:grid-cols-2 gap-5">

      <div className="relative">

        <Search
          className="absolute left-4 top-3 text-slate-500"
          size={18}
        />

        <input
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search cases..."
          className="
          w-full
          rounded-xl
          border
          border-slate-700
          bg-slate-900
          pl-11
          pr-4
          py-3
          "
        />

      </div>

      <select
        value={status}
        onChange={(e)=>setStatus(e.target.value)}
        className="
        rounded-xl
        bg-slate-900
        border
        border-slate-700
        px-4
        "
      >

        <option>All</option>

        <option>Open</option>

        <option>In Progress</option>

        <option>Closed</option>

      </select>

    </div>

  );

};

export default CaseFilters;