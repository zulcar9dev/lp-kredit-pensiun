export const SITE_NAME = "Kredit Pensiun";

export const CTA_LABEL = "Konsultasi via WhatsApp";

export const WA_NUMBER_INTL = "6282189902246";
export const WA_NUMBER_DISPLAY = "0821-8990-2246";
export const WA_PREFILLED_MESSAGE =
  "Halo, saya mau tanya-tanya soal kredit pensiun. Boleh dibantu infonya?";

export const PENSION_TYPES = ["TNI/Polri", "PNS", "BUMN", "Swasta"] as const;
export type PensionType = (typeof PENSION_TYPES)[number];

// PRD §3.3 — chips preset nominal (tanpa slider, ramah motorik lansia)
export const LOAN_MIN = 10_000_000;
export const LOAN_MAX = 500_000_000;
export const LOAN_PRESETS = [
  25_000_000,
  50_000_000,
  100_000_000,
  200_000_000,
  300_000_000,
] as const;

export const APPLICANT_RELATION_OPTIONS = [
  { value: "sendiri", label: "Untuk diri sendiri" },
  { value: "orang_tua", label: "Untuk orang tua" },
] as const;

export const CONSENT_TEXT =
  "Saya setuju data saya (nama, nomor WhatsApp) diproses untuk dihubungi terkait informasi produk kredit pensiun.";

export const WA_OFFICE_HOURS = "08.00–21.00 WIB";

export const LEGAL = {
  agentDisclaimer:
    "Website ini dikelola oleh agen pemasaran independen dan bukan bagian dari bank mana pun. Persetujuan kredit sepenuhnya merupakan wewenang bank.",
  ojkNeutralLine:
    "Produk kredit ditawarkan oleh bank mitra yang terdaftar dan diawasi oleh Otoritas Jasa Keuangan (OJK).",
  indicativeNote: "Angka indikatif, syarat dan ketentuan berlaku.",
  generalDisclaimer:
    "Informasi di halaman ini bersifat umum dan bukan penawaran resmi.",
};

export interface Advantage {
  icon: "consult" | "banks" | "accompany" | "safety";
  title: string;
  description: string;
}

export const ADVANTAGES: Advantage[] = [
  {
    icon: "consult",
    title: "Gratis konsultasi",
    description:
      "Boleh tanya-tanya dulu sebelum memutuskan apa pun. Gratis, dan saya jelaskan pelan-pelan sampai benar-benar jelas.",
  },
  {
    icon: "banks",
    title: "Ada pilihan banyak bank",
    description:
      "Saya bandingkan produk dari beberapa bank mitra sekaligus, lalu tunjukkan mana yang paling cocok dengan dana pensiun Bapak/Ibu.",
  },
  {
    icon: "accompany",
    title: "Didampingi sampai cair",
    description:
      "Dari chat pertama sampai dana masuk rekening, ada orang yang menemani dan bisa dihubungi kapan saja. Tidak perlu mengurus sendiri.",
  },
  {
    icon: "safety",
    title: "Data Bapak/Ibu aman",
    description:
      "Data hanya dipakai mencarikan produk yang cocok. Tidak dijual, tidak disebar ke pihak yang tidak berkepentingan.",
  },
];

export interface Step {
  label: string;
  title: string;
  description: string;
}

export const STEPS: Step[] = [
  {
    label: "Chat WhatsApp",
    title: "Mulai dari sapaan ramah",
    description:
      "Klik tombol hijau WhatsApp atau isi formulir singkat. Ceritakan saja kebutuhan Bapak/Ibu, tidak perlu resmi-resmi.",
  },
  {
    label: "Dicarikan produk yang cocok",
    title: "Dibandingkan satu per satu",
    description:
      "Plafon dan cicilan dari tiap bank mitra saya bandingkan, lalu saya tunjukkan mana yang paling pas untuk dana pensiun Bapak/Ibu.",
  },
  {
    label: "Didampingi sampai cair",
    title: "Ditemani sampai selesai",
    description:
      "Surat dan berkas diurus berdua, langkah demi langkah. Ada yang membingungkan? Tanya saja kapan pun.",
  },
];
