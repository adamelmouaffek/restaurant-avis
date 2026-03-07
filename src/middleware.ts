import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login page
  if (pathname === "/dashboard/login") {
    return NextResponse.next();
  }

  // Protect all /dashboard/* routes
  if (pathname.startsWith("/dashboard")) {
    const session = request.cookies.get("dashboard_session");

    if (!session?.value) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }

    // Validate the session cookie format
    try {
      const decoded = atob(session.value);
      const parsed = JSON.parse(decoded);
      if (!parsed.restaurantId || !parsed.email) {
        return NextResponse.redirect(
          new URL("/dashboard/login", request.url)
        );
      }
    } catch {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
