export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  pension_type: string;
  province: string;
  loan_amount: number | null;
  interested_bank: string | null;
  status: "new" | "contacted" | "processed" | "closed";
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  notes: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface BankProduct {
  id: string;
  bank_name: string;
  product_name: string | null;
  plafon_min: number | null;
  plafon_max: number | null;
  bunga_indikatif: number | null;
  tenor_min: number | null;
  tenor_max: number | null;
  notes: string | null;
  logo_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface AppSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  updated_at: string;
}

export interface Section {
  id: string;
  section_type: string;
  title: string | null;
  content: Record<string, unknown> | null;
  image_url: string | null;
  display_order: number;
  status: "published" | "draft";
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  pension_type: string | null;
  content: string;
  photo_url: string | null;
  rating: number;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  status: "published" | "draft";
  created_at: string;
}

export interface CampaignSetting {
  id: string;
  campaign_name: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  pixel_id: string | null;
  is_active: boolean;
  created_at: string;
}
