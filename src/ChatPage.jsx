import { useState } from "react";

function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  function handleSend() {
    const trimmedMessage = input.trim();

    if (!trimmedMessage) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "user", text: trimmedMessage },
      { id: crypto.randomUUID(), sender: "bot", text: "Received!" },
    ]);

    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && input.trim()) {
      handleSend();
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
              Ask me anything about your document.
              I'll retrieve relevant context and provide you with accurate answers.
            </p>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  message.sender === "user"
                    ? "ml-auto bg-violet-500 text-white"
                    : "mr-auto bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
          <input
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-violet-500"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="rounded-full bg-violet-500 px-4 py-2 text-sm text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;