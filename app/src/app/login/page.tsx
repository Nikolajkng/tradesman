"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = searchParams.get("next") || "/dashboard";

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      nextPath,
    )}`;

    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (googleError) {
      setLoading(false);
      setError(googleError.message);
      return;
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 p-6">
      <h1 className="mb-1 text-2xl font-semibold">Log ind</h1>
      <p className="mb-6 text-sm text-zinc-600">
        Brug din email og adgangskode for at tilgaa dashboardet.
      </p>

      <form onSubmit={handleSignIn} className="space-y-3">
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

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-zinc-600 underline"
          >
            Glemt adgangskode?
          </Link>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white disabled:opacity-70"
        >
          {loading ? "Arbejder..." : "Log ind"}
        </button>
      </form>

      <Link
        href="/signup"
        className="mt-3 block w-full rounded-lg border border-zinc-300 px-4 py-2 text-center text-zinc-900"
      >
        Opret bruger
      </Link>

      <div className="my-4 h-px bg-zinc-200" />

      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleSignIn}
        className="w-full rounded-lg bg-[#174EA6] px-4 py-2 text-white transition-colors hover:bg-[#0F3F8A] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="flex items-center justify-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3c-2.1 1.6-4.7 2.5-7.3 2.5-5.3 0-9.7-3.3-11.4-8l-6.6 5.1C9.4 39.6 16.1 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1 2.7-2.9 4.8-5.3 6.1l.1-.1 6.3 5.3C36 39.5 44 34 44 24c0-1.2-.1-2.4-.4-3.5z"
            />
          </svg>
          <span>Fortsæt med Google</span>
        </span>
      </button>
    </div>
  );
}
