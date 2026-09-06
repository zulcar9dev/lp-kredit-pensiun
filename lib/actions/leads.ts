"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import { requireAdmin } from "@/lib/admin-auth";
import type { Lead } from "@/lib/types/database";

export type LeadRow = Omit<Lead, "created_at" | "updated_at"> & {
  created_at: string;
  deleted_at: string | null;
};

export async function fetchLeads(filters?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<LeadRow[]> {
  await requireAdmin();
  let query = getInsforgeAdmin().database
    .from("leads")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (filters?.dateFrom) {
    query = query.gte("created_at", filters.dateFrom);
  }
  if (filters?.dateTo) {
    query = query.lte("created_at", filters.dateTo + "T23:59:59");
  }

  const { data, error } = await query;

  if (error) {
    console.error("fetchLeads error:", error);
    return [];
  }

  return data ?? [];
}

export async function updateLeadStatus(
  id: string,
  status: Lead["status"]
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await getInsforgeAdmin().database
    .from("leads")
    .update({ status })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function updateLead(
  id: string,
  payload: Partial<Pick<Lead, "name" | "whatsapp" | "pension_type" | "province" | "loan_amount" | "interested_bank" | "status" | "notes">>
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await getInsforgeAdmin().database
    .from("leads")
    .update(payload)
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function createLead(
  payload: Pick<Lead, "name" | "whatsapp" | "pension_type" | "province"> &
    Partial<Pick<Lead, "loan_amount" | "interested_bank" | "notes" | "status">>
): Promise<{ ok: boolean; error?: string; id?: string }> {
  await requireAdmin();
  const { data, error } = await getInsforgeAdmin().database
    .from("leads")
    .insert([
      {
        name: payload.name,
        whatsapp: payload.whatsapp,
        pension_type: payload.pension_type,
        province: payload.province,
        loan_amount: payload.loan_amount ?? null,
        interested_bank: payload.interested_bank ?? null,
        notes: payload.notes ?? null,
        status: payload.status ?? "new",
      },
    ])
    .select("id")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data.id };
}

export async function deleteLead(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await getInsforgeAdmin().database
    .from("leads")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
