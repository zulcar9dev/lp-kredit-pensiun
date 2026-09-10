"use server";

import { getInsforgeAdmin } from "@/lib/insforge";
import { requireAdmin } from "@/lib/admin-auth";
import { normalizeToE164 } from "@/lib/phone";
import { pensionLabelToDb } from "@/lib/constants";
import { adminLeadSchema, zodErrorMessage } from "@/lib/schema";
import type { Lead } from "@/lib/types/database";

export type LeadRow = Omit<Lead, "created_at" | "updated_at"> & {
  created_at: string;
};

export interface LeadFilters {
  status?: string;
  pensionType?: string;
  applicantRelation?: string;
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
  if (filters.applicantRelation) {
    q = q.eq("applicant_relation", filters.applicantRelation);
  }
  if (filters.campaign) q = q.eq("utm_campaign", filters.campaign);

  if (filters.search) {
    const term = filters.search.replace(/[%_,"()\\]/g, "").trim();
    if (term) {
      // Nomor tersimpan E.164 — cocokkan juga input lokal 08…
      const e164 = normalizeToE164(term).replace(/\D/g, "");
      const orParts = [`name.ilike.*${term}*`];
      if (/^62/.test(e164)) orParts.push(`whatsapp.ilike.*${e164}*`);
      orParts.push(`whatsapp.ilike.*${term.replace(/\D/g, "") || term}*`);
      q = q.or(orParts.join(","));
    }
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
  campaigns: string[];
}> {  await requireAdmin();

  const { data } = await getInsforgeAdmin().database
    .from("leads")
    .select("utm_campaign")
    .is("deleted_at", null);

  const campaigns = new Set<string>();
  for (const row of data ?? []) {
    if (row.utm_campaign) campaigns.add(row.utm_campaign);
  }

  return {
    campaigns: [...campaigns].sort(),
  };
}

// PRD §6.3 + §5: deteksi & penandaan lead duplikat (nomor sama > 1×
// di baris aktif). Dipakai admin sebagai banner peringatan.
export async function fetchDuplicateGroups(): Promise<
  { whatsapp: string; count: number }[]
> {
  await requireAdmin();

  const { data } = await getInsforgeAdmin().database
    .from("leads")
    .select("whatsapp")
    .is("deleted_at", null)
    .limit(10000);

  const counts = new Map<string, number>();
  for (const row of (data ?? []) as { whatsapp: string }[]) {
    if (!row.whatsapp) continue;
    counts.set(row.whatsapp, (counts.get(row.whatsapp) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, c]) => c > 1)
    .map(([whatsapp, count]) => ({ whatsapp, count }))
    .sort((a, b) => b.count - a.count);
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
  payload: Partial<
    Pick<
      Lead,
      | "name"
      | "whatsapp"
      | "pension_type"
      | "applicant_relation"
      | "loan_amount"
      | "status"
      | "notes"
    >
  >
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  // PRD §5: normalisasi label ("TNI/Polri") ke snake_case ("tni_polri")
  const rawPension = payload.pension_type
    ? (pensionLabelToDb(payload.pension_type) ?? payload.pension_type)
    : undefined;
  // PRD §8.2 (best practice: safeParse + early return)
  const parsed = adminLeadSchema.partial().safeParse({
    ...payload,
    ...(rawPension ? { pension_type: rawPension } : {}),
  });
  if (!parsed.success) {
    return { ok: false, error: zodErrorMessage(parsed.error) };
  }
  // Bangun objek update hanya dari key yang dikirim (agar default Zod
  // tak menimpa kolom yang tidak diubah).
  const update: Record<string, unknown> = {};
  if (payload.name !== undefined) update.name = parsed.data.name;
  if (payload.pension_type !== undefined)
    update.pension_type = parsed.data.pension_type;
  if (payload.applicant_relation !== undefined)
    update.applicant_relation = parsed.data.applicant_relation;
  if (payload.loan_amount !== undefined)
    update.loan_amount = parsed.data.loan_amount;
  if (payload.status !== undefined) update.status = parsed.data.status;
  if (payload.notes !== undefined) update.notes = parsed.data.notes;
  const { error } = await getInsforgeAdmin().database
    .from("leads")
    .update({
      ...update,
      ...(payload.whatsapp
        ? { whatsapp: normalizeToE164(payload.whatsapp) }
        : {}),
    })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function createLead(
  payload: Pick<Lead, "name" | "whatsapp" | "pension_type"> &
    Partial<
      Pick<
        Lead,
        "applicant_relation" | "loan_amount" | "notes" | "status"
      >
    >
): Promise<{ ok: boolean; error?: string; id?: string }> {
  await requireAdmin();
  const parsed = adminLeadSchema.safeParse({
    ...payload,
    pension_type:
      pensionLabelToDb(payload.pension_type) ?? payload.pension_type,
  });
  if (!parsed.success) {
    return { ok: false, error: zodErrorMessage(parsed.error) };
  }
  const v = parsed.data;
  const { data, error } = await getInsforgeAdmin().database
    .from("leads")
    .insert([
      {
        name: v.name,
        whatsapp: normalizeToE164(v.whatsapp),
        pension_type: v.pension_type,
        applicant_relation: v.applicant_relation,
        consent: true,
        consent_at: new Date().toISOString(),
        loan_amount: v.loan_amount ?? null,
        notes: v.notes ?? null,
        status: v.status ?? "new",
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
