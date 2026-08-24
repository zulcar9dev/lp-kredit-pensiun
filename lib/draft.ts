const DRAFT_KEY = "lp-pensiunku:draft";

export interface LeadDraft {
  name?: string;
  whatsapp?: string;
  loanAmount?: number;
}

export function saveLeadDraft(draft: LeadDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // penyimpanan tidak tersedia, biarkan kosong
  }
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

export function takeLeadDraftLoanAmount(): number | undefined {
  if (typeof window === "undefined") return undefined;
  const draft = readLeadDraft();
  if (typeof draft.loanAmount !== "number") return undefined;
  saveLeadDraft({ name: draft.name, whatsapp: draft.whatsapp });
  return draft.loanAmount;
}
