import { z } from "zod";
import { PENSION_TYPES } from "@/lib/constants";

const PHONE_REGEX = /^(?:\+62|62|0)8\d{7,12}$/;

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
  province: z.string().min(1, "Mohon pilih provinsinya dulu."),
  loanAmount: z.number().int().min(0).optional(),
  interestedBank: z.string().trim().max(120).optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;

export interface LeadPayload extends LeadData {
  interested_bank?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}
