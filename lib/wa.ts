import type { PensionType } from "@/lib/constants";
import { type AppSettings } from "@/lib/settings";
import { formatRupiah } from "@/lib/format";

export function buildWaLink(
  settings: AppSettings,
  options?: { message?: string }
): string {
  const text = options?.message ?? settings.waGreeting;
  return `https://wa.me/${settings.waNumberIntl}?text=${encodeURIComponent(text)}`;
}

export function buildWaSimulationMessage(data: {
  categoryLabel: string;
  income: number;
  tenorMonths: number;
  plafonMaks: number;
  angsuran: number;
}): string {
  const years = Math.floor(data.tenorMonths / 12);
  const months = data.tenorMonths % 12;
  const tenorText = months > 0 ? `${years} tahun ${months} bulan` : `${years} tahun`;
  return [
    "Halo, saya barusan mencoba simulasi kredit pensiun di website.",
    "",
    "Hasil simulasinya:",
    `Status: ${data.categoryLabel}`,
    `Pendapatan per bulan: ${formatRupiah(data.income)}`,
    `Tenor dipilih: ${tenorText}`,
    `Estimasi plafon maksimal: ${formatRupiah(data.plafonMaks)}`,
    `Estimasi angsuran per bulan: ${formatRupiah(data.angsuran)}`,
    "",
    "Mohon dibantu jelaskan lebih detail ya. Terima kasih.",
  ].join("\n");
}

export function buildWaLeadMessage(data: {
  name: string;
  pensionType: PensionType | "";
  province: string;
  loanAmount?: number;
}): string {
  const nominal = data.loanAmount ? formatRupiah(data.loanAmount) : "-";
  return [
    `Halo, saya ${data.name} barusan mengisi formulir di website.`,
    "",
    "Mohon dicek ya, saya minta dibantu carikan produk kredit pensiun yang cocok.",
    "",
    `Jenis pensiun: ${data.pensionType || "-"}`,
    `Provinsi: ${data.province || "-"}`,
    `Nominal yang dibutuhkan: ${nominal}`,
  ].join("\n");
}
