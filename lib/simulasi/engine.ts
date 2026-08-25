import {
  SIM_PARAMS,
  SIM_RATES,
  formatTenorID,
  type SimCategory,
} from "./constants";

export interface SimulationInput {
  category: SimCategory;
  income: number;
  birthDate: string;
  retirementDate?: string;
  tenorMonths: number;
}

export interface AgeDetail {
  years: number;
  months: number;
  days: number;
}

export interface SimulationResult {
  eligible: boolean;
  error?: string;
  ratePercent: number;
  plafonMaks: number;
  angsuran: number;
  biayaPropisi: number;
  biayaTataLaksana: number;
  biayaAdministrasi: number;
  totalBiaya: number;
  blokiranWajib: number;
  blokiranPraPurna: number;
  totalBlokiran: number;
  sisaBulanAktif: number;
  danaDiterima: number;
  usiaYears: number;
  usiaMonths: number;
  tenorMonthsUsed: number;
  maxTenorMonths: number;
  maturityAgeMonths: number;
}

export function computeAgeDetail(
  birthDate: Date,
  referenceDate: Date,
): AgeDetail | null {
  if (isNaN(birthDate.getTime()) || isNaN(referenceDate.getTime())) return null;
  if (referenceDate <= birthDate) return { years: 0, months: 0, days: 0 };

  let years = referenceDate.getFullYear() - birthDate.getFullYear();
  let months = referenceDate.getMonth() - birthDate.getMonth();
  let days = referenceDate.getDate() - birthDate.getDate();
  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      0,
    ).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}

export function getNearestAgeMonths(
  birthDate: Date,
  referenceDate: Date,
): number {
  const detail = computeAgeDetail(birthDate, referenceDate);
  if (!detail) return 0;
  let months = detail.years * 12 + detail.months;
  if (detail.days > 0) months += 1;
  return Math.max(0, months);
}

export function getMaxTenorMonths(
  category: SimCategory,
  nearestAgeMonths: number,
): number {
  const base = Math.max(
    0,
    SIM_PARAMS.maxAgeAtMaturity * 12 - nearestAgeMonths - 2,
  );
  return category === "pra_purna"
    ? Math.min(SIM_PARAMS.praPurnaMaxTenorMonths, base)
    : base;
}

function lookupRate(category: SimCategory, tenorYears: number): number {
  const match = SIM_RATES.find(
    (row) =>
      row.category === category &&
      tenorYears > row.minTenorYears &&
      tenorYears <= row.maxTenorYears,
  );
  return match ? match.rate : 0;
}

