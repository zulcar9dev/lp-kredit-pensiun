export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  pensionType: string;
  province: string;
  loanAmount: number;
  interestedBank: string;
  status: "new" | "contacted" | "processed" | "closed";
  utmSource: string;
  utmCampaign: string;
  notes: string;
  createdAt: string;
}

export interface BankProduct {
  id: string;
  bankName: string;
  productName: string;
  plafonMin: number;
  plafonMax: number;
  bungaIndikatif: number;
  tenorMin: number;
  tenorMax: number;
  logoUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Section {
  id: string;
  sectionType: string;
  title: string;
  content: string;
  imageUrl: string;
  displayOrder: number;
  status: "published" | "draft";
}

export interface Testimonial {
  id: string;
  name: string;
  pensionType: string;
  content: string;
  photoUrl: string;
  rating: number;
  isFeatured: boolean;
  displayOrder: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
  status: "published" | "draft";
}

export interface AppSetting {
  id: string;
  settingKey: string;
  settingValue: string;
}

export const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    name: "Budi Santoso",
    whatsapp: "081234567890",
    pensionType: "PNS",
    province: "DKI Jakarta",
    loanAmount: 150_000_000,
    interestedBank: "BSI Griya Ijarah",
    status: "new",
    utmSource: "facebook",
    utmCampaign: "kredit_pensiun_pns",
    notes: "",
    createdAt: "2026-08-28T08:00:00Z",
  },
  {
    id: "2",
    name: "Siti Rahayu",
    whatsapp: "082198765432",
    pensionType: "TNI/Polri",
    province: "Jawa Barat",
    loanAmount: 200_000_000,
    interestedBank: "Bank BJB DPrometerai",
    status: "contacted",
    utmSource: "facebook",
    utmCampaign: "kredit_pensiun_tni",
    notes: "Sudah dihubungi, menunggu dokumen",
    createdAt: "2026-08-27T10:30:00Z",
  },
  {
    id: "3",
    name: "Ahmad Hidayat",
    whatsapp: "08567891234",
    pensionType: "BUMN",
    province: "Jawa Timur",
    loanAmount: 100_000_000,
    interestedBank: "",
    status: "new",
    utmSource: "instagram",
    utmCampaign: "kredit_pensiun_bumn",
    notes: "",
    createdAt: "2026-08-27T14:15:00Z",
  },
  {
    id: "4",
    name: "Dewi Lestari",
    whatsapp: "087812345678",
    pensionType: "Swasta",
    province: "Sumatera Utara",
    loanAmount: 75_000_000,
    interestedBank: "Bank Sumut Simara",
    status: "processed",
    utmSource: "facebook",
    utmCampaign: "kredit_pensiun_umum",
    notes: "Dokumen sudah lengkap, proses di bank",
    createdAt: "2026-08-26T09:00:00Z",
  },
  {
    id: "5",
    name: "Rudi Hermawan",
    whatsapp: "081345678901",
    pensionType: "PNS",
    province: "Jawa Tengah",
    loanAmount: 300_000_000,
    interestedBank: "Bank Jateng BKK",
    status: "new",
    utmSource: "facebook",
    utmCampaign: "kredit_pensiun_pns",
    notes: "",
    createdAt: "2026-08-26T11:45:00Z",
  },
  {
    id: "6",
    name: "Putri Wulandari",
    whatsapp: "082345678912",
    pensionType: "TNI/Polri",
    province: "Kalimantan Selatan",
    loanAmount: 125_000_000,
    interestedBank: "Bank Kalsel",
    status: "contacted",
    utmSource: "instagram",
    utmCampaign: "kredit_pensiun_tni",
    notes: "Chat via WhatsApp, tertarik dengan Bank Kalsel",
    createdAt: "2026-08-25T16:20:00Z",
  },
  {
    id: "7",
    name: "Hendra Pratama",
    whatsapp: "085123456789",
    pensionType: "BUMN",
    province: "Sulawesi Selatan",
    loanAmount: 180_000_000,
    interestedBank: "Bank BJB DPrometerai",
    status: "closed",
    utmSource: "facebook",
    utmCampaign: "kredit_pensiun_bumn",
    notes: "Kredit sudah cair",
    createdAt: "2026-08-25T13:00:00Z",
  },
  {
    id: "8",
    name: "Ratna Sari",
    whatsapp: "087890123456",
    pensionType: "Swasta",
    province: "Bali",
    loanAmount: 50_000_000,
    interestedBank: "",
    status: "new",
    utmSource: "instagram",
    utmCampaign: "kredit_pensiun_umum",
    notes: "",
    createdAt: "2026-08-24T08:30:00Z",
  },
  {
    id: "9",
    name: "Joko Widodo",
    whatsapp: "081267890123",
    pensionType: "PNS",
    province: "Papua",
    loanAmount: 250_000_000,
    interestedBank: "Bank Papua",
    status: "processed",
    utmSource: "facebook",
    utmCampaign: "kredit_pensiun_pns",
    notes: "Menunggu persetujuan bank",
    createdAt: "2026-08-24T10:00:00Z",
  },
  {
    id: "10",
    name: "Ani Kusuma",
    whatsapp: "082145678901",
    pensionType: "TNI/Polri",
    province: "NTB",
    loanAmount: 90_000_000,
    interestedBank: "Bank NTB Syariah",
    status: "new",
    utmSource: "facebook",
    utmCampaign: "kredit_pensiun_tni",
    notes: "",
    createdAt: "2026-08-23T15:45:00Z",
  },
];

