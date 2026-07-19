import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import UploadZone from "../../components/upload/UploadZone";
import UploadProgress from "../../components/upload/UploadProgress";

import { uploadVPNLog } from "../../services/upload.service";
import { fetchCases } from "../../services/case.service";
import { fetchEvidence } from "../../services/evidence.service";

const UploadPage = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState("");

  const [evidence, setEvidence] = useState([]);

  const [sourceType, setSourceType] = useState("openvpn");

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCases();
  }, []);

  useEffect(() => {
    if (selectedCase) {
      loadEvidence(selectedCase);
    }
  }, [selectedCase]);

  const loadCases = async () => {
    try {
      const data = await fetchCases();

      setCases(data);

      if (data.length > 0) {
        setSelectedCase(data[0]._id);
      }
    } catch (err) {
      console.error(err);

      toast.error("Unable to load investigation cases.");
    }
  };

  const loadEvidence = async (caseId) => {
    try {
      const data = await fetchEvidence(caseId);

      setEvidence(data.evidence || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (file) => {
    if (!selectedCase) {
      toast.error("Please select an investigation case.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setResult(null);
    setError("");

    try {
      const response = await uploadVPNLog(
        selectedCase,
        file,
        sourceType,
        (event) => {
          const percent = Math.round(
            (event.loaded * 100) / event.total
          );

          setProgress(percent);
        }
      );

      setResult(response);

      toast.success("Evidence uploaded successfully.");

      await loadEvidence(selectedCase);
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.error ||
        "Upload failed.";

      setError(message);

      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* Investigation Case */}

      <div className="bg-[#111827] rounded-2xl border border-slate-800 p-6">

        <h2 className="text-xl font-semibold mb-5">
          Investigation Case
        </h2>

        <select
          value={selectedCase}
          onChange={(e) => setSelectedCase(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3"
        >
          {cases.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {item.title ||
                item.caseName ||
                item.name ||
                item._id}
            </option>
          ))}
        </select>

      </div>

      {/* Source Type */}

      <div className="bg-[#111827] rounded-2xl border border-slate-800 p-6">

        <h2 className="text-xl font-semibold mb-5">
          Source Type
        </h2>

        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3"
        >
          <option value="openvpn">
            OpenVPN
          </option>

          <option value="wireguard">
            WireGuard
          </option>

          <option value="syslog">
            Syslog
          </option>
        </select>

      </div>

      {/* Upload */}

      <UploadZone
        onFile={handleUpload}
        uploading={uploading}
      />

      {/* Progress */}

      {uploading && (
        <UploadProgress progress={progress} />
      )}

      {/* Error */}

      {error && (
        <div className="rounded-2xl border border-red-700 bg-red-950/20 p-5">

          <p className="text-red-400">
            {error}
          </p>

        </div>
      )}

      {/* Success */}

      {result?.evidence && (
        <div className="rounded-2xl border border-green-700 bg-green-950/20 p-6">

          <h2 className="mb-6 text-2xl font-semibold text-green-400">
            Evidence Uploaded Successfully
          </h2>

          <div className="grid grid-cols-2 gap-6">

            <div>

              <p className="text-slate-400">
                Filename
              </p>

              <p className="font-semibold">
                {result.evidence.originalFilename}
              </p>

            </div>

            <div>

              <p className="text-slate-400">
                Parse Status
              </p>

              <span className="rounded-full bg-green-700 px-3 py-1 text-sm">

                {result.evidence.parseStatus}

              </span>

            </div>

            <div className="col-span-2">

              <p className="mb-2 text-slate-400">
                SHA-256 Hash
              </p>

              <div className="break-all rounded-lg bg-slate-900 p-3 font-mono text-xs">

                {result.evidence.sha256Hash}

              </div>

            </div>

            <div>

              <p className="text-slate-400">
                Parsed Records
              </p>

              <p className="text-xl font-bold text-cyan-400">

                {result.parseResult?.recordsParsed ??
                  result.parseResult?.records ??
                  "N/A"}

              </p>

            </div>

            <div>

              <p className="text-slate-400">
                Source Type
              </p>

              <p>
                {result.evidence.sourceType}
              </p>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default UploadPage;