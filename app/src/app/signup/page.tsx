"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!fullName.trim()) {
      setLoading(false);
      setError("Navn er paakraevet.");
      return;
    }

    if (password.length < 8) {
      setLoading(false);
      setError("Adgangskoden skal vaere mindst 8 tegn.");
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Adgangskoderne matcher ikke.");
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setMessage(
      "Brugeren er oprettet. Tjek din email og bekraeft kontoen via linket.",
    );

    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 p-6">
      <h1 className="mb-1 text-2xl font-semibold">Opret bruger</h1>
      <p className="mb-6 text-sm text-zinc-600">
        Opret din konto med navn, email og adgangskode.
      </p>

      <form onSubmit={handleSignUp} className="space-y-3">
        <input
          type="text"
          placeholder="Fulde navn"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
        />
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
          placeholder="Adgangskode"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Bekraeft adgangskode"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white disabled:opacity-70"
        >
          {loading ? "Opretter..." : "Opret bruger"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600">
        Har du allerede en konto?{" "}
        <Link href="/login" className="underline">
          Log ind
        </Link>
      </p>
    </div>
  );
}
