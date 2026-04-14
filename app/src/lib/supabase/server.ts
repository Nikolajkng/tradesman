import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  // 1. Get access to the user's cookies (stored in the browser)
  const cookieStore = await cookies();

  // 2. Create a Supabase client that runs on the server
  const supabase_client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Tell Supabase how to handle cookies (for authentication)
      cookies: {
        /* When Supabase needs to READ cookies: Check if a user is logged in, Identify which user is making the request */
        getAll() {
          return cookieStore.getAll();
        },

        /* When Supabase needs to WRITE cookies: User logs in, Session is refreshed, Tokens are updated*/
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );

  return supabase_client;
}
