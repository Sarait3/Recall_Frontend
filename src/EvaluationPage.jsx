import { useEffect, useState } from "react";
import { authFetch } from "./lib/authFetch";

function EvaluationPage() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const response = await authFetch(
        `${API_URL}/evaluation`
      );

      const data = await response.json();

      setItems(data);

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-10">

      <div className="mx-auto max-w-6xl">

        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-slate-950">
            RAG Evaluation Demo
          </h1>

          <p className="mt-3 max-w-3xl text-gray-500">
            This page demonstrates how negative feedback can be reviewed
            to improve retrieval quality, chunking, parsing, and prompt design.
          </p>
        </div>

        {items.length === 0 ? (

          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-gray-500">
            No negative feedback yet.
          </div>

        ) : (

          <div className="space-y-6">

            {items.map((item) => (

              <div
                key={item.id}
                className="rounded-3xl border border-gray-200 bg-white p-8"
              >

                <div className="mb-5 flex items-center justify-between">

                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                    Needs improvement
                  </span>

                  <span className="text-sm text-gray-400">
                    {new Date(item.created_at).toLocaleString()}
                  </span>

                </div>

                <div className="mb-6">
                  <p className="mb-2 text-sm font-medium text-gray-500">
                    Question
                  </p>

                  <p className="text-slate-950">
                    {item.question}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="mb-2 text-sm font-medium text-gray-500">
                    AI Answer
                  </p>

                  <p className="rounded-2xl bg-stone-50 p-4 text-slate-800">
                    {item.answer}
                  </p>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-gray-500">
                    Retrieved Chunks
                  </p>

                  <div className="space-y-3">

                    {(item.retrieved_chunks || []).map((chunk, index) => (

                      <div
                        key={index}
                        className="rounded-2xl border border-gray-200 bg-stone-50 p-4 text-sm text-slate-700"
                      >
                        {chunk.text}
                      </div>

                    ))}

                  </div>
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default EvaluationPage;