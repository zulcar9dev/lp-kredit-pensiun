"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import { requireAdmin } from "@/lib/admin-auth";
import type { Faq } from "@/lib/types/database";

export type FaqRow = Omit<Faq, "created_at">;

export async function fetchFaqs(): Promise<FaqRow[]> {
  await requireAdmin();
  const { data, error } = await getInsforgeAdmin().database
    .from("faq")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("fetchFaqs error:", error);
    return [];
  }

  return data ?? [];
}

export async function createFaq(
  payload: Omit<Faq, "id" | "created_at">
): Promise<{ ok: boolean; id?: string; error?: string }> {
  await requireAdmin();
  const { data, error } = await getInsforgeAdmin().database
    .from("faq")
    .insert([payload])
    .select("id")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data.id };
}

export async function updateFaq(
  id: string,
  payload: Partial<Omit<Faq, "id" | "created_at">>
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await getInsforgeAdmin().database
    .from("faq")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function deleteFaq(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await getInsforgeAdmin().database
    .from("faq")
    .delete()
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
