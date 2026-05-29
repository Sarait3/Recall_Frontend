import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";
import { supabase } from "./lib/supabase";


function LandingPage() {
    const navigate = useNavigate();
    const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL;
    const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD;

    async function handleDemoLogin() {
        const { error } = await supabase.auth.signInWithPassword({
            email: import.meta.env.VITE_DEMO_EMAIL,
            password: import.meta.env.VITE_DEMO_PASSWORD,
        });

        if (error) {
            alert(error.message);
            return;
        }

        navigate("/dashboard");
    }

    return (
        <div className="min-h-screen bg-stone-50 text-slate-950">
            <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Recall Logo" className="h-10 w-10 object-contain" />
                    <span className="text-xl font-semibold">Recall</span>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-medium hover:bg-gray-50"
                    >
                        Log in
                    </Link>


                    <button
                        onClick={handleDemoLogin}
                        className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:opacity-90"
                    >
                        Try Demo
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-10">
                <section className="grid gap-10 rounded-4xl bg-white p-8 shadow-sm ring-1 ring-gray-200 md:grid-cols-2 md:p-12">
                    <div>
                        <p className="mb-4 text-sm font-medium text-gray-500">
                            AI-powered meeting recall
                        </p>

                        <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
                            Turn meeting transcripts into searchable knowledge.
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-gray-500">
                            Recall helps you upload meeting transcripts, organize them in one
                            place, and ask questions based on the actual meeting content.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <button
                                onClick={handleDemoLogin}
                                className="rounded-full bg-slate-950 px-7 py-4 text-sm font-medium text-white hover:opacity-90"
                            >
                                Try Demo
                            </button>

                            <Link
                                to="/login"
                                className="rounded-full border border-gray-300 bg-white px-7 py-4 text-sm font-medium hover:bg-gray-50"
                            >
                                Log in
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-4xl bg-stone-50 p-6">
                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                            <p className="text-sm text-gray-500">Meeting library</p>
                            <h2 className="mt-3 text-2xl font-semibold">
                                Project Kickoff Meeting
                            </h2>

                            <div className="mt-5 space-y-3">
                                <div className="rounded-2xl bg-stone-50 p-4 text-sm text-gray-600">
                                    What decisions were made about the project timeline?
                                </div>

                                <div className="rounded-2xl bg-slate-950 p-4 text-sm text-white">
                                    The team agreed to prioritize the MVP first, complete backend
                                    integration, and review progress in the next meeting.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-10">
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-500">How it works</p>
                        <h2 className="mt-2 text-3xl font-semibold">
                            From transcripts to answers
                        </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        <div className="rounded-3xl border border-gray-200 bg-white p-6">
                            <p className="text-sm font-medium text-gray-500">Step 1</p>
                            <h3 className="mt-3 text-xl font-semibold">Upload transcripts</h3>
                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Add meeting transcript files to your workspace.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-gray-200 bg-white p-6">
                            <p className="text-sm font-medium text-gray-500">Step 2</p>
                            <h3 className="mt-3 text-xl font-semibold">Process content</h3>
                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Recall breaks transcripts into searchable chunks for retrieval.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-gray-200 bg-white p-6">
                            <p className="text-sm font-medium text-gray-500">Step 3</p>
                            <h3 className="mt-3 text-xl font-semibold">Ask questions</h3>
                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Ask about one meeting or search across all uploaded meetings.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-10">
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-500">Features</p>
                        <h2 className="mt-2 text-3xl font-semibold">
                            Built for meeting knowledge
                        </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-4">
                        <FeatureCard
                            title="Meeting library"
                            text="Keep all uploaded transcripts organized in one dashboard."
                        />

                        <FeatureCard
                            title="Single-meeting chat"
                            text="Ask questions about a specific uploaded transcript."
                        />

                        <FeatureCard
                            title="All-meetings chat"
                            text="Search across your full meeting history."
                        />

                        <FeatureCard
                            title="Usage tracking"
                            text="View how many meetings were uploaded and questions were asked."
                        />
                    </div>
                </section>

                <section className="mt-10 rounded-4xl bg-slate-950 p-8 text-white md:p-10">
                    <div className="max-w-3xl">
                        <p className="text-sm font-medium text-gray-300">Technical overview</p>

                        <h2 className="mt-3 text-3xl font-semibold">
                            A full-stack RAG application
                        </h2>

                        <p className="mt-4 leading-7 text-gray-300">
                            Recall uses a React frontend, Supabase authentication, a Python
                            backend, PostgreSQL with vector search, and retrieval-augmented
                            generation to answer questions from uploaded transcripts.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

function FeatureCard({ title, text }) {
    return (
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <h3 className="font-semibold text-slate-950">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-500">{text}</p>
        </div>
    );
}

export default LandingPage;