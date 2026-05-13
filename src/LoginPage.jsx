import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "./lib/supabase";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-950 text-4xl text-white">
            ▱
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