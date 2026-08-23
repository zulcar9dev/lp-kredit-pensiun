import { z } from "zod";
import { PENSION_TYPES } from "@/lib/constants";

const PHONE_REGEX = /^(?:\+62|62|0)8\d{7,12}$/;

export const nameField = z
  .string()
  .trim()
  .min(3, "Mohon isi nama lengkap Anda, minimal 3 huruf.")
  .max(100, "Nama terlalu panjang.");

export const whatsappField = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s\-().]/g, ""))
  .refine((v) => PHONE_REGEX.test(v), {
    message: "Gunakan nomor Indonesia, contoh: 081234567890",
  });

export const leadSchema = z.object({
  name: nameField,
  whatsapp: whatsappField,
  pensionType: z.enum(PENSION_TYPES, {
    message: "Mohon pilih jenis pensiun Anda.",
  }),
  province: z.string().min(1, "Mohon pilih provinsi Anda."),
  loanAmount: z.number().int().min(0).optional(),
  interestedBank: z.string().trim().max(120).optional(),
});

export const miniLeadSchema = z.object({
  name: nameField,
  whatsapp: whatsappField,
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;
export type MiniLeadInput = z.input<typeof miniLeadSchema>;
export type MiniLeadData = z.output<typeof miniLeadSchema>;

export interface LeadPayload extends LeadData {
  interested_bank?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}
