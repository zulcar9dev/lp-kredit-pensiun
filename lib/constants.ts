export const SITE_NAME = "Kredit Pensiun";

export const CTA_LABEL = "Konsultasi via WhatsApp";

export const WA_NUMBER_INTL = "628189902246";
export const WA_NUMBER_DISPLAY = "0821-8990-2246";
export const WA_PREFILLED_MESSAGE =
  "Halo, saya tertarik dengan informasi kredit pensiun. Boleh minta info?";

export const PENSION_TYPES = ["TNI/Polri", "PNS", "BUMN", "Swasta"] as const;
export type PensionType = (typeof PENSION_TYPES)[number];

export const LOAN_MIN = 10_000_000;
export const LOAN_MAX = 500_000_000;
export const LOAN_STEP = 10_000_000;
export const LOAN_DEFAULT = 50_000_000;

export const BANK_DEFAULT_OPTION = "Belum tahu, mohon direkomendasikan";

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
      "Tanya-tanya dulu tidak dipungut biaya. Kami jelaskan pelan-pelan sampai Bapak/Ibu paham, tanpa tekanan.",
  },
  {
    icon: "banks",
    title: "Ada pilihan banyak bank",
    description:
      "Kami carikan produk dari beberapa bank mitra, lalu dibandingkan mana yang paling pas untuk pensiun Bapak/Ibu.",
  },
  {
    icon: "accompany",
    title: "Didampingi sampai cair",
    description:
      "Dari chat pertama sampai dana masuk rekening, ada orang yang menemani dan bisa ditanya kapan saja.",
  },
  {
    icon: "safety",
    title: "Data Bapak/Ibu aman",
    description:
      "Data hanya dipakai untuk mencarikan produk yang cocok dan tidak dibagikan ke pihak yang tidak berkepentingan.",
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
      "Klik tombol hijau WhatsApp atau isi formulir singkat. Ceritakan saja kebutuhan Bapak/Ibu dengan santai.",
  },
  {
    label: "Dicarikan produk yang cocok",
    title: "Dibandingkan satu per satu",
    description:
      "Produk dari beberapa bank mitra kami bandingkan plafon dan cicilannya, disesuaikan dengan dana pensiun Bapak/Ibu.",
  },
  {
    label: "Didampingi sampai cair",
    title: "Ditemani sampai selesai",
    description:
      "Berkas diurus bersama-sama. Kalau ada yang membingungkan, tanyakan saja kapan pun, kami siap membantu.",
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
      "Bukan. Website ini dikelola oleh agen pemasaran independen yang bertugas membantu menghubungkan Bapak/Ibu dengan produk kredit pensiun dari beberapa bank mitra. Keputusan persetujuan kredit tetap sepenuhnya di tangan bank.",
  },
  {
    question: "Apa itu kredit pensiun?",
    answer:
      "Kredit pensiun adalah fasilitas pinjaman bagi Anda yang sudah menerima dana pensiun. Dana pensiun menjadi dasar pengajuan sehingga prosesnya biasanya lebih ringan dibanding pinjaman lain.",
  },
  {
    question: "Saya pensiunan TNI atau Polri, boleh mengajukan?",
    answer:
      "Boleh. Layanan ini terbuka untuk pensiunan TNI/Polri, PNS, serta karyawan BUMN dan swasta. Pilih jenis pensiun pada formulir, nanti kami bantu carikan produk dari bank mitra yang sesuai.",
  },
  {
    question: "Apakah harus menyerahkan sertifikat rumah atau BPK mobil?",
    answer:
      "Tergantung produk dari bank mitranya. Saat konsultasi, kami jelaskan persyaratannya dengan jelas lebih dulu, baru Bapak/Ibu putuskan mau lanjut atau tidak.",
  },
  {
    question: "Bagaimana cara menghitung cicilan saya?",
    answer:
      "Kami buatkan simulasi dari beberapa bank mitra sekaligus, lengkap dengan besar cicilannya. Semua angka kami jelaskan terbuka sebelum Bapak/Ibu mengambil keputusan apa pun.",
  },
  {
    question: "Saya tidak terbiasa memakai WhatsApp, bagaimana?",
    answer:
      "Tidak perlu khawatir. Bapak/Ibu juga bisa menelepon langsung ke nomor yang tertera di halaman ini, atau minta anak/cucu membantu menekan tombol hijau WhatsApp.",
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
