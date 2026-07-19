import CreateCaseForm from "./CreateCaseForm";

const CreateCaseModal = ({
  open,
  onClose,
  onCreated,
}) => {

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">

      <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-xl">

        <div className="flex justify-between items-center p-6 border-b border-slate-800">

          <h2 className="text-2xl font-bold">

            Create Investigation Case

          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl"
          >
            ✕
          </button>

        </div>

        <div className="p-6">

          <CreateCaseForm
            onCreated={onCreated}
            onClose={onClose}
          />

        </div>

      </div>

    </div>

  );

};

export default CreateCaseModal;