export const MOCK_BANK_PRODUCTS: BankProduct[] = [
  {
    id: "bp-1",
    bankName: "Bank BJB",
    productName: "DPrometerai",
    plafonMin: 50_000_000,
    plafonMax: 300_000_000,
    bungaIndikatif: 0.85,
    tenorMin: 12,
    tenorMax: 60,
    logoUrl: "",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "bp-2",
    bankName: "Bank Jateng",
    productName: "BKK Pensiun",
    plafonMin: 25_000_000,
    plafonMax: 200_000_000,
    bungaIndikatif: 0.9,
    tenorMin: 12,
    tenorMax: 48,
    logoUrl: "",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "bp-3",
    bankName: "Bank Kalsel",
    productName: "Kredit Sejahtera",
    plafonMin: 20_000_000,
    plafonMax: 150_000_000,
    bungaIndikatif: 0.8,
    tenorMin: 12,
    tenorMax: 60,
    logoUrl: "",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "bp-4",
    bankName: "Bank NTB Syariah",
    productName: "Murabahah Pensiun",
    plafonMin: 30_000_000,
    plafonMax: 250_000_000,
    bungaIndikatif: 0.75,
    tenorMin: 12,
    tenorMax: 60,
    logoUrl: "",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: "bp-5",
    bankName: "BSI",
    productName: "Griya Ijarah",
    plafonMin: 50_000_000,
    plafonMax: 500_000_000,
    bungaIndikatif: 0.95,
    tenorMin: 12,
    tenorMax: 120,
    logoUrl: "",
    displayOrder: 5,
    isActive: true,
  },
  {
    id: "bp-6",
    bankName: "Bank Sumut",
    productName: "Simara",
    plafonMin: 20_000_000,
    plafonMax: 100_000_000,
    bungaIndikatif: 0.85,
    tenorMin: 12,
    tenorMax: 48,
    logoUrl: "",
    displayOrder: 6,
    isActive: true,
  },
  {
    id: "bp-7",
    bankName: "Bank Papua",
    productName: "Kredit Pensiun",
    plafonMin: 15_000_000,
    plafonMax: 120_000_000,
    bungaIndikatif: 0.8,
    tenorMin: 12,
    tenorMax: 60,
    logoUrl: "",
    displayOrder: 7,
    isActive: false,
  },
  {
    id: "bp-8",
    bankName: "Bank Nagari",
    productName: "Kariba",
    plafonMin: 25_000_000,
    plafonMax: 180_000_000,
    bungaIndikatif: 0.75,
    tenorMin: 12,
    tenorMax: 60,
    logoUrl: "",
    displayOrder: 8,
    isActive: true,
  },
];

