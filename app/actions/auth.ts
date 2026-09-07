"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthActions, type CookieStore } from "@insforge/sdk/ssr";

function getAuthActions() {
  const cookieStore = cookies();
  // Next.js RequestCookies.get() returns { value: string } | undefined,
  // which is compatible with SDK's CookieStore.get() at runtime.
  return createAuthActions({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore as unknown as CookieStore,
  });
}

// Harus sinkron dengan middleware.ts (IDLE_COOKIE / IDLE_TIMEOUT_MS).
const IDLE_COOKIE = "admin_last_seen";
const IDLE_TIMEOUT_S = 30 * 60;

export async function signIn(email: string, password: string) {
  try {
    const auth = getAuthActions();
    const result = await auth.signInWithPassword({ email, password });

    if (result.error) {
      return {
        user: null,
        error: result.error.message || "Email atau password salah",
      };
    }

    if (result.data?.user) {
      // Jangkar idle window di saat login, agar middleware tidak memantulkan
      // balik ke /admin/login pada navigasi pertama ke /admin.
      (cookies() as unknown as CookieStore).set?.(IDLE_COOKIE, String(Date.now()), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: IDLE_TIMEOUT_S,
      });
    }

    return { user: result.data?.user ?? null, error: null };
  } catch {
    return { user: null, error: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

export async function signOut() {
  try {
    const auth = getAuthActions();
    await auth.signOut();
  } catch {
    // proceed with redirect even if backend signout fails
  }
  (cookies() as unknown as CookieStore).delete?.(IDLE_COOKIE);
  redirect("/admin/login");
}
