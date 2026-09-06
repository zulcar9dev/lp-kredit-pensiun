"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import { requireAdmin } from "@/lib/admin-auth";
import type { Lead } from "@/lib/types/database";

export type LeadRow = Omit<Lead, "created_at" | "updated_at"> & {
  created_at: string;
};

export interface LeadFilters {
  status?: string;
  pensionType?: string;
  province?: string;
  interestedBank?: string;
  campaign?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
}

export interface LeadListResult {
  rows: LeadRow[];
  count: number;
}

type FilterBuilder = {
  eq: (col: string, val: string) => FilterBuilder;
  gte: (col: string, val: string) => FilterBuilder;
  lte: (col: string, val: string) => FilterBuilder;
  or: (filters: string) => FilterBuilder;
};

function applyFilters(query: unknown, filters: LeadFilters): unknown {
  let q = query as FilterBuilder;

  if (filters.status) q = q.eq("status", filters.status);
  if (filters.pensionType) q = q.eq("pension_type", filters.pensionType);
  if (filters.province) q = q.eq("province", filters.province);
  if (filters.interestedBank) q = q.eq("interested_bank", filters.interestedBank);
  if (filters.campaign) q = q.eq("utm_campaign", filters.campaign);

  if (filters.search) {
    const term = filters.search.replace(/[%_,"()\\]/g, "").trim();
    if (term) q = q.or(`name.ilike.*${term}*,whatsapp.ilike.*${term}*`);
  }

  if (filters.dateFrom) q = q.gte("created_at", filters.dateFrom);
  if (filters.dateTo) q = q.lte("created_at", filters.dateTo + "T23:59:59");

  return q;
}

export async function fetchLeads(
  filters: LeadFilters = {}
): Promise<LeadListResult> {
  await requireAdmin();

  const limit = filters.limit ?? 10;
  const page = filters.page ?? 1;

  let query = getInsforgeAdmin().database
    .from("leads")
    .select("*", { count: "exact" })
    .is("deleted_at", null);

  query = applyFilters(query, filters) as unknown as typeof query;

  query = query.order("created_at", {
    ascending: filters.sort === "oldest",
  });

  if (filters.limit !== 0) {
    query = query.range((page - 1) * limit, page * limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("fetchLeads error:", error);
    return { rows: [], count: 0 };
  }

  return { rows: (data ?? []) as LeadRow[], count: count ?? 0 };
}

export async function fetchLeadOptions(): Promise<{
  banks: string[];
  campaigns: string[];
}> {
  await requireAdmin();

  const { data } = await getInsforgeAdmin().database
    .from("leads")
    .select("interested_bank,utm_campaign")
    .is("deleted_at", null);

  const banks = new Set<string>();
  const campaigns = new Set<string>();
  for (const row of data ?? []) {
    if (row.interested_bank) banks.add(row.interested_bank);
    if (row.utm_campaign) campaigns.add(row.utm_campaign);
  }

  return {
    banks: [...banks].sort(),
    campaigns: [...campaigns].sort(),
  };
}

export async function exportLeads(
  filters: LeadFilters = {}
): Promise<LeadRow[]> {
  await requireAdmin();

  let query = getInsforgeAdmin().database
    .from("leads")
    .select("*")
    .is("deleted_at", null);

  query = applyFilters(query, filters) as unknown as typeof query;
  query = query.order("created_at", {
    ascending: filters.sort === "oldest",
  });

  const { data, error } = await query.limit(10000);

  if (error) {
    console.error("exportLeads error:", error);
    return [];
  }

  return (data ?? []) as LeadRow[];
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
