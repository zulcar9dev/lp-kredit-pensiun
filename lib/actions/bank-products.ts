"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import { requireAdmin } from "@/lib/admin-auth";
import { removeStoredImage } from "@/lib/remove-image";
import { bankProductServerSchema, zodErrorMessage } from "@/lib/schema";
import type { BankProduct } from "@/lib/types/database";

export type BankProductRow = Omit<BankProduct, "created_at" | "updated_at">;

export async function fetchBankProducts(): Promise<BankProductRow[]> {
  await requireAdmin();
  const { data, error } = await getInsforgeAdmin().database
    .from("bank_products")
    .select("*")
    .is("deleted_at", null)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("fetchBankProducts error:", error);
    return [];
  }

  return data ?? [];
}

export async function createBankProduct(
  payload: Omit<BankProduct, "id" | "created_at" | "updated_at">
): Promise<{ ok: boolean; id?: string; error?: string }> {
  await requireAdmin();
  const parsed = bankProductServerSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: zodErrorMessage(parsed.error) };
  }
  const { data, error } = await getInsforgeAdmin().database
    .from("bank_products")
    .insert([parsed.data])
    .select("id")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data.id };
}

export async function updateBankProduct(
  id: string,
  payload: Partial<Omit<BankProduct, "id" | "created_at" | "updated_at">>
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const parsed = bankProductServerSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: zodErrorMessage(parsed.error) };
  }
  const update: Record<string, unknown> = {};
  for (const k of Object.keys(payload)) {
    update[k] = (parsed.data as Record<string, unknown>)[k];
  }
  const { data: current } = await getInsforgeAdmin().database
    .from("bank_products")
    .select("logo_key")
    .eq("id", id)
    .single();

  const { error } = await getInsforgeAdmin().database
    .from("bank_products")
    .update(update)
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    return { ok: false, error: error.message };
  }

  if (
    payload.logo_key !== undefined &&
    current?.logo_key &&
    current.logo_key !== payload.logo_key
  ) {
    await removeStoredImage(current.logo_key);
  }
  return { ok: true };
}

export async function deleteBankProduct(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await getInsforgeAdmin().database
    .from("bank_products")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
