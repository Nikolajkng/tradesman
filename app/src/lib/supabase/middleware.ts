import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Update the cookies on the request so they are available in Server Components
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          // Create a new response to ensure cookies are sent back to the browser
          supabaseResponse = NextResponse.next({
            request,
          });

          // Apply the updated cookies to the final response
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do not remove supabase.auth.getUser().
  // This refreshes the session if it's expired, keeping the user logged in.
  await supabase.auth.getUser();

  return supabaseResponse;
}
