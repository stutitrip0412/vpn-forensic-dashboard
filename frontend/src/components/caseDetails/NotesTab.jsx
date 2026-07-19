import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  fetchCaseNotes,
  createCaseNote,
} from "../../services/note.service";

import NoteEditor from "./NoteEditor";
import NoteCard from "./NoteCard";

const NotesTab = () => {
  const { id } = useParams();

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadNotes();
  }, [id]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchCaseNotes(id);

      setNotes(data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        "Unable to load investigation notes."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (content) => {
    if (!content.trim()) return;

    try {
      setSaving(true);

      await createCaseNote(id, content);

      await loadNotes();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.error ||
        "Unable to save note."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h2 className="text-2xl font-bold">
          Investigator Notes
        </h2>

        <p className="text-slate-400 mt-2">
          Record findings, observations and forensic conclusions for this investigation.
        </p>

      </div>

      {/* Editor */}

      <NoteEditor
        onSave={handleSave}
        saving={saving}
      />

      {/* Error */}

      {error && (
        <div className="bg-red-950/20 border border-red-700 rounded-xl p-5">
          <p className="text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* Loading */}

      {loading ? (
        <div className="flex justify-center py-20">

          <div className="text-center">

            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

            <p className="text-slate-400">
              Loading investigation notes...
            </p>

          </div>

        </div>
      ) : notes.length === 0 ? (

        <div className="border border-dashed border-slate-700 rounded-2xl py-20 text-center">

          <h3 className="text-xl font-semibold">
            No Notes Yet
          </h3>

          <p className="text-slate-400 mt-2">
            Create the first investigation note.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {notes.map((note) => (

            <NoteCard
              key={note._id}
              note={note}
            />

          ))}

        </div>

      )}

    </div>
  );
};

export default NotesTab;