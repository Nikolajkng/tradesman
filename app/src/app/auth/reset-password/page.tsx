"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase_client } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase_client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Tjek din email for instruktioner til nulstilling af adgangskode.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 p-6">
      <h1 className="mb-1 text-2xl font-semibold">Nulstil Adgangskode</h1>
      <p className="mb-6 text-sm text-zinc-600">
        Skriv din email for at modtage instruktioner til nulstilling af
        adgangskode.
      </p>

      <form onSubmit={handleResetPassword} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        {message && (
          <p
            className={`text-sm ${message.includes("Tjek") ? "text-emerald-700" : "text-red-600"}`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white disabled:opacity-70"
        >
          Send Nulstillings-link
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600">
        Husker du din adgangskode?{" "}
        <Link href="/auth/login" className="underline">
          Log ind
        </Link>
      </p>
    </div>
  );
}
