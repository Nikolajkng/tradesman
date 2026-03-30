"use client";

import Link from "next/link";
import react from "react";
import { supabase_client } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [email, setEmail] = react.useState("");
  const [password, setPassword] = react.useState("");
  const [loading, setLoading] = react.useState(false);
  const [message, setMessage] = react.useState<string | null>(null);
  const [error, setError] = react.useState<string | null>(null);

  async function handleSignUp(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (password.length < 8) {
      setLoading(false);
      setError("Password must be at least 8 characters.");
      return;
    }

    const { error: signUpError } = await supabase_client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/confirm`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setMessage("Account created! Check your email to confirm.");
    setEmail("");
    setPassword("");
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 p-6">
      <h1 className="mb-1 text-2xl font-semibold">Create Account</h1>
      <p className="mb-6 text-sm text-zinc-600">
        Create your account with email and password.
      </p>

      <form onSubmit={handleSignUp} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white disabled:opacity-70"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600">
        Har du en konto?{" "}
        <Link href="/auth/login" className="underline">
          Log på her
        </Link>
      </p>
    </div>
  );
}