export const MOCK_SECTIONS: Section[] = [
  {
    id: "s-1",
    sectionType: "hero",
    title: "Sudah Pensiun, Masih Butuh Dana?",
    content: "Saya bantu urus pengajuan kredit pensiun Bapak/Ibu dari awal sampai cair.",
    imageUrl: "",
    displayOrder: 1,
    status: "published",
  },
  {
    id: "s-2",
    sectionType: "keunggulan",
    title: "Mengapa Percaya Kami?",
    content: "4 keunggulan: gratis konsultasi, pilihan banyak bank, didampingi sampai cair, data aman.",
    imageUrl: "",
    displayOrder: 2,
    status: "published",
  },
  {
    id: "s-3",
    sectionType: "bank_mitra",
    title: "Bank Mitra & Produk",
    content: "Daftar bank mitra yang tersedia.",
    imageUrl: "",
    displayOrder: 3,
    status: "published",
  },
  {
    id: "s-4",
    sectionType: "cara_pengajuan",
    title: "3 Langkah Mudah",
    content: "Chat WhatsApp → Dicarikan produk cocok → Didampingi sampai cair.",
    imageUrl: "",
    displayOrder: 4,
    status: "published",
  },
  {
    id: "s-5",
    sectionType: "testimonial",
    title: "Kata Mereka yang Sudah Cair",
    content: "Testimonial dari nasabah yang sudah berhasil.",
    imageUrl: "",
    displayOrder: 5,
    status: "draft",
  },
  {
    id: "s-6",
    sectionType: "form_lead",
    title: "Ajukan Sekarang",
    content: "Form pengajuan kredit pensiun.",
    imageUrl: "",
    displayOrder: 6,
    status: "published",
  },
  {
    id: "s-7",
    sectionType: "faq",
    title: "Pertanyaan yang Sering Diajukan",
    content: "FAQ tentang kredit pensiun.",
    imageUrl: "",
    displayOrder: 7,
    status: "published",
  },
  {
    id: "s-8",
    sectionType: "footer",
    title: "Kontak & Disclaimer",
    content: "Footer dengan profil agen independen dan disclaimer legal.",
    imageUrl: "",
    displayOrder: 8,
    status: "published",
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "Sudirman",
    pensionType: "PNS",
    content:
      "Prosesnya mudah. Saya chat WhatsApp, besoknya sudah ada yang hubungi. Sekarang cicilan sudah jalan.",
    photoUrl: "",
    rating: 5,
    isFeatured: true,
    displayOrder: 1,
  },
  {
    id: "t-2",
    name: "Kartini",
    pensionType: "TNI/Polri",
    content:
      "Awalnya ragu, ternyata benar dibantu sampai cair. Terima kasih.",
    photoUrl: "",
    rating: 5,
    isFeatured: false,
    displayOrder: 2,
  },
  {
    id: "t-3",
    name: "Bambang S.",
    pensionType: "BUMN",
    content:
      "Saya pensiunan BUMN, kredit cair dalam 5 hari kerja. Recommended.",
    photoUrl: "",
    rating: 4,
    isFeatured: true,
    displayOrder: 3,
  },
  {
    id: "t-4",
    name: "Ratna",
    pensionType: "Swasta",
    content:
      "Sudah ditolak bank lain, tapi di sini bisa dibantu cari produk yang cocok.",
    photoUrl: "",
    rating: 5,
    isFeatured: false,
    displayOrder: 4,
  },
  {
    id: "t-5",
    name: "Agus W.",
    pensionType: "PNS",
    content:
      "Pelayanan ramah. Diajukan ke Bank Jateng, bunganya ringan.",
    photoUrl: "",
    rating: 4,
    isFeatured: false,
    displayOrder: 5,
  },
  {
    id: "t-6",
    name: "Sari Dewi",
    pensionType: "TNI/Polri",
    content:
      "Cair tepat waktu sesuai yang dijanjikan. Cocok untuk pensiunan.",
    photoUrl: "",
    rating: 5,
    isFeatured: false,
    displayOrder: 6,
  },
];

export const MOCK_FAQS: FaqItem[] = [
  {
    id: "f-1",
    question: "Siapa yang mengelola halaman ini?",
    answer:
      "Kami adalah agen pemasaran independen. Kami membantu menghubungkan Bapak/Ibu dengan produk kredit pensiun dari bank mitra.",
    displayOrder: 1,
    status: "published",
  },
  {
    id: "f-2",
    question: "Apakah saya harus membayar untuk konsultasi?",
    answer:
      "Tidak. Konsultasi lewat WhatsApp gratis. Kami hanya membantu pengurusan — Bapak/Ibu tidak dikenakan biaya apapun.",
    displayOrder: 2,
    status: "published",
  },
  {
    id: "f-3",
    question: "Bank apa saja yang bisa membantu?",
    answer:
      "Kami bekerja sama dengan beberapa bank mitra, baik BUMN maupun swasta, di seluruh Indonesia. Produk akan disesuaikan dengan kebutuhan Bapak/Ibu.",
    displayOrder: 3,
    status: "published",
  },
  {
    id: "f-4",
    question: "Bagaimana proses pengajuannya?",
    answer:
      "Cukup chat WhatsApp. Saya bantu carikan produk yang cocok, lalu dampingi sampai dana cair. Tidak perlu datang ke bank.",
    displayOrder: 4,
    status: "published",
  },
  {
    id: "f-5",
    question: "Berapa lama prosesnya sampai cair?",
    answer:
      "Waktu proses tergantung bank mitra. Biasanya 3-10 hari kerja setelah dokumen lengkap. Lebih cepat jika data sudah siap.",
    displayOrder: 5,
    status: "published",
  },
  {
    id: "f-6",
    question: "Apakah data saya aman?",
    answer:
      "Ya. Data Bapak/Ibu hanya dipakai untuk pengajuan kredit dan tidak dibagikan ke pihak yang tidak berkepentingan.",
    displayOrder: 6,
    status: "published",
  },
];

export const MOCK_SETTINGS: AppSetting[] = [
  { id: "set-1", settingKey: "wa_number", settingValue: "082189902246" },
  {
    id: "set-2",
    settingKey: "site_title",
    settingValue: "Kredit Pensiun Indonesia",
  },
  {
    id: "set-3",
    settingKey: "wa_greeting",
    settingValue:
      "Halo, saya tertarik dengan informasi kredit pensiun. Boleh minta info?",
  },
];
