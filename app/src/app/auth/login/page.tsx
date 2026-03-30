"use client";

import { useState } from "react";
import { supabase_client } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop form from refreshing the page
    setLoading(true);
    setMessage("");

    const { error } = await supabase_client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      // Redirect to dashboard on successful login
      router.refresh();
      router.push("/dashboard");
    }
  };

  // const handleSignup = async () => {
  //     const { error } = await supabase_client.auth.signUp({
  //         email,
  //         password,
  //     })

  //     if (error) {
  //         setMessage(error.message)
  //     } else {
  //         setMessage('User created!')
  //     }
  // }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 p-6">
      <h1 className="mb-1 text-2xl font-semibold">Log ind</h1>
      <p className="mb-6 text-sm text-zinc-600">
        {" "}
        Brug din email og adgangskode for at tilgå dashboardet.
      </p>
      <form onSubmit={handleLogin} className="space-y-3">
        {/* Login  */}
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

        {/* Reset Password */}
        <div className="text-right">
          <Link
            href="/auth/reset-password"
            className="text-sm text-zinc-600 underline"
          >
            Glemt adgangskode?
          </Link>
        </div>

        {/* Error Message */}
        {message && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
            {message}
          </p>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white disabled:opacity-70"
        >
          {loading ? "Logger ind..." : "Log ind"}
        </button>
      </form>

      {/* Register  */}
      <Link
        href="/auth/register"
        className="mt-3 block w-full rounded-lg border border-zinc-300 px-4 py-2 text-center text-zinc-900"
      >
        Opret bruger
      </Link>
    </div>
  );
}

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Login</h1>

//       <input
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <br />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <br />

//       <button onClick={handleLogin}>Login</button>
//       <button onClick={handleSignup}>Sign Up</button>

//       <p>{message}</p>
//     </div>
//   )
//}
