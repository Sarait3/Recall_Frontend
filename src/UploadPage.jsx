import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadPage() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleUpload() {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(API_URL + "/ingest-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      await response.json();
      navigate("/chat");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-md">
        <div className="mb-4 text-4xl">📄</div>

        <h1 className="mb-2 text-xl font-semibold text-gray-900">
          Upload your document
        </h1>

        <p className="mb-5 text-sm leading-6 text-gray-500">
          Upload a file to train your RAG model. Supported format: TXT.
        </p>

        <input
          type="file"
          accept=".txt"
          className="mb-4 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-violet-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-violet-700 hover:file:bg-violet-200"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full rounded-xl bg-violet-500 px-4 py-2.5 text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}

export default UploadPage;