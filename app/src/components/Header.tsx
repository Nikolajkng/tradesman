"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type HeaderProps = {
  initialEmail: string | null;
};

export default function Header({ initialEmail }: HeaderProps) {
  const [email, setEmail] = useState<string | null>(initialEmail);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    setLoading(true);

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setEmail(data.user?.email ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      setEmail(session?.user?.email ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const welcomeLabel = email ? `Velkommen ${email}` : "Velkommen";
  const hideAuthButtonPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/auth/reset-password",
  ];
  const showAuthButton = !hideAuthButtonPaths.includes(pathname);

  return (
    <div className="mb-12 border-b border-zinc-200 pb-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
            Tradesman
          </p>
          <Image
            src="/images/helmet.png"
            alt="Helmet icon"
            width={20}
            height={20}
            className="h-5 w-5 shrink-0 object-contain"
            priority
          />
        </div>
        {!showAuthButton || loading || !email ? null : (
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-800 transition hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm"
          >
            Log ud
          </button>
        )}
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">{welcomeLabel}</h1>
    </div>
  );
}
