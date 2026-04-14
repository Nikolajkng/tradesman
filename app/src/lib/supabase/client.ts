import { createBrowserClient } from "@supabase/ssr";

let supabaseBrowserClientSingleton: ReturnType<typeof createBrowserClient> | undefined;

export const supabaseBrowserClient = (() => {
  // If the client already exists, return it instead of creating a new one
  if (supabaseBrowserClientSingleton) return supabaseBrowserClientSingleton;

  // Create the browser client using environment variables
  supabaseBrowserClientSingleton = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return supabaseBrowserClientSingleton;
})();
