"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import type { AppSetting } from "@/lib/types/database";

export type SettingRow = Omit<AppSetting, "updated_at">;

export async function fetchSettings(): Promise<SettingRow[]> {
  const { data, error } = await getInsforgeAdmin().database
    .from("app_settings")
    .select("*");

  if (error) {
    console.error("fetchSettings error:", error);
    return [];
  }

  return data ?? [];
}

export async function upsertSetting(
  key: string,
  value: string
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await getInsforgeAdmin().database
    .from("app_settings")
    .upsert(
      { setting_key: key, setting_value: value },
      { onConflict: "setting_key" }
    );

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
