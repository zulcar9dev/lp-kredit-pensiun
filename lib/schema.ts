import { z } from "zod";
import { LOAN_MAX, LOAN_MIN, PENSION_TYPES } from "@/lib/constants";

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
