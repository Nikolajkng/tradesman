"use client";

import Image from "next/image";
import { supabase_client } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface HeaderProps {
  name: string | undefined;
}

export default function Header({ name }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase_client.auth.signOut();
    router.refresh();
    router.push("/auth/login");
  };

  return (
    // 1. TILFØJ flex OG justify-between HER
    <div className="mb-12 flex items-start justify-between">
      {/* Venstre side: Logo og Velkomst */}
      <div>
        <div className="flex items-center gap-2 mb-2">
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
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Velkommen <span className="capitalize">{name}</span>
        </h1>
      </div>

      {/* Højre side: Log ud knap */}
      <button
        onClick={handleLogout}
        className="mt-2 text-xs font-bold uppercase tracking-widest text-red-500 transition-colors duration-200 hover:text-red-800"
      >
        Log ud
      </button>
    </div>
  );
}
