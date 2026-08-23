export interface BankProduct {
  id: string;
  bankName: string;
  productName?: string;
  plafonMin?: number;
  plafonMax?: number;
  bungaIndikatif?: number;
  tenorMinYears?: number;
  tenorMaxYears?: number;
  notes?: string;
  logoUrl?: string;
  displayOrder: number;
}

const SHOW_MOCK = process.env.NEXT_PUBLIC_SHOW_MOCK_BANKS === "true";

const MOCK_BANK_PRODUCTS: BankProduct[] = [
  {
    id: "mock-bni",
    bankName: "Bank Negara Indonesia",
    productName: "Kredit Pensiun BNI",
    plafonMin: 10_000_000,
    plafonMax: 500_000_000,
    bungaIndikatif: 6.5,
    tenorMinYears: 3,
    tenorMaxYears: 15,
    displayOrder: 1,
  },
  {
    id: "mock-bri",
    bankName: "Bank Rakyat Indonesia",
    productName: "Kupedes Pensiun",
    plafonMin: 10_000_000,
    plafonMax: 300_000_000,
    bungaIndikatif: 7.0,
    tenorMinYears: 3,
    tenorMaxYears: 12,
    displayOrder: 2,
  },
  {
    id: "mock-btn",
    bankName: "Bank Tabungan Negara",
    productName: "Kredit Pensiunan",
    plafonMin: 10_000_000,
    plafonMax: 200_000_000,
    bungaIndikatif: 7.75,
    tenorMinYears: 3,
    tenorMaxYears: 10,
    displayOrder: 3,
  },
];

export function getActiveBankProducts(): BankProduct[] {
  return SHOW_MOCK
    ? [...MOCK_BANK_PRODUCTS].sort((a, b) => a.displayOrder - b.displayOrder)
    : [];
}
