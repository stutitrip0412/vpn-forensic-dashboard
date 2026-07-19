import { useState } from "react";
import {
  Download,
  Loader2,
} from "lucide-react";

const ExportButton = ({
  label,
  icon: Icon = Download,
  onExport,
  fileName,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);

      const blob = await onExport();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.error ||
          "Unable to export report."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="
        w-full
        flex
        items-center
        justify-center
        gap-3
        bg-cyan-600
        hover:bg-cyan-500
        disabled:opacity-50
        transition
        rounded-xl
        py-3
        font-medium
      "
    >
      {loading ? (
        <Loader2
          size={18}
          className="animate-spin"
        />
      ) : (
        <Icon size={18} />
      )}

      {loading ? "Preparing..." : label}
    </button>
  );
};

export default ExportButton;