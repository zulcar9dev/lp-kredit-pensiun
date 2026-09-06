import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL!;
const INSFORGE_ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!;

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const base64url = token.split(".")[1];
    const normalized = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );
    const binary = atob(padded);
    return JSON.parse(binary);
  } catch {
    return null;
  }
}

async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${INSFORGE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: INSFORGE_ANON_KEY,
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      return { accessToken: null, refreshToken: null, error: "refresh failed" };
    }

    const data = await res.json();
    return {
      accessToken: data.accessToken ?? null,
      refreshToken: data.refreshToken ?? refreshToken,
      error: null,
    };
  } catch {
    return { accessToken: null, refreshToken: null, error: "refresh failed" };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/admin/login";
  const accessTokenValue = request.cookies.get("insforge_access_token")?.value;
  const refreshTokenValue = request.cookies.get("insforge_refresh_token")?.value;

  // No token → redirect to login (except if already on login page)
  if (!accessTokenValue && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const response = NextResponse.next({ request });

  if (!accessTokenValue) {
    return response;
  }

  const payload = decodeJwtPayload(accessTokenValue);
  const tokenExpired = !payload || !payload.exp || payload.exp * 1000 <= Date.now();

  if (!tokenExpired) {
    // Token still valid → pass through
    if (isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  // Token expired → try refresh
  if (refreshTokenValue) {
    const result = await refreshAccessToken(refreshTokenValue);

    if (result.accessToken) {
      response.cookies.set("insforge_access_token", result.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 900,
      });
      if (result.refreshToken) {
        response.cookies.set("insforge_refresh_token", result.refreshToken, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });
      }
      if (isLoginPage) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return response;
    }
  }

  // Refresh failed → clear cookies → redirect to login
  const loginResponse = isLoginPage
    ? response
    : NextResponse.redirect(new URL("/admin/login", request.url));
  loginResponse.cookies.delete("insforge_access_token");
  loginResponse.cookies.delete("insforge_refresh_token");
  return loginResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
