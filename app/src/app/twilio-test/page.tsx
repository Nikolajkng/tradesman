"use client";

import { useState } from "react";

type ApiResponse = {
  ok?: boolean;
  error?: string;
  twilioConfigured?: boolean;
  missingEnvVars?: string[];
  result?: {
    mode: "mock" | "live";
    sid: string;
    to: string;
    body: string;
    status: string;
  };
};

const initialForm = {
  to: "+4512345678",
  body: "Hej! This is a test SMS from my Next.js + Twilio setup.",
  useMock: true,
};

export default function TwilioTestPage() {
  const [form, setForm] = useState(initialForm);
  const [isSending, setIsSending] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setResponse(null);

    try {
      const res = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as ApiResponse;
      setResponse(data);
    } catch {
      setResponse({
        ok: false,
        error: "Request failed before reaching the API route.",
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-100 px-4 py-10 text-zinc-900">
      <main className="w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
            Twilio Test
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Send a mock or real SMS from Next.js
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-zinc-600">
            Start in mock mode to test the full request flow safely. When your
            Twilio environment variables are added, you can turn mock mode off
            and send a real SMS instead.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">To</span>
            <input
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-500"
              type="tel"
              value={form.to}
              onChange={(event) =>
                setForm((current) => ({ ...current, to: event.target.value }))
              }
              placeholder="+4512345678"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">Message</span>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-500"
              value={form.body}
              onChange={(event) =>
                setForm((current) => ({ ...current, body: event.target.value }))
              }
              placeholder="Write your test SMS here"
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <input
              checked={form.useMock}
              type="checkbox"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  useMock: event.target.checked,
                }))
              }
            />
            <span className="text-sm text-zinc-700">
              Use mock mode instead of sending a real Twilio SMS
            </span>
          </label>

          <button
            className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
            disabled={isSending}
            type="submit"
          >
            {isSending ? "Sending..." : "Send test SMS"}
          </button>
        </form>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Expected setup
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Real sends require <code>TWILIO_ACCOUNT_SID</code>,{" "}
            <code>TWILIO_AUTH_TOKEN</code>, and{" "}
            <code>TWILIO_PHONE_NUMBER</code> in your environment.
          </p>
        </section>

        {response ? (
          <section className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-950 p-4 text-sm text-zinc-100">
            <p className="font-semibold">
              {response.ok ? "API response received" : "Request failed"}
            </p>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-zinc-300">
              {JSON.stringify(response, null, 2)}
            </pre>
          </section>
        ) : null}
      </main>
    </div>
  );
}
