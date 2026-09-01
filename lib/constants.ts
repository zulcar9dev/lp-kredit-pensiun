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

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "Apakah website ini situs resmi bank?",
    answer:
      "Bukan. Website ini dikelola agen pemasaran independen yang membantu Bapak/Ibu menemukan produk kredit pensiun dari beberapa bank mitra. Persetujuan kredit tetap sepenuhnya wewenang bank.",
  },
  {
    question: "Apa itu kredit pensiun?",
    answer:
      "Sederhananya, pinjaman yang cicilannya dipotong langsung dari dana pensiun. Karena pembayarannya melekat pada dana pensiun, persyaratannya biasanya lebih ringan daripada pinjaman biasa.",
  },
  {
    question: "Saya pensiunan TNI atau Polri, boleh mengajukan?",
    answer:
      "Boleh. Layanan ini untuk pensiunan TNI/Polri, PNS, BUMN, dan swasta. Pilih saja jenis pensiun di formulir, nanti dicarikan produk bank mitra yang sesuai.",
  },
  {
    question: "Apakah harus menyerahkan sertifikat rumah atau BPK mobil?",
    answer:
      "Tergantung produk bank mitranya. Saat konsultasi, persyaratannya dijelaskan lebih dulu secara lengkap. Baru setelah itu Bapak/Ibu putuskan mau lanjut atau tidak.",
  },
  {
    question: "Bagaimana cara menghitung cicilan saya?",
    answer:
      "Paling gampang, coba halaman simulasi di website ini atau tanyakan langsung lewat WhatsApp. Cicilan dari beberapa bank mitra bisa dibuatkan perbandingannya, dan semua angka dijelaskan terbuka sebelum ada keputusan.",
  },
  {
    question: "Saya tidak terbiasa memakai WhatsApp, bagaimana?",
    answer:
      "Tenang, tidak harus lewat WhatsApp. Boleh juga telepon langsung ke nomor yang tertera di halaman ini. Kalau perlu, minta anak atau cucu menekan tombolnya sekali saja.",
  },
];

export interface Testimonial {
  name: string;
  pensionType: string;
  content: string;
  photoUrl: string | null;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [];
