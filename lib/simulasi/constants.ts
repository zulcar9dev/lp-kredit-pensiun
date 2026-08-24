export type SimCategory = "purna" | "pra_purna";

export interface SimRateRow {
  category: SimCategory;
  minTenorYears: number;
  maxTenorYears: number;
  rate: number;
}

export const SIM_RATES: SimRateRow[] = [
  { category: "pra_purna", minTenorYears: 0, maxTenorYears: 1, rate: 9.75 },
  { category: "pra_purna", minTenorYears: 1, maxTenorYears: 2, rate: 10.3 },
  { category: "pra_purna", minTenorYears: 2, maxTenorYears: 3, rate: 10.3 },
  { category: "pra_purna", minTenorYears: 3, maxTenorYears: 4, rate: 10.5 },
  { category: "pra_purna", minTenorYears: 4, maxTenorYears: 5, rate: 10.5 },
  { category: "pra_purna", minTenorYears: 5, maxTenorYears: 8, rate: 10.85 },
  { category: "pra_purna", minTenorYears: 8, maxTenorYears: 10, rate: 10.85 },
  { category: "pra_purna", minTenorYears: 10, maxTenorYears: 12, rate: 10.85 },
  { category: "pra_purna", minTenorYears: 12, maxTenorYears: 14, rate: 10.85 },
  { category: "pra_purna", minTenorYears: 14, maxTenorYears: 20, rate: 10.85 },
  { category: "purna", minTenorYears: 0, maxTenorYears: 1, rate: 11 },
  { category: "purna", minTenorYears: 1, maxTenorYears: 2, rate: 11.8 },
  { category: "purna", minTenorYears: 2, maxTenorYears: 3, rate: 11.8 },
  { category: "purna", minTenorYears: 3, maxTenorYears: 4, rate: 11.8 },
  { category: "purna", minTenorYears: 4, maxTenorYears: 5, rate: 11.8 },
  { category: "purna", minTenorYears: 5, maxTenorYears: 8, rate: 12 },
  { category: "purna", minTenorYears: 8, maxTenorYears: 10, rate: 12 },
  { category: "purna", minTenorYears: 10, maxTenorYears: 12, rate: 12 },
  { category: "purna", minTenorYears: 12, maxTenorYears: 14, rate: 12.1 },
  { category: "purna", minTenorYears: 14, maxTenorYears: 15, rate: 12.1 },
];

export const SIM_PARAMS = {
  dsrPercentage: 88,
  maxAgeAtMaturity: 75,
  propisiRatePercent: 1,
  tataLaksanaRatePercent: 3.5,
  biayaAdministrasi: 150_000,
  blokiranWajibExtra: 150_000,
  praPurnaMaxTenorMonths: 240,
} as const;

export const CATEGORY_LABELS: Record<SimCategory, string> = {
  purna: "Sudah Pensiun",
  pra_purna: "Masih Bekerja",
};

export function formatTenorID(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years <= 0) return `${rest} bulan`;
  if (rest === 0) return `${years} tahun`;
  return `${years} tahun ${rest} bulan`;
}
