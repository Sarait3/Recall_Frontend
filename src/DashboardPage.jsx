import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "./lib/authFetch";

function DashboardPage() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [stats, setStats] = useState({
    meetings: 0,
    questions: 0,
  });

  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const statsResponse = await authFetch(`${API_URL}/dashboard-stats`);
      const statsData = await statsResponse.json();

      setStats({
        meetings: statsData.meetings,
        questions: statsData.questions,
      });

      const meetingsResponse = await authFetch(`${API_URL}/meetings`);
      const meetingsData = await meetingsResponse.json();

      setMeetings(meetingsData);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteMeeting(meetingId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transcript?"
    );

    if (!confirmed) return;

    try {
      const response = await authFetch(`${API_URL}/meetings/${meetingId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete transcript.");
      }

      setMeetings((prev) =>
        prev.filter((meeting) => meeting.id !== meetingId)
      );

      loadDashboard();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-950">
              Dashboard
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Your AI-powered meeting workspace
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center justify-center rounded-2xl border border-gray-300 bg-white px-6 py-4 text-sm font-medium text-slate-950 transition hover:bg-gray-50"
            >
              Ask all meetings
            </Link>

            <Link
              to="/upload"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-4 text-sm font-medium text-white transition hover:opacity-90"
            >
              Upload Transcript
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-7">
            <p className="text-sm text-gray-500">Meetings uploaded</p>

            <h2 className="mt-5 text-5xl font-semibold text-slate-950">
              {stats.meetings}
            </h2>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-7">
            <p className="text-sm text-gray-500">Questions asked</p>

            <h2 className="mt-5 text-5xl font-semibold text-slate-950">
              {stats.questions}
            </h2>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-8 py-6">
            <h2 className="text-2xl font-semibold text-slate-950">
              Meeting library
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Chat with one meeting or search across all your uploaded meetings.
            </p>
          </div>

          {meetings.length === 0 ? (
            <div className="px-8 py-20 text-center text-gray-500">
              No meetings uploaded yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex flex-col gap-6 px-8 py-6 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-950">
                        {meeting.title}
                      </h3>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        Ready
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>{meeting.source_filename}</span>

                      <span>
                        Uploaded{" "}
                        {new Date(meeting.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to={`/chat/${meeting.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-gray-50"
                    >
                      Chat with this meeting
                    </Link>

                    <button
                      onClick={() => handleDeleteMeeting(meeting.id)}
                      className="rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;