import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

/**
 * GET handler for Supabase Email Confirmation (PKCE Flow)
 * This route is triggered when a user clicks the confirmation link in their email.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  // 1. Extract authentication parameters from the URL
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  // 2. Early exit if required parameters are missing
  if (!token_hash || !type) {
    console.error("Auth Confirmation Failed: Missing token_hash or type");
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent("Missing authentication data")}`,
    );
  }

  // 3. Initialize Supabase client and verify the OTP (One-Time Password)
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });

  // 4. Handle verification errors (e.g., expired or invalid link)
  if (error) {
    console.error("Supabase Auth Verification Error:", error.message);
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  // 5. SUCCESS: Redirect the user to the intended destination (usually /dashboard)
  // The authentication cookies are automatically attached to this redirect response.
  return NextResponse.redirect(`${origin}${next}`);
}
