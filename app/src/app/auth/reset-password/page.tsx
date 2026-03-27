"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

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

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(
      "Din adgangskode er opdateret. Du bliver sendt til dashboardet.",
    );
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 p-6">
      <h1 className="mb-1 text-2xl font-semibold">Ny adgangskode</h1>
      <p className="mb-6 text-sm text-zinc-600">
        Vaelg en ny adgangskode for din bruger.
      </p>

      <form onSubmit={handleUpdatePassword} className="space-y-3">
        <input
          type="password"
          placeholder="Ny adgangskode"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Gentag ny adgangskode"
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
          {loading ? "Gemmer..." : "Gem ny adgangskode"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600">
        Tilbage til{" "}
        <Link href="/login" className="underline">
          login
        </Link>
      </p>
    </div>
  );
}
