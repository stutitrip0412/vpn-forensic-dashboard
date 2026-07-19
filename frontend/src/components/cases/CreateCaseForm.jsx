import { useState } from "react";
import { createCase } from "../../services/case.service";

const CreateCaseForm = ({
  onClose,
  onCreated,
}) => {

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

      await createCase({
        name,
        description,
      });

      onCreated();

      onClose();

    } catch (err) {

      setError(

        err.response?.data?.error ||

        "Unable to create case."

      );

    }

    setLoading(false);

  };

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      <div>

        <label className="block mb-2">

          Case Name

        </label>

        <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
          placeholder="Enter investigation name"
          required
        />

      </div>

      <div>

        <label className="block mb-2">

          Description

        </label>

        <textarea
          rows={5}
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
          placeholder="Describe the investigation..."
        />

      </div>

      {error && (

        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-400">

          {error}

        </div>

      )}

      <div className="flex justify-end gap-4">

        <button
          type="button"
          onClick={onClose}
          className="px-5 py-3 rounded-xl border border-slate-700"
        >

          Cancel

        </button>

        <button
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
        >

          {loading
            ? "Creating..."
            : "Create Case"}

        </button>

      </div>

    </form>

  );

};

export default CreateCaseForm;