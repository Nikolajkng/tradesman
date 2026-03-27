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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    const { data, error: signUpError } = await supabase.auth.signUp({
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
      const isEmailTaken =
        signUpError.message.toLowerCase().includes("already") ||
        signUpError.message.toLowerCase().includes("registered");

      setError(
        isEmailTaken
          ? "Denne email er allerede i brug. Proev at logge ind i stedet."
          : signUpError.message,
      );
      return;
    }

    // Supabase can return a user with no identities when the email already exists.
    if (
      data.user &&
      Array.isArray(data.user.identities) &&
      data.user.identities.length === 0
    ) {
      setError("Denne email er allerede i brug. Proev at logge ind i stedet.");
      return;
    }

    setMessage(
      "Brugeren er oprettet. Tjek din email og bekræft kontoen via linket.",
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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Adgangskode"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 pr-11"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Skjul adgangskode" : "Vis adgangskode"}
            title={showPassword ? "Skjul adgangskode" : "Vis adgangskode"}
            className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            {showPassword ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.88 5.08A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7.5a11.82 11.82 0 01-4.21 5.28M6.61 6.61A12.05 12.05 0 001 12.5 11.82 11.82 0 005.22 17.78"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M1 12.5C2.73 8.11 7 5 12 5s9.27 3.11 11 7.5C21.27 16.89 17 20 12 20S2.73 16.89 1 12.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12.5"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Bekræft adgangskode"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 pr-11"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((current) => !current)}
            aria-label={
              showConfirmPassword
                ? "Skjul bekræft adgangskode"
                : "Vis bekræft adgangskode"
            }
            title={
              showConfirmPassword
                ? "Skjul bekræft adgangskode"
                : "Vis bekræft adgangskode"
            }
            className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            {showConfirmPassword ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.88 5.08A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7.5a11.82 11.82 0 01-4.21 5.28M6.61 6.61A12.05 12.05 0 001 12.5 11.82 11.82 0 005.22 17.78"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M1 12.5C2.73 8.11 7 5 12 5s9.27 3.11 11 7.5C21.27 16.89 17 20 12 20S2.73 16.89 1 12.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12.5"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            )}
          </button>
        </div>

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
