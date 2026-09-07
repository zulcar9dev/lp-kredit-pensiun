import type { PensionType } from "@/lib/constants";
import type { UtmParams } from "@/lib/utm";
import { formatRupiah } from "@/lib/format";

export function buildWaLink(
  settings: { waNumberIntl: string; waGreeting: string },
  options?: { message?: string }
): string {
  const text = options?.message ?? settings.waGreeting;
  return `https://wa.me/${settings.waNumberIntl}?text=${encodeURIComponent(text)}`;
}

// Route internal untuk tracking CAPI "Contact" sebelum redirect ke wa.me
export const CONTACT_WA_PATH = "/api/contact-wa";

export function buildContactWaUrl(params: {
  eid: string;
  utm?: UtmParams;
  fbc?: string | null;
  leadRef?: string | null;
}): string {
  const search = new URLSearchParams();
  search.set("eid", params.eid);
  for (const [key, value] of Object.entries(params.utm ?? {})) {
    if (value) search.set(key, value);
  }
  if (params.fbc) search.set("fbc", params.fbc);
  if (params.leadRef) search.set("lead", params.leadRef);
  return `${CONTACT_WA_PATH}?${search.toString()}`;
}

export function buildWaLeadMessage(data: {
  name: string;
  pensionType: PensionType | "";
  forParent?: boolean;
  loanAmount?: number;
}): string {
  const nominal = data.loanAmount ? formatRupiah(data.loanAmount) : "-";
  return [
    `Halo, saya ${data.name} barusan mengisi formulir di website.`,
    "",
    "Mohon dicek ya, saya minta dibantu carikan produk kredit pensiun yang cocok.",
    "",
    `Jenis pensiun: ${data.pensionType || "-"}`,
    `Pengajuan untuk: ${data.forParent ? "Orang tua" : "Diri sendiri"}`,
    `Nominal yang dibutuhkan: ${nominal}`,
  ].join("\n");
}
