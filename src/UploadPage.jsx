import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "./lib/authFetch";

function UploadPage() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("Microsoft Teams");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleUpload() {
    if (!file) {
      setError("Please select a transcript file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const meetingTitle = title.trim() || file.name;

      const response = await authFetch(
        `${API_URL}/ingest-file?title=${encodeURIComponent(meetingTitle)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed.");
      }

      navigate("/chat");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile || null);
  }

  return (
    <div className="min-h-full bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">
              Upload Transcript
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Add a meeting transcript and turn it into searchable team knowledge.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="text-3xl leading-none text-gray-500 hover:text-slate-950"
            aria-label="Close upload page"
          >
            ×
          </button>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <label
            htmlFor="file-upload"
            className="mb-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 px-6 py-16 text-center transition hover:border-slate-950"
          >
            <div className="mb-5 text-5xl text-gray-400">⇧</div>

            <p className="text-lg text-slate-700">
              Drag and drop your transcript file here, or{" "}
              <span className="font-medium underline">browse</span>
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Supported formats: TXT, DOCX, PDF, VTT
            </p>

            {file && (
              <p className="mt-4 rounded-full bg-gray-100 px-4 py-2 text-sm text-slate-700">
                Selected: {file.name}
              </p>
            )}

            <input
              id="file-upload"
              type="file"
              accept=".txt,.docx,.pdf,.vtt"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Meeting Title
              </label>
              <input
                type="text"
                placeholder="Example: Sprint Planning Meeting"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-sm text-slate-800 outline-none transition focus:border-slate-950"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-sm text-slate-800 outline-none transition focus:border-slate-950"
              >
                <option>Microsoft Teams</option>
                <option>Zoom</option>
                <option>Google Meet</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="mt-8 w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Processing transcript..." : "Upload & Process"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;