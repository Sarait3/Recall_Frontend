import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logo from "../assets/logo.png";

function Header() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Link
          to="/dashboard"
          className="flex items-center gap-4"
        >
          <div className="flex items-center justify-center">
            <img
              src={logo}
              alt="Recall Logo"
              className="h-14 w-14 object-contain"
            />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950">
              Recall
            </h1>

            <p className="text-sm text-gray-500">
              If you don’t recall, just Recall
            </p>
          </div>
        </Link>

        {/* Navigation */}

        <nav className="flex items-center gap-3">

          <Link
            to="/dashboard"
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-gray-100 hover:text-slate-950"
          >
            Dashboard
          </Link>

          <Link
            to="/evaluation"
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-gray-100 hover:text-slate-950"
          >
            Evaluation
          </Link>

          <Link
            to="/chat"
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-gray-100 hover:text-slate-950"
          >
            AI Workspace
          </Link>

          <Link
            to="/upload"
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Upload Transcript
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-slate-950"
          >
            Logout
          </button>

        </nav>
      </div>
    </header>
  );
}

export default Header;