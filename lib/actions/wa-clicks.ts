"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import { requireAdmin } from "@/lib/admin-auth";
import type { WaClick } from "@/lib/types/database";

export async function fetchWaClicks(): Promise<WaClick[]> {
  await requireAdmin();
  const { data, error } = await getInsforgeAdmin().database
    .from("wa_clicks")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) {
    console.error("fetchWaClicks error:", error);
    return [];
  }

  return data ?? [];
}
