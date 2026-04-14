import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tradesman",
  description:
    "PWA for tracking customer and lead information for tradespeople and automate estimation reports",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Await cookies her - det løser "Promise" fejlen
  const cookieStore = await cookies();

  const supabase_client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as CookieOptions),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions before rendering.
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase_client.auth.getUser();

  const displayName = 
    user?.user_metadata?.full_name || 
    user?.email?.split("@")[0] || 
    "Bruger";

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-100" suppressHydrationWarning>
        <div className="flex flex-1 items-center justify-center px-4 py-10 text-zinc-900">
          <main className="w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            {user && <Header name={displayName} />}
            <div className="mt-4">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}