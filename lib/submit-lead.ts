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
      console.error("submit-lead error:", error);
      const code = (error as { error?: string }).error;
      const status = (error as { statusCode?: number }).statusCode;
      if (
        code === "NETWORK_ERROR" ||
        status === 0 ||
        error.message?.includes("Failed to fetch")
      ) {
        return {
          ok: false,
          message:
            "Koneksi internet tidak stabil. Periksa jaringan lalu coba lagi.",
        };
      }
      if (code === "REQUEST_TIMEOUT" || status === 408) {
        return {
          ok: false,
          message: "Server sedang sibuk. Mohon coba beberapa saat lagi.",
        };
      }
      if (status === 429) {
        return {
          ok: false,
          message:
            "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.",
        };
      }
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
  } catch (err) {
    console.error("submit-lead unexpected:", err);
    return {
      ok: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}
