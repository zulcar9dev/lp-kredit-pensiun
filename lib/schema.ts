import { z } from "zod";
import {
  LOAN_MAX,
  LOAN_MIN,
  PENSION_TYPES,
  PENSION_TYPE_DB,
} from "@/lib/constants";

const PHONE_REGEX = /^(?:\+62|62|0)8\d{7,12}$/;

export const APPLICANT_RELATIONS = ["sendiri", "orang_tua"] as const;
export type ApplicantRelation = (typeof APPLICANT_RELATIONS)[number];

export const nameField = z
  .string()
  .trim()
  .min(3, "Mohon isi nama lengkapnya, minimal 3 huruf.")
  .max(100, "Namanya terlalu panjang.");

export const whatsappField = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s\-().]/g, ""))
  .refine((v) => PHONE_REGEX.test(v), {
    message: "Nomornya pakai format Indonesia ya, contoh: 081234567890",
  });

export const leadSchema = z.object({
  name: nameField,
  whatsapp: whatsappField,
  pensionType: z.enum(PENSION_TYPES, {
    message: "Mohon pilih jenis pensiunnya dulu.",
  }),
  applicantRelation: z.enum(APPLICANT_RELATIONS).default("sendiri"),
  loanAmount: z
    .number()
    .int()
    .min(LOAN_MIN, "Nominal minimal Rp 10 juta.")
    .max(LOAN_MAX, "Nominal maksimal Rp 500 juta.")
    .optional(),
  // UU PDP — wajib dicentang sebelum submit
  consent: z.literal(true, {
    message: "Mohon centang persetujuannya dulu ya.",
  }),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;

// ---------------------------------------------------------------------------
// Skema server-side (PRD §8.2). Pola best practice: SATU sumber aturan di
// sini, semua server action + edge function memvalidasi via safeParse dan
// return dini saat gagal. (Edge function Deno memuat mirror skema ini lewat
// npm:zod — lihat functions/submit-lead.ts; jaga keduanya sinkron.)
// ---------------------------------------------------------------------------

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "approved",
  "rejected",
  "invalid",
] as const;

// Nilai DB (snake_case) untuk leads.pension_type — label form dipetakan
// ke sini sebelum parse (lihat pensionLabelToDb).
export const leadDbSchema = z.object({
  name: nameField,
  whatsapp: whatsappField,
  pension_type: z.enum(PENSION_TYPE_DB, {
    message: "Jenis pensiun tidak valid.",
  }),
  applicant_relation: z.enum(APPLICANT_RELATIONS).default("sendiri"),
  loan_amount: z
    .number()
    .int()
    .min(LOAN_MIN, "Nominal minimal Rp 10 juta.")
    .max(LOAN_MAX, "Nominal maksimal Rp 500 juta.")
    .nullish(),
  status: z.enum(LEAD_STATUSES).optional(),
  consent: z.literal(true, {
    message: "Persetujuan wajib dicentang.",
  }),
  notes: z.string().trim().max(2000, "Catatan terlalu panjang.").nullish(),
});

// Varian admin: consent dianggap true (diisi koordinator), status opsional.
export const adminLeadSchema = leadDbSchema
  .omit({ consent: true })
  .extend({ status: z.enum(LEAD_STATUSES).optional() });

export function zodErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Data tidak valid.";
}

export const testimonialServerSchema = z.object({
  name: nameField,
  pension_type: z.string().trim().max(50).nullish(),
  content: z
    .string()
    .trim()
    .min(10, "Isi testimoni minimal 10 karakter.")
    .max(2000, "Isi testimoni terlalu panjang."),
  photo_url: z.string().trim().max(500).nullish(),
  photo_key: z.string().trim().max(500).nullish(),
  rating: z
    .number()
    .int()
    .min(1, "Rating minimal 1.")
    .max(5, "Rating maksimal 5."),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const faqServerSchema = z.object({
  question: z
    .string()
    .trim()
    .min(10, "Pertanyaan minimal 10 karakter.")
    .max(500, "Pertanyaan terlalu panjang."),
  answer: z
    .string()
    .trim()
    .min(10, "Jawaban minimal 10 karakter.")
    .max(5000, "Jawaban terlalu panjang."),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const bankProductServerSchema = z.object({
  bank_name: z
    .string()
    .trim()
    .min(2, "Nama bank minimal 2 karakter.")
    .max(100),
  product_name: z.string().trim().max(150).nullish(),
  plafon_min: z.number().int().min(0).nullish(),
  plafon_max: z.number().int().min(0).nullish(),
  bunga_indikatif: z.number().min(0).max(100).nullish(),
  tenor_min: z.number().int().min(1).max(360).nullish(),
  tenor_max: z.number().int().min(1).max(360).nullish(),
  notes: z.string().trim().max(2000).nullish(),
  logo_url: z.string().trim().max(500).nullish(),
  logo_key: z.string().trim().max(500).nullish(),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export interface LeadPayload extends LeadData {
  event_id?: string;
  fbp?: string | null;
  fbc?: string | null;
  // Honeypot anti-bot (dicek server; kosong untuk manusia)
  website?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}
