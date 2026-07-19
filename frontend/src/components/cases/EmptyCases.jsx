import { FolderOpen } from "lucide-react";

const EmptyCases = () => {

  return (

    <div
      className="
      border
      border-dashed
      border-slate-700
      rounded-2xl
      py-24
      text-center
      "
    >

      <FolderOpen
        size={60}
        className="mx-auto text-slate-500"
      />

      <h2 className="mt-5 text-xl">

        No Investigation Cases Found

      </h2>

      <p className="text-slate-500 mt-2">

        Create your first forensic investigation.

      </p>

    </div>

  );

};

export default EmptyCases;