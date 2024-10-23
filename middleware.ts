import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { updateYahooAuth } from "@/lib/yahoo/middleware";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  console.log(request.nextUrl.pathname);
  // Public Pages
  if (
    !["forgot-password", "sign-in", "sign-up", "auth", "pricing"].includes(
      request.nextUrl.pathname,
    )
  ) {
    response = await updateSession(request, response);
  }

  // // Yahoo Pages
  if (request.nextUrl.pathname.startsWith("/fantasy")) {
    response = await updateYahooAuth(request, response);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
