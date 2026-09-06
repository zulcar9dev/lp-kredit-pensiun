export const SITE_NAME = "Kredit Pensiun";

export const CTA_LABEL = "Konsultasi via WhatsApp";

export const WA_NUMBER_INTL = "6282189902246";
export const WA_NUMBER_DISPLAY = "0821-8990-2246";
export const WA_PREFILLED_MESSAGE =
  "Halo, saya mau tanya-tanya soal kredit pensiun. Boleh dibantu infonya?";

export const PENSION_TYPES = ["TNI/Polri", "PNS", "BUMN", "Swasta"] as const;
export type PensionType = (typeof PENSION_TYPES)[number];

export const LOAN_MIN = 10_000_000;
export const LOAN_MAX = 500_000_000;
export const LOAN_STEP = 10_000_000;
export const LOAN_DEFAULT = 50_000_000;

export const BANK_DEFAULT_OPTION = "Belum tahu, mohon dicarikan yang cocok";

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
