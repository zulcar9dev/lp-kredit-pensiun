"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import { requireAdmin } from "@/lib/admin-auth";
import type { CampaignSetting } from "@/lib/types/database";

export type CampaignSettingRow = CampaignSetting;

export async function fetchCampaignSettings(): Promise<CampaignSettingRow[]> {
  await requireAdmin();
  const { data, error } = await getInsforgeAdmin().database
    .from("campaign_settings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch campaign_settings:", error);
    return [];
  }

  return (data ?? []) as CampaignSettingRow[];
}

export async function createCampaignSetting(
  setting: Omit<CampaignSetting, "id" | "created_at">
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await getInsforgeAdmin().database
    .from("campaign_settings")
    .insert([setting]);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function updateCampaignSetting(
  id: string,
  setting: Partial<Omit<CampaignSetting, "id" | "created_at">>
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await getInsforgeAdmin().database
    .from("campaign_settings")
    .update(setting)
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function deleteCampaignSetting(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await getInsforgeAdmin().database
    .from("campaign_settings")
    .delete()
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
