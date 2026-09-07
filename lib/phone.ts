// Sumber tunggal normalisasi nomor WhatsApp Indonesia.
// Hasil akhir: E.164 tanpa tanda plus, contoh 6281234567890.

export function normalizeToE164(raw: string): string {
  const cleaned = raw.replace(/[\s\-().]/g, "");
  if (cleaned.startsWith("+62")) return cleaned.slice(1);
  if (cleaned.startsWith("62")) return cleaned;
  if (cleaned.startsWith("0")) return "62" + cleaned.slice(1);
  return cleaned;
}

// Validasi longgar untuk input admin (bukan validasi form publik)
export function isValidWaNumberE164(value: string): boolean {
  return /^62[0-9]{9,13}$/.test(normalizeToE164(value));
}
