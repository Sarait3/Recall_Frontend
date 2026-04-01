import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChatPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  
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
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmedMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to get answer.");
      }

      const botMessage = {
        id: data.interactionId || crypto.randomUUID(),
        sender: "bot",
        text: data.answer,
        feedback: null,

        // for feedback/evaluation
        interactionId: data.interactionId,
        documentId: data.documentId,
        documentName: data.documentName,
        question: data.question,
        retrievedChunks: data.retrievedChunks || [],
        llmCalled: data.llmCalled,
        timestamp: data.timestamp,
      };

      setMessages((prev) => [...prev, botMessage]);
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
    const target = messages.find((message) => message.id === messageId);
    if (!target || target.sender !== "bot") return;

    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId ? { ...message, feedback: value } : message,
      ),
    );

    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interactionId: target.interactionId,
          documentId: target.documentId,
          documentName: target.documentName,
          question: target.question,
          answer: target.text,
          feedback: value,
          retrievedChunks: target.retrievedChunks || [],
          llmCalled: target.llmCalled,
          timestamp: target.timestamp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to save feedback.");
      }
    } catch (err) {
      console.error("Failed to save feedback:", err);
    }
  }

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-2xl text-violet-600">
              ✦
            </div>

            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Ready to Answer Your Questions
            </h2>

            <p className="max-w-md text-sm leading-6 text-gray-500">
              Ask me anything about your document. I'll retrieve relevant
              context and provide you with accurate answers.
            </p>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[80%] ${
                  message.sender === "user" ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    message.sender === "user"
                      ? "bg-violet-500 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  {message.text}
                </div>

                {message.sender === "bot" && (
                  <div className="mt-2 flex items-center gap-2 pl-2">
                    <button
                      onClick={() => handleFeedback(message.id, "up")}
                      className={`rounded-full px-3 py-1 text-sm transition ${
                        message.feedback === "up"
                          ? "bg-green-100 text-green-700"
                          : "bg-white text-gray-500 hover:bg-gray-100"
                      }`}
                      aria-label="Thumbs up"
                      title="Thumbs up"
                    >
                      👍
                    </button>

                    <button
                      onClick={() => handleFeedback(message.id, "down")}
                      className={`rounded-full px-3 py-1 text-sm transition ${
                        message.feedback === "down"
                          ? "bg-red-100 text-red-700"
                          : "bg-white text-gray-500 hover:bg-gray-100"
                      }`}
                      aria-label="Thumbs down"
                      title="Thumbs down"
                    >
                      👎
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex w-full max-w-3xl gap-3">
          <input
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 max-w-xl mx-auto rounded-full border border-gray-300 px-4 py-2 text-sm outline-none items-center focus:border-violet-500"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="rounded-full bg-violet-500 px-4 py-2 text-sm text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send ➤"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            Upload new document
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
