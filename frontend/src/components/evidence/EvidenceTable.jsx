import EvidenceRow from "./EvidenceRow";

const EvidenceTable = ({ evidence }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-900 border-b border-slate-800">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Filename
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Source
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Size
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Uploaded
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {evidence.map((item) => (
              <EvidenceRow
                key={item._id}
                evidence={item}
              />
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default EvidenceTable;