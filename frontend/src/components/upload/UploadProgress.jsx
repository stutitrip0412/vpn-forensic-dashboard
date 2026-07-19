const UploadProgress = ({ progress }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">

      <h2 className="text-xl font-semibold mb-4">
        Uploading Evidence...
      </h2>

      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">

        <div
          style={{ width: `${progress}%` }}
          className="bg-cyan-500 h-full transition-all duration-300"
        />

      </div>

      <div className="mt-4 flex justify-between">

        <span>{progress}%</span>

        <span className="text-cyan-400">
          Processing...
        </span>

      </div>

      <p className="mt-4 text-slate-400">
        Please wait while the VPN log is uploaded,
        hashed and analyzed.
      </p>

    </div>
  );
};

export default UploadProgress;