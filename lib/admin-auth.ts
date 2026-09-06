import { cookies } from "next/headers";
import { createServerClient, type CookieStore } from "@insforge/sdk/ssr";

const cache = new Map<string, { userId: string; at: number }>();
const CACHE_TTL_MS = 30_000;

export async function getAdminUserId(): Promise<string | null> {
  const cookieStore = cookies();
  const raw = (cookieStore as unknown as CookieStore).get?.(
    "insforge_access_token"
  );
  const accessToken =
    typeof raw === "string" ? raw : (raw as { value?: string } | undefined)?.value;

  if (!accessToken) return null;

  const now = Date.now();
  const hit = cache.get(accessToken);
  if (hit && now - hit.at < CACHE_TTL_MS) return hit.userId;

  try {
    const serverClient = createServerClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
      cookies: cookieStore as unknown as CookieStore,
    });
    const { data, error } = await serverClient.auth.getCurrentUser();
    if (error || !data?.user) {
      cache.delete(accessToken);
      return null;
    }
    cache.set(accessToken, { userId: data.user.id, at: now });
    return data.user.id;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<void> {
  const userId = await getAdminUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
}
