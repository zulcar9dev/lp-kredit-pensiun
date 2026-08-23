import type { LeadPayload } from "@/lib/schema";

export interface SubmitResult {
  ok: boolean;
  message?: string;
}

export async function submitLead(payload: LeadPayload): Promise<SubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (!payload.name || !payload.whatsapp) {
    return {
      ok: false,
      message: "Data belum lengkap. Mohon periksa kembali formulir Anda.",
    };
  }

  return { ok: true };
}
