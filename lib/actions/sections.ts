"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import { requireAdmin } from "@/lib/admin-auth";
import { removeStoredImage } from "@/lib/remove-image";
import type { Section } from "@/lib/types/database";

export type SectionRow = Omit<Section, "created_at" | "updated_at">;

export async function fetchSections(): Promise<SectionRow[]> {
  await requireAdmin();
  const { data, error } = await getInsforgeAdmin().database
    .from("sections")
    .select("*")
    .is("deleted_at", null)
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
  await requireAdmin();
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
  await requireAdmin();
  const { data: current } = await getInsforgeAdmin().database
    .from("sections")
    .select("image_key")
    .eq("id", id)
    .single();

  const { error } = await getInsforgeAdmin().database
    .from("sections")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  if (
    payload.image_key !== undefined &&
    current?.image_key &&
    current.image_key !== payload.image_key
  ) {
    await removeStoredImage(current.image_key);
  }
  return { ok: true };
}

export async function deleteSection(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await getInsforgeAdmin().database
    .from("sections")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
