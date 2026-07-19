import { Plus } from "lucide-react";

const CasesHeader = ({onCreate}) => {

  return (

    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-bold">

          Investigation Cases

        </h1>

        <p className="text-slate-400 mt-2">

          Manage digital forensic investigations

        </p>

      </div>
<button
    onClick={onCreate}
    className="
        flex
        items-center
        gap-2
        px-5
        py-3
        rounded-xl
        bg-cyan-600
        hover:bg-cyan-700
    "
>
    <Plus size={18}/>
    New Case
</button>

    </div>

  );

};

export default CasesHeader;