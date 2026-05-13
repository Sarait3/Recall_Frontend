import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authFetch } from "./lib/authFetch";
import logo from "./assets/logo.png";

function ChatPage() {
  const API_URL = import.meta.env.VITE_API_URL;

  const { meetingId } = useParams();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSend() {
    const trimmedMessage = input.trim();

    if (!trimmedMessage || loading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    try {

      const endpoint = meetingId
        ? `${API_URL}/chat/${meetingId}`
        : `${API_URL}/chat`;

      const response = await authFetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to get answer.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: data.interactionId || crypto.randomUUID(),
          sender: "bot",
          text: data.answer,
          feedback: null,
          interactionId: data.interactionId,
          question: data.question,
          retrievedChunks: data.retrievedChunks || [],
          llmCalled: data.llmCalled,
          timestamp: data.timestamp,
        },
      ]);

    } catch (err) {

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "bot",
          text: err.message || "Something went wrong.",
          feedback: null,
        },
      ]);

    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && input.trim()) {
      handleSend();
    }
  }

  async function handleFeedback(messageId, value) {
    const target = messages.find(
      (message) => message.id === messageId
    );

    if (!target || target.sender !== "bot") return;

    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId
          ? { ...message, feedback: value }
          : message
      )
    );

    try {

      await authFetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interactionId: target.interactionId,
          question: target.question,
          answer: target.text,
          feedback: value,
          retrievedChunks: target.retrievedChunks || [],
          llmCalled: target.llmCalled,
          timestamp: target.timestamp,
        }),
      });

    } catch (err) {
      console.error("Failed to save feedback:", err);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-90px)] flex-col bg-stone-50">

      {/* Top Section */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">

          <div>

            <h1 className="text-2xl font-semibold text-slate-950">
              {meetingId
                ? "Meeting Chat"
                : "AI Workspace"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {meetingId
                ? "Ask questions about this specific meeting"
                : "Search across all your uploaded meetings"}
            </p>

          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-gray-50"
          >
            Dashboard
          </button>

        </div>
      </div>

      {/* Chat Area */}

      <div className="flex-1 overflow-y-auto px-6 py-8">

        {messages.length === 0 ? (

          <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center text-center">

            <div className="mb-6 flex items-center justify-center">
              <img
                src={logo}
                alt="Recall"
                className="h-14 w-14 object-contain"
              />
            </div>

            <div className="mb-5">

              {meetingId ? (
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  Meeting-specific workspace
                </span>
              ) : (
                <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
                  AI Workspace • All meetings
                </span>
              )}

            </div>

            <h2 className="mb-3 text-4xl font-semibold tracking-tight text-slate-950">
              Ask Recall
            </h2>

            <p className="max-w-2xl text-base leading-7 text-gray-500">
              Search transcripts, find decisions, summarize meetings,
              identify action items, and retrieve important discussions instantly.
            </p>

          </div>

        ) : (

          <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 pb-8">

            {messages.map((message) => (

              <div
                key={message.id}
                className={`flex ${message.sender === "user"
                  ? "justify-end"
                  : "justify-start"
                  }`}
              >

                <div className="max-w-[80%]">

                  <div
                    className={`rounded-3xl px-5 py-4 text-sm leading-7 shadow-sm ${message.sender === "user"
                      ? "bg-slate-950 text-white"
                      : "border border-gray-200 bg-white text-slate-800"
                      }`}
                  >
                    {message.text}
                  </div>

                  {message.sender === "bot" && (

                    <div className="mt-3 flex items-center gap-2 pl-2">

                      <button
                        onClick={() =>
                          handleFeedback(message.id, "up")
                        }
                        className={`rounded-full border px-3 py-1 text-sm transition ${message.feedback === "up"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-100"
                          }`}
                      >
                        👍
                      </button>

                      <button
                        onClick={() =>
                          handleFeedback(message.id, "down")
                        }
                        className={`rounded-full border px-3 py-1 text-sm transition ${message.feedback === "down"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-100"
                          }`}
                      >
                        👎
                      </button>

                    </div>

                  )}

                </div>

              </div>

            ))}

            {loading && (

              <div className="flex justify-start">

                <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-500 shadow-sm">
                  Recall is thinking...
                </div>

              </div>

            )}

          </div>

        )}

      </div>

      {/* Input */}

      <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-5">

        <div className="mx-auto flex w-full max-w-4xl items-center gap-4">

          <input
            type="text"
            placeholder={
              meetingId
                ? "Ask about this meeting..."
                : "Ask about all your meetings..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-2xl border border-gray-300 bg-white px-5 py-4 text-sm text-slate-800 outline-none transition focus:border-slate-950"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="rounded-2xl bg-slate-950 px-6 py-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Thinking..." : "Send"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ChatPage;