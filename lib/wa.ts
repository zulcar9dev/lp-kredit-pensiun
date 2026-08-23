import type { PensionType } from "@/lib/constants";
import { getAppSettings } from "@/lib/settings";
import { formatRupiah } from "@/lib/format";

export function buildWaLink(options?: { message?: string }): string {
  const settings = getAppSettings();
  const text = options?.message ?? settings.waGreeting;
  return `https://wa.me/${settings.waNumberIntl}?text=${encodeURIComponent(text)}`;
}

export function buildWaLeadMessage(data: {
  name: string;
  pensionType: PensionType | "";
  province: string;
  loanAmount?: number;
}): string {
  const nominal = data.loanAmount ? formatRupiah(data.loanAmount) : "-";
  return [
    `Halo, saya ${data.name} tadi sudah mengisi formulir di website.`,
    "",
    "Mohon dicek ya, saya ingin dibantu carikan produk kredit pensiun yang cocok.",
    "",
    `Jenis pensiun: ${data.pensionType || "-"}`,
    `Provinsi: ${data.province || "-"}`,
    `Nominal yang dibutuhkan: ${nominal}`,
  ].join("\n");
}
