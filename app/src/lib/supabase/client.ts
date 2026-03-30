import { createBrowserClient } from "@supabase/ssr";

/**
 * Singleton instance to prevent "Multiple GoTrueClient instances detected" warning.
 * This ensures the client is only created once in the browser context.
 */
let client: ReturnType<typeof createBrowserClient> | undefined;

export const supabase_client = (() => {
  // If the client already exists, return it instead of creating a new one
  if (client) return client;

  // Create the browser client using environment variables
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return client;
})();
