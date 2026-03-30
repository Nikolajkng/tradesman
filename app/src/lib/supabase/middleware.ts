import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Updates the session and enforces authentication rules.
 */
export async function updateSession(request: NextRequest) {
  // 1. Initialize the response
  let supabaseResponse = NextResponse.next({ request });

  // 2. Create the Supabase client and sync cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          // Sync cookies with the request for Server Components
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          // Re-initialize response to include the new cookies
          supabaseResponse = NextResponse.next({ request });

          // Sync cookies with the response for the browser
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 3. IMPORTANT: Get the user to refresh the session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/auth");
  const isProtectedPage = pathname.startsWith("/dashboard");

  // 4. RULE: If NOT logged in and trying to access dashboard -> Redirect to login
  if (!user && isProtectedPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 5. RULE: If ALREADY logged in and trying to access auth pages -> Redirect to dashboard
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 6. Return the synchronized response
  return supabaseResponse;
}
