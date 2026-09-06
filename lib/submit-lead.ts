import { insforge } from "@/lib/insforge";
import type { LeadPayload } from "@/lib/schema";

export interface SubmitResult {
  ok: boolean;
  message?: string;
}

export async function submitLead(payload: LeadPayload): Promise<SubmitResult> {
  try {
    const { data, error } = await insforge.functions.invoke("submit-lead", {
      method: "POST",
      body: {
        name: payload.name,
        whatsapp: payload.whatsapp,
        pension_type: payload.pensionType,
        province: payload.province,
        loan_amount: payload.loanAmount,
        interested_bank: payload.interested_bank,
        utm_source: payload.utm_source,
        utm_medium: payload.utm_medium,
        utm_campaign: payload.utm_campaign,
        utm_content: payload.utm_content,
        utm_term: payload.utm_term,
      },
    });

    if (error) {
      return {
        ok: false,
        message: error.message || "Gagal mengirim data. Silakan coba lagi.",
      };
    }

    if (data?.error) {
      return {
        ok: false,
        message: data.error,
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}
