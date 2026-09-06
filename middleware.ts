import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL!;
const INSFORGE_ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!;

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const IDLE_COOKIE = "admin_last_seen";

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

function isIdleExpired(lastSeen: string | undefined): boolean {
  if (!lastSeen) return true;
  const ts = Number(lastSeen);
  if (!Number.isFinite(ts)) return true;
  return Date.now() - ts > IDLE_TIMEOUT_MS;
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  return !payload || !payload.exp || payload.exp * 1000 <= Date.now();
}

async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
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
      return { accessToken: null, refreshToken: null };
    }

    const data = await res.json();
    return {
      accessToken: data.accessToken ?? null,
      refreshToken: data.refreshToken ?? refreshToken,
    };
  } catch {
    return { accessToken: null, refreshToken: null };
  }
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("insforge_access_token");
  response.cookies.delete("insforge_refresh_token");
  response.cookies.delete(IDLE_COOKIE);
}

function touchIdleCookie(response: NextResponse) {
  response.cookies.set(IDLE_COOKIE, String(Date.now()), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: IDLE_TIMEOUT_MS / 1000,
  });
}

function setRefreshedTokens(
  response: NextResponse,
  accessToken: string,
  refreshToken: string | null
) {
  response.cookies.set("insforge_access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 900,
  });
  if (refreshToken) {
    response.cookies.set("insforge_refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: IDLE_TIMEOUT_MS / 1000,
    });
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
  const lastSeenValue = request.cookies.get(IDLE_COOKIE)?.value;

  // Idle timeout: no admin activity for 30 minutes → force re-login
  if (!isLoginPage && isIdleExpired(lastSeenValue)) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    clearAuthCookies(response);
    return response;
  }

  // No access token → try silent refresh with the refresh cookie before giving up
  if (!accessTokenValue) {
    if (refreshTokenValue) {
      const result = await refreshAccessToken(refreshTokenValue);
      if (result.accessToken) {
        const response = NextResponse.next({ request });
        setRefreshedTokens(response, result.accessToken, result.refreshToken);
        if (isLoginPage) {
          const redirect = NextResponse.redirect(new URL("/admin", request.url));
          setRefreshedTokens(redirect, result.accessToken, result.refreshToken);
          touchIdleCookie(redirect);
          return redirect;
        }
        touchIdleCookie(response);
        return response;
      }
    }
    if (isLoginPage) {
      return NextResponse.next({ request });
    }
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    clearAuthCookies(response);
    return response;
  }

  const tokenExpired = isTokenExpired(accessTokenValue);

  if (!tokenExpired) {
    if (isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    const response = NextResponse.next({ request });
    touchIdleCookie(response);
    return response;
  }

  // Access token expired → refresh using the (still valid) refresh cookie
  if (refreshTokenValue) {
    const result = await refreshAccessToken(refreshTokenValue);

    if (result.accessToken) {
      const response = isLoginPage
        ? NextResponse.redirect(new URL("/admin", request.url))
        : NextResponse.next({ request });
      setRefreshedTokens(response, result.accessToken, result.refreshToken);
      touchIdleCookie(response);
      return response;
    }
  }

  // Refresh failed → clear cookies → redirect to login
  const loginResponse = isLoginPage
    ? NextResponse.next({ request })
    : NextResponse.redirect(new URL("/admin/login", request.url));
  clearAuthCookies(loginResponse);
  return loginResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
