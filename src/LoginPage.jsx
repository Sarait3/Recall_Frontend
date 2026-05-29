import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "./lib/supabase";
import logo from "./assets/logo.png";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL;
  const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD;


  async function handleDemoLogin() {
    console.log("Demo email:", DEMO_EMAIL);
    console.log("Demo password:", DEMO_PASSWORD);
    const { error } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  }


  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center">
            <img
              src={logo}
              alt="Recall Logo"
              className="h-20 w-20 object-contain"
            />
          </div>
          <h1 className="text-4xl font-semibold text-slate-950">Recall</h1>
          <p className="mt-2 text-gray-500">If you don’t recall, just Recall</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-4xl bg-white p-8 shadow-sm ring-1 ring-gray-200"
        >
          <h2 className="mb-2 text-3xl font-semibold text-slate-950">Welcome</h2>
          <p className="mb-8 text-gray-500">Sign in to continue</p>

          <input
            type="email"
            placeholder="Enter your email"
            className="mb-5 w-full rounded-2xl border border-gray-300 px-5 py-4 outline-none focus:border-slate-950"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="mb-6 w-full rounded-2xl border border-gray-300 px-5 py-4 outline-none focus:border-slate-950"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full rounded-full bg-slate-950 py-4 font-medium text-white">
            Log in
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="mt-3 w-full rounded-full border border-slate-950 py-4 font-medium text-slate-950 hover:bg-slate-100"
          >
            Try Demo
          </button>

          <p className="mt-6 text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="underline">
              Sign up now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;