function calculateAnnuity(
  principal: number,
  annualRate: number,
  tenorYears: number,
): number {
  if (principal <= 0 || tenorYears <= 0) return 0;
  const n = Math.round(tenorYears * 12);
  if (n <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
}

function calculateMaxPrincipal(
  maxAnnuity: number,
  annualRate: number,
  tenorYears: number,
): number {
  if (maxAnnuity <= 0 || tenorYears <= 0) return 0;
  const n = Math.round(tenorYears * 12);
  if (n <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return maxAnnuity * n;
  return (maxAnnuity * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
}

function monthsUntil(referenceDate: Date, targetDate: Date): number {
  const diffTime = targetDate.getTime() - referenceDate.getTime();
  if (diffTime <= 0) return 0;
  const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.4375);
  return Math.max(0, Math.round(diffMonths));
}

function ineligible(
  error: string,
  usiaYears: number,
  usiaMonths: number,
  maxTenorMonths: number,
  tenorMonthsUsed: number,
): SimulationResult {
  return {
    eligible: false,
    error,
    ratePercent: 0,
    plafonMaks: 0,
    angsuran: 0,
    biayaPropisi: 0,
    biayaTataLaksana: 0,
    biayaAdministrasi: 0,
    totalBiaya: 0,
    blokiranWajib: 0,
    blokiranPraPurna: 0,
    totalBlokiran: 0,
    sisaBulanAktif: 0,
    danaDiterima: 0,
    usiaYears,
    usiaMonths,
    tenorMonthsUsed,
    maxTenorMonths,
    maturityAgeMonths: usiaYears * 12 + usiaMonths + tenorMonthsUsed,
  };
}

export function simulate(input: SimulationInput): SimulationResult {
  const dsrPercentage = SIM_PARAMS.dsrPercentage / 100;
  const referenceDate = new Date();

  const birthDate = new Date(input.birthDate);
  const nearestAgeMonths = isNaN(birthDate.getTime())
    ? 0
    : getNearestAgeMonths(birthDate, referenceDate);
  const usiaYears = Math.floor(nearestAgeMonths / 12);
  const usiaMonths = nearestAgeMonths % 12;

  const maxTenorMonths = getMaxTenorMonths(input.category, nearestAgeMonths);
  const tenorMonthsUsed = Math.max(0, Math.round(input.tenorMonths));

  if (maxTenorMonths <= 0) {
    return ineligible(
      "Usia Bapak/Ibu sudah melewati batas usia maksimal pembiayaan.",
      usiaYears,
      usiaMonths,
      maxTenorMonths,
      tenorMonthsUsed,
    );
  }

  if (
    tenorMonthsUsed <= 0 ||
    tenorMonthsUsed > maxTenorMonths
  ) {
    return ineligible(
      `Tenor maksimal untuk usia ${usiaYears} tahun ${usiaMonths} bulan adalah ${formatTenorID(maxTenorMonths)} (${maxTenorMonths} bulan).`,
      usiaYears,
      usiaMonths,
      maxTenorMonths,
      tenorMonthsUsed,
    );
  }

  const rateVal = lookupRate(input.category, tenorMonthsUsed / 12);

  const angsuranMaks = input.income * dsrPercentage;
  const plafonRaw = calculateMaxPrincipal(
    angsuranMaks,
    rateVal,
    tenorMonthsUsed / 12,
  );
  const plafonMaks = Math.floor(plafonRaw / 1_000_000) * 1_000_000;

  if (plafonMaks <= 0) {
    return ineligible(
      "Dengan pendapatan yang diisi ini, kapasitasnya belum cukup untuk mengajukan pinjaman.",
      usiaYears,
      usiaMonths,
      maxTenorMonths,
      tenorMonthsUsed,
    );
  }

  const angsuran = Math.round(
    calculateAnnuity(plafonMaks, rateVal, tenorMonthsUsed / 12),
  );

  const biayaPropisi = Math.round(plafonMaks * (SIM_PARAMS.propisiRatePercent / 100));
  const biayaTataLaksana = Math.round(
    plafonMaks * (SIM_PARAMS.tataLaksanaRatePercent / 100),
  );
  const biayaAdministrasi = SIM_PARAMS.biayaAdministrasi;
  const totalBiaya = biayaPropisi + biayaTataLaksana + biayaAdministrasi;

  const blokiranWajib = Math.round(2 * angsuran + SIM_PARAMS.blokiranWajibExtra);

  let sisaBulanAktif = 0;
  let blokiranPraPurna = 0;
  if (input.category === "pra_purna" && input.retirementDate) {
    const retirementDate = new Date(input.retirementDate);
    sisaBulanAktif = monthsUntil(referenceDate, retirementDate);
    blokiranPraPurna = Math.round(angsuran * sisaBulanAktif);
  }

  const totalBlokiran = blokiranWajib + blokiranPraPurna;
  const danaDiterima = plafonMaks - totalBiaya - totalBlokiran;

  return {
    eligible: true,
    ratePercent: rateVal,
    plafonMaks,
    angsuran,
    biayaPropisi,
    biayaTataLaksana,
    biayaAdministrasi,
    totalBiaya,
    blokiranWajib,
    blokiranPraPurna,
    totalBlokiran,
    sisaBulanAktif,
    danaDiterima,
    usiaYears,
    usiaMonths,
    tenorMonthsUsed,
    maxTenorMonths,
    maturityAgeMonths: nearestAgeMonths + tenorMonthsUsed,
  };
}
