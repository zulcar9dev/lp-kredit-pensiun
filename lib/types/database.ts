export interface Lead {
  id: string;
  name: string;
  whatsapp: string; // E.164: 628…
  // PRD §5: snake_case — 'pns' | 'tni_polri' | 'bumn' | 'swasta'
  pension_type: string;
  applicant_relation: "sendiri" | "orang_tua";
  province: string | null; // legacy (form v2 tidak lagi mengumpulkan)
  loan_amount: number | null;
  interested_bank: string | null; // legacy
  status: "new" | "contacted" | "qualified" | "approved" | "rejected" | "invalid";
  consent: boolean;
  consent_at: string | null;
  event_id: string | null;
  fbp: string | null;
  fbc: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  notes: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface WaClick {
  id: string;
  event_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  fbp: string | null;
  fbc: string | null;
  lead_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// DEPRECATED 2026-09-12: tabel bank_products dihapus permanen (keputusan
// anti-penolakan Meta). Tipe disisakan sebagai alias agar import lama tidak
// meledak saat transisi; hapus total setelah semua referensi bersih.
export type BankProduct = Record<string, never>;

export interface AppSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  pension_type: string | null;
  content: string;
  photo_url: string | null;
  photo_key: string | null;
  rating: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  deleted_at?: string | null;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  deleted_at?: string | null;
}
