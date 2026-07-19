const LoadingRow = () => (
  <tr className="border-b border-slate-800">

    <td className="px-6 py-5">

      <div className="flex items-center gap-4">

        <div className="w-10 h-10 rounded-xl bg-slate-800 animate-pulse" />

        <div className="space-y-2">

          <div className="w-48 h-4 rounded bg-slate-800 animate-pulse" />

          <div className="w-32 h-3 rounded bg-slate-800 animate-pulse" />

        </div>

      </div>

    </td>

    <td className="px-6 py-5">

      <div className="w-24 h-8 rounded-full bg-slate-800 animate-pulse" />

    </td>

    <td className="px-6 py-5">

      <div className="w-24 h-8 rounded-full bg-slate-800 animate-pulse" />

    </td>

    <td className="px-6 py-5">

      <div className="w-20 h-4 rounded bg-slate-800 animate-pulse" />

    </td>

    <td className="px-6 py-5">

      <div className="w-32 h-4 rounded bg-slate-800 animate-pulse" />

    </td>

    <td className="px-6 py-5">

      <div className="flex justify-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-slate-800 animate-pulse" />

        <div className="w-10 h-10 rounded-xl bg-slate-800 animate-pulse" />

        <div className="w-10 h-10 rounded-xl bg-slate-800 animate-pulse" />

      </div>

    </td>

  </tr>
);

const LoadingTable = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">

      <table className="min-w-full">

        <thead className="bg-slate-900 border-b border-slate-800">

          <tr>

            <th className="px-6 py-4 text-left">
              Filename
            </th>

            <th className="px-6 py-4 text-left">
              Source
            </th>

            <th className="px-6 py-4 text-left">
              Status
            </th>

            <th className="px-6 py-4 text-left">
              Size
            </th>

            <th className="px-6 py-4 text-left">
              Uploaded
            </th>

            <th className="px-6 py-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {[1, 2, 3, 4, 5].map((item) => (
            <LoadingRow key={item} />
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default LoadingTable;