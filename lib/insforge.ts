import { createClient, createAdminClient } from "@insforge/sdk";

export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});

let _admin: ReturnType<typeof createAdminClient> | undefined;

export function getInsforgeAdmin(): ReturnType<typeof createAdminClient> {
  return (_admin ??= createAdminClient({
    baseUrl: process.env.INSFORGE_URL!,
    apiKey: process.env.INSFORGE_API_KEY!,
  }));
}
