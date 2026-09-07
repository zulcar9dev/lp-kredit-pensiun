const DRAFT_KEY = "lp-pensiunku:draft";

export interface LeadDraft {
  name?: string;
  whatsapp?: string;
}

export function readLeadDraft(): LeadDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as LeadDraft) : {};
  } catch {
    return {};
  }
}

export function clearLeadDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // penyimpanan tidak tersedia, biarkan kosong
  }
}
