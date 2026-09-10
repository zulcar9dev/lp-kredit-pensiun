"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import { requireAdmin } from "@/lib/admin-auth";
import { faqServerSchema, zodErrorMessage } from "@/lib/schema";
import type { Faq } from "@/lib/types/database";

export type FaqRow = Omit<Faq, "created_at">;

export async function fetchFaqs(): Promise<FaqRow[]> {
  await requireAdmin();
  const { data, error } = await getInsforgeAdmin().database
    .from("faq")
    .select("*")
    .is("deleted_at", null)
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
  const parsed = faqServerSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: zodErrorMessage(parsed.error) };
  }
  const { data, error } = await getInsforgeAdmin().database
    .from("faq")
    .insert([parsed.data])
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
  const parsed = faqServerSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: zodErrorMessage(parsed.error) };
  }
  const update: Record<string, unknown> = {};
  for (const k of Object.keys(payload)) {
    update[k] = (parsed.data as Record<string, unknown>)[k];
  }
  const { error } = await getInsforgeAdmin().database
    .from("faq")
    .update(update)
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function deleteFaq(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  // Soft delete — section landing otomatis menyembunyikan baris ter-soft-delete
  const { error } = await getInsforgeAdmin().database
    .from("faq")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
