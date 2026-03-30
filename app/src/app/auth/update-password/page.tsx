"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase_client } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdatePassword = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setLoading(false);
      setMessage("Adgangskoderne stemmer ikke overens.");
      return;
    }

    if (password.length < 8) {
      setLoading(false);
      setMessage("Adgangskoden skal være mindst 8 tegn.");
      return;
    }

    const { error } = await supabase_client.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Adgangskode opdateret! Du kan nu logge ind.");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 p-6">
      <h1 className="mb-1 text-2xl font-semibold">Opdater Adgangskode</h1>
      <p className="mb-6 text-sm text-zinc-600">Skriv din nye adgangskode.</p>

      <form onSubmit={handleUpdatePassword} className="space-y-3">
        <input
          type="password"
          placeholder="Ny Adgangskode"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Bekræft Adgangskode"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />

        {message && (
          <p
            className={`text-sm ${message.includes("opdateret") ? "text-emerald-700" : "text-red-600"}`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white disabled:opacity-70"
        >
          Opdater Adgangskode
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600">
        Klar til at logge ind?{" "}
        <Link href="/auth/login" className="underline">
          Log ind her
        </Link>
      </p>
    </div>
  );
}
