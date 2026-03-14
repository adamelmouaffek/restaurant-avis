import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { rateLimit } from "@/shared/lib/rate-limit";
import { getClientIp } from "@/shared/lib/get-client-ip";

const getSecret = () =>
  new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

function rateLimitResponse(resetAt: number): NextResponse {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
  return NextResponse.json(
    { error: "Trop de requetes. Reessayez plus tard." },
    {
      status: 429,
      headers: { "Retry-After": String(Math.max(retryAfter, 1)) },
    }
  );
}

// Rate limit configs: [limit, windowMs]
const RATE_LIMITS: Record<string, [number, number]> = {
  "POST:/api/server/auth": [5, 5 * 60 * 1000],       // 5 per 5min (PIN brute force)
  "POST:/api/kds/auth": [5, 5 * 60 * 1000],           // 5 per 5min (KDS PIN)
  "POST:/api/avis/reviews": [3, 60 * 60 * 1000],      // 3 per hour
  "POST:/api/avis/wheel/spin": [5, 60 * 60 * 1000],   // 5 per hour
  "POST:/api/auth/register": [3, 60 * 60 * 1000],     // 3 per hour
};

function getSpecificRateLimit(method: string, pathname: string): [number, number] | null {
  // Normalize dynamic segments for matching
  // /api/server/[slug]/auth → /api/server/auth
  // /api/kds/[slug]/auth → /api/kds/auth
  const normalized = pathname
    .replace(/\/api\/server\/[^/]+\/auth/, "/api/server/auth")
    .replace(/\/api\/kds\/[^/]+\/auth/, "/api/kds/auth");

  const key = `${method}:${normalized}`;
  return RATE_LIMITS[key] || null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // --- Dashboard auth protection ---
  if (pathname.startsWith("/dashboard") && pathname !== "/dashboard/login" && pathname !== "/dashboard/signup") {
    const session = request.cookies.get("dashboard_session");

    if (!session?.value) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }

    const valid = await verifyToken(session.value);
    if (!valid) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
  }

  // --- API rate limiting & CSRF ---
  if (pathname.startsWith("/api/")) {
    const ip = getClientIp(request);

    // CSRF: Validate Origin for state-changing requests
    if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
      const origin = request.headers.get("origin");
      if (origin) {
        const appUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL;
        const allowedOrigins = new Set<string>();
        if (appUrl) {
          // Handle both with and without protocol
          const normalized = appUrl.startsWith("http") ? appUrl : `https://${appUrl}`;
          allowedOrigins.add(new URL(normalized).origin);
        }
        // Always allow localhost in dev
        allowedOrigins.add("http://localhost:3000");

        if (!allowedOrigins.has(origin)) {
          return NextResponse.json(
            { error: "Origine non autorisee" },
            { status: 403 }
          );
        }
      }

      // Body size check (1MB max for JSON APIs, skip file upload)
      if (!pathname.includes("/upload")) {
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 1_048_576) {
          return NextResponse.json(
            { error: "Corps de requete trop volumineux" },
            { status: 413 }
          );
        }
      }
    }

    // Specific rate limits
    const specific = getSpecificRateLimit(method, pathname);
    if (specific) {
      const [limit, windowMs] = specific;
      const result = rateLimit(`${method}:${pathname}:${ip}`, limit, windowMs);
      if (!result.success) return rateLimitResponse(result.resetAt);
    }

    // General API rate limit: 60 req/IP/min (only for non-GET to avoid hitting reads)
    if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
      const result = rateLimit(`api:${ip}`, 60, 60_000);
      if (!result.success) return rateLimitResponse(result.resetAt);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
