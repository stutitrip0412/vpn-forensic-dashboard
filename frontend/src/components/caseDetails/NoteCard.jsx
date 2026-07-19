import {
  User,
  CalendarDays,
  FileText,
  Shield,
} from "lucide-react";

const NoteCard = ({ note }) => {
  const author =
    note.authorId?.username ||
    "Unknown Investigator";

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition">

      {/* Header */}

      <div className="flex justify-between items-start flex-wrap gap-4">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-full bg-cyan-600/20 flex items-center justify-center">

            <User
              size={22}
              className="text-cyan-400"
            />

          </div>

          <div>

            <h3 className="font-semibold text-lg">

              {author}

            </h3>

            <div className="flex items-center gap-2 mt-1">

              <Shield
                size={14}
                className="text-cyan-400"
              />

              <span className="text-xs text-cyan-400 uppercase">

                {note.targetType}

              </span>

            </div>

          </div>

        </div>

        <div className="flex items-center gap-2 text-slate-400 text-sm">

          <CalendarDays
            size={15}
            className="text-cyan-400"
          />

          {new Date(
            note.createdAt
          ).toLocaleString()}

        </div>

      </div>

      {/* Divider */}

      <div className="border-t border-slate-800 my-5" />

      {/* Note Body */}

      <div className="flex gap-4">

        <FileText
          size={20}
          className="text-cyan-400 mt-1 flex-shrink-0"
        />

        <div className="text-slate-300 whitespace-pre-wrap leading-7 break-words">

          {note.body}

        </div>

      </div>

    </div>
  );
};

export default NoteCard;