import { useState } from "react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";

const UploadZone = ({ onFile, uploading = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const allowedExtensions = [".log", ".txt"];

  const validateFile = (file) => {
    if (!file) return false;

    const extension =
      "." + file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return false;
    }

    return true;
  };

  const handleFile = (file) => {
    if (!validateFile(file)) {
      return;
    }

    setSelectedFile(file);

    onFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    if (uploading) return;

    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-[#111827] rounded-2xl border border-slate-800 p-8">

      <h2 className="text-2xl font-semibold mb-6">
        Upload VPN Evidence
      </h2>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!uploading) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        className={`transition-all duration-300 rounded-2xl border-2 border-dashed p-16 text-center
        ${
          dragActive
            ? "border-cyan-400 bg-cyan-500/10"
            : "border-slate-700 hover:border-cyan-500"
        }`}
      >
        <UploadCloud
          size={70}
          className="mx-auto text-cyan-400"
        />

        <h3 className="mt-6 text-xl font-semibold">
          Drag & Drop VPN Log
        </h3>

        <p className="mt-3 text-slate-400">
          Supported formats: .log & .txt
        </p>

        <input
          id="upload-file"
          type="file"
          disabled={uploading}
          accept=".log,.txt"
          className="hidden"
          onChange={(e) => {
            if (e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <label
          htmlFor="upload-file"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 transition cursor-pointer disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2
                className="animate-spin"
                size={18}
              />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud size={18} />
              Browse File
            </>
          )}
        </label>
      </div>

      {selectedFile && (
        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-5">

          <div className="flex items-center gap-3">

            <FileText className="text-cyan-400" />

            <div>

              <p className="font-medium">
                {selectedFile.name}
              </p>

              <p className="text-sm text-slate-400">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default UploadZone;