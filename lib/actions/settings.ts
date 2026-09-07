"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import { requireAdmin } from "@/lib/admin-auth";
import { normalizeToE164 } from "@/lib/phone";
import type { AppSetting } from "@/lib/types/database";

export type SettingRow = Omit<AppSetting, "updated_at">;

export async function fetchSettings(): Promise<SettingRow[]> {
  await requireAdmin();
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
  await requireAdmin();

  // PRD §5: nomor WA tersimpan E.164 (628…); tampilan tetap lewat wa_number_display
  const finalValue =
    key === "wa_number" ? normalizeToE164(value) : value;

  if (key === "wa_number" && !/^62[0-9]{9,13}$/.test(finalValue)) {
    return {
      ok: false,
      error:
        "Format nomor tidak valid. Gunakan format Indonesia, contoh: 082189902246",
    };
  }

  const { error } = await getInsforgeAdmin().database
    .from("app_settings")
    .upsert(
      { setting_key: key, setting_value: finalValue },
      { onConflict: "setting_key" }
    );

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
