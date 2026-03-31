"use client";

import Image from "next/image";
import { supabase_client } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link"; 
import { ChevronLeft, LogOut } from "lucide-react"; 

export default function Header({ name }: { name: string | undefined }) {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  const handleLogout = async () => {
    await supabase_client.auth.signOut();
    router.refresh();
    router.push("/auth/login");
  };

  const getTitle = () => {
    if (isDashboard) return <>Velkommen <span className="capitalize">{name}</span></>;
    if (pathname === "/kundeoversigt") return "Kunder";
    if (pathname === "/tilbud") return "Nyt Tilbud";
    if (pathname === "/salg") return "Salgsoversigt";
    return "Tradesman";
  };

  return (
    <div className="mb-8 flex items-center justify-between border-b border-zinc-100 pb-4">
      <div className="flex items-center gap-3">
        {/* TILBAGE-KNAP: Kun synlig når man er væk fra Dashboardet */}
        {!isDashboard && (
          <button 
            onClick={() => router.back()} 
            className="mr-1 rounded-full p-2 hover:bg-zinc-100 transition-colors active:scale-95"
            aria-label="Gå tilbage"
          >
            <ChevronLeft size={24} className="text-zinc-600" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-2">
            {/* Navnet er nu et Link – god PWA-stil for hurtig hjem-navigation */}
            <Link href="/dashboard" className="group flex items-center gap-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-600 transition-colors">
                Tradesman
              </p>
              <div className="h-1 w-1 rounded-full bg-zinc-300 group-hover:bg-yellow-500" />
            </Link>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            {getTitle()}
          </h1>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors duration-200"
      >
        <span>Log ud</span>
        <LogOut size={14} />
      </button>
    </div>
  );
}