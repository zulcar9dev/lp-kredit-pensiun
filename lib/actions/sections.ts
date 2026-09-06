"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import type { Section } from "@/lib/types/database";

export type SectionRow = Omit<Section, "created_at" | "updated_at">;

export async function fetchSections(): Promise<SectionRow[]> {
  const { data, error } = await getInsforgeAdmin().database
    .from("sections")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("fetchSections error:", error);
    return [];
  }

  return data ?? [];
}

export async function createSection(
  payload: Omit<Section, "id" | "created_at" | "updated_at">
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const { data, error } = await getInsforgeAdmin().database
    .from("sections")
    .insert([payload])
    .select("id")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data.id };
}

export async function updateSection(
  id: string,
  payload: Partial<Omit<Section, "id" | "created_at" | "updated_at">>
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await getInsforgeAdmin().database
    .from("sections")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function deleteSection(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await getInsforgeAdmin().database
    .from("sections")
    .delete()
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
