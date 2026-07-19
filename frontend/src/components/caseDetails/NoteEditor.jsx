import { useState } from "react";
import {
  FileEdit,
  Save,
  Eraser,
} from "lucide-react";

const MAX_LENGTH = 5000;

const NoteEditor = ({ onSave, saving }) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;

    onSave(content);

    setContent("");
  };

  const handleClear = () => {
    setContent("");
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">

      {/* Header */}

      <div className="flex items-center gap-3 mb-6">

        <FileEdit
          size={22}
          className="text-cyan-400"
        />

        <h3 className="text-xl font-semibold">
          Add Investigation Note
        </h3>

      </div>

      {/* Textarea */}

      <textarea
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
        rows={8}
        maxLength={MAX_LENGTH}
        placeholder="Record observations, findings, evidence verification, anomaly explanations, investigation progress, recommendations..."
        className="
          w-full
          bg-slate-900
          border
          border-slate-700
          rounded-xl
          p-5
          resize-none
          focus:outline-none
          focus:border-cyan-500
          text-slate-200
        "
      />

      {/* Footer */}

      <div className="flex flex-col md:flex-row justify-between items-center mt-5 gap-4">

        <div className="text-sm text-slate-400">

          {content.length} / {MAX_LENGTH} characters

        </div>

        <div className="flex gap-3">

          <button
            onClick={handleClear}
            disabled={!content}
            className="
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-xl
              bg-slate-700
              hover:bg-slate-600
              disabled:opacity-50
              transition
            "
          >
            <Eraser size={18} />

            Clear

          </button>

          <button
            onClick={handleSubmit}
            disabled={
              saving ||
              !content.trim()
            }
            className="
              flex
              items-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-cyan-600
              hover:bg-cyan-500
              disabled:opacity-50
              transition
            "
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Note"}

          </button>

        </div>

      </div>

    </div>
  );
};

export default NoteEditor;