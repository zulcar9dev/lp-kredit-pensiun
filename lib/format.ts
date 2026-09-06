export function formatRupiah(value: number | null): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function formatRupiahShort(value: number): string {
  if (value >= 1_000_000_000) {
    const miliar = value / 1_000_000_000;
    return `Rp ${trimFraction(miliar)} miliar`;
  }
  if (value >= 1_000_000) {
    const juta = value / 1_000_000;
    return `Rp ${trimFraction(juta)} juta`;
  }
  return formatRupiah(value);
}

function trimFraction(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1).replace(".", ",");
}
