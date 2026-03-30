import { updateSession } from "./lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Update the user's session before the page is rendered
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match alle stier UNDTAGET:
     * - api (vigtigt: så din confirm-rute kan køre uforstyrret)
     * - _next/static (statiske filer)
     * - _next/image (billedoptimering)
     * - favicon.ico
     * - Billedfiler (.svg, .png, osv.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
