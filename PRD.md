# Product Requirements Document (PRD)

## Landing Page Kredit Pensiun — Agen Pemasaran Independen (Meta Ads Campaign)

| Field              | Detail                                              |
| ------------------ | --------------------------------------------------- |
| **Product Name**   | Landing Page Kredit Pensiun (Agen Pemasaran Independen) |
| **Purpose**        | Halaman arahan Meta Ads milik pemasaran independen untuk menghasilkan lead calon peminjam kredit pensiun, lalu mereferalkannya ke produk kredit pensiun dari berbagai bank mitra (BUMN maupun swasta) di seluruh Indonesia |
| **Target Users**   | Semua jenis pensiunan (TNI/Polri, PNS, BUMN/Swasta) |
| **Tech Stack**     | Next.js 14+, Tailwind CSS v3.4, TypeScript, InsForge |
| **Deployment**     | InsForge Deployments (free tier)                    |
| **Status**         | Draft                                               |

---

## 1. Goals & Objectives

### 1.1 Business Goals
- Menghasilkan lead berkualitas calon peminjam kredit pensiun melalui Meta Ads (Facebook & Instagram)
- Mereferalkan lead ke produk kredit pensiun dari bank mitra pilihan (BUMN maupun swasta) yang paling sesuai kebutuhan
- Menurunkan Cost per Lead (CPL) secara bertahap melalui optimasi landing page
- Mengarahkan calon nasabah ke WhatsApp koordinator untuk konsultasi dan pendampingan pengajuan

### 1.2 KPI (Key Performance Indicators)

| KPI                     | Target        | Catatan                           |
| ----------------------- | ------------- | --------------------------------- |
| Conversion Rate         | ≥ 8%          | Form submit / total visitor       |
| Cost per Lead (CPL)     | ≤ Rp 25.000   | Budget iklan Rp 500rb-1jt/bulan   |
| Bounce Rate             | ≤ 40%         | Halaman harus cepat & menarik     |
| Page Load Time (LCP)    | ≤ 2.5 detik   | Kritis untuk Quality Score Meta   |
| Lead per Bulan          | Sesuai budget | Diharapkan 20-40 lead/bln         |

---

## 2. Target Audience

### 2.1 Segmen Utama

| Segmen                  | Usia   | Sumber Dana Pensiun        |
| ----------------------- | ------ | -------------------------- |
| Purnawirawan TNI/Polri  | 60-75  | ASABRI / TASPEN            |
| Pensiunan PNS           | 60-75  | TASPEN                     |
| Pensiunan BUMN/Swasta   | 60-75  | BPJS Ketenagakerjaan / DPLK|

### 2.2 Meta Ads Targeting
- **Usia:** 60–65+ tahun (Meta Ads membatasi usia maksimal di 65+, praktisnya targeting 60-65+ yang tetap menjangkau seluruh demografi 60-75)
- **Lokasi:** Seluruh Indonesia (jangkauan bank mitra di seluruh Indonesia)
- **Interest:** Pensiun, kredit tanpa agunan, keuangan, investasi
- **Platform:** Facebook & Instagram

---

## 3. Landing Page Structure

### 3.1 Sections (Single Page)

| No  | Section              | Prioritas | Deskripsi                                              |
| --- | -------------------- | --------- | ------------------------------------------------------ |
| 1   | **Hero**             | P0        | Headline persona pendamping personal, sub-headline, CTA WhatsApp utama + form |
| 2   | **Keunggulan**       | P0        | 4 poin: gratis konsultasi, pilihan banyak bank, didampingi sampai cair, data aman |
| 3   | **Bank Mitra**       | P0        | Daftar bank & produk dinamis dari admin (nama bank, plafon, bunga indikatif) |
| 4   | **Cara Pengajuan**   | P0        | 3 langkah: Chat WhatsApp -> Dicarikan produk yang cocok -> Didampingi sampai cair |
| 5   | **Testimonial**      | P0        | Slider testimonial nasabah yang sudah cair             |
| 6   | **Form Lead**        | P0        | Nama, WhatsApp, Jenis Pensiun, Provinsi, Nominal, Bank Pilihan (opsional) |
| 7   | **FAQ**              | P1        | 5-8 pertanyaan umum                                    |
| 8   | **Footer**           | P0        | Profil agen independen, disclaimer legal, kontak       |

> Landing page TIDAK menyebutkan satu nama bank sebagai identitas utama dan tidak menampilkan kesan aplikasi perbankan. Identitas halaman adalah agen pemasaran independen; nama bank hanya muncul sebagai informasi produk di section Bank Mitra.

### 3.2 CTA Strategy (WhatsApp Utama)

Audiens 60-75 tahun lebih nyaman berbicara langsung daripada mengisi form.

- **Primary CTA:** "Konsultasi via WhatsApp" -> buka WA koordinator dengan pre-filled message
- **Secondary CTA:** "Ajukan Sekarang" -> scroll ke form
- **Floating CTA:** Tombol WhatsApp sticky di kanan bawah, selalu terlihat
- Pre-filled message: "Halo, saya tertarik dengan informasi kredit pensiun. Boleh minta info?"
- Nomor WhatsApp diambil dari tabel `app_settings` sehingga bisa diganti dari admin panel tanpa deploy ulang (default awal: 082189902246)

### 3.3 Panduan Desain untuk Audiens Senior

Pendekatan seimbang: tetap modern namun mudah dibaca.

- Font ukuran sedang-besar: body 17-18px, headline jelas dan tegas
- Kontras tinggi antara teks dan background
- Tombol besar dan mudah diklik (min 48x48px)
- Navigasi minimal, satu arah scroll ke bawah
- Hindari animasi berlebihan yang membingungkan
- Nomor WhatsApp ditampilkan sebagai teks juga (bisa dicatat/ditelepon)

### 3.4 Persona & Copywriting (Anti-Slop)

**Persona: Pendamping Personal.** Halaman berbicara sebagai orang/tim kecil yang membantu mengurus pengajuan — bukan institusi bank, bukan korporasi besar.

Prinsip penulisan:
1. Formal-hangat dan sederhana: sopan tapi tidak kaku; hindari istilah asing/teknis perbankan (gunakan "cicilan" bukan "installment")
2. Kalimat pendek, percakapan hangat, seperti berbicara langsung dengan Bapak/Ibu
3. Angka dan fakta konkret; hindari janji abstrak ("cepat & mudah" tanpa bukti)
4. Tanpa buzzword, tanpa emoji berlebihan, tanpa klaim "terbaik #1"
5. Nada setara dan menghormati — audiens adalah pensiunan TNI/PNS/BUMN yang berprestasi; jangan menggurui
6. Jujur sebagai agen perantara; tidak menirukan gaya resmi bank

Contoh penerapan:

| Hindari (korporat / AI slop)                          | Gunakan (pendamping personal)                                              |
| ----------------------------------------------------- | -------------------------------------------------------------------------- |
| "Solusi finansial inovatif untuk masa emas Anda!"      | "Sudah pensiun tapi masih butuh dana tambahan? Chat saja, saya bantu urus." |
| "Dapatkan penawaran eksklusif #1 dari bank terpercaya!" | "Saya carikan produk dari beberapa bank mitra, nanti dipilihkan yang paling pas." |
| "Proses cepat mudah tanpa ribet!!"                      | "Cukup chat WhatsApp. Sisanya kami yang urus sampai dana cair."             |

Contoh headline hero:
- "Sudah Pensiun, Masih Butuh Dana? Saya Bantu Urus Sampai Cair."
- Sub-headline: "Gratis konsultasi. Ada pilihan produk dari beberapa bank mitra, disesuaikan dengan dana pensiun Bapak/Ibu."

### 3.5 Form Fields (Sekunder)

| Field             | Type     | Required | Validasi                        |
| ----------------- | -------- | -------- | ------------------------------- |
| Nama Lengkap      | Text     | Ya       | Min 3 karakter                  |
| No. WhatsApp      | Phone    | Ya       | Format Indonesia (08xxx/+62xxx) |
| Jenis Pensiun     | Select   | Ya       | TNI/Polri, PNS, BUMN, Swasta    |
| Provinsi          | Select   | Ya       | 38 provinsi Indonesia           |
| Nominal Pinjaman  | Range    | Tidak    | Slider Rp 10jt - Rp 500jt       |
| Bank Pilihan      | Select   | Tidak    | Dinamis dari daftar bank aktif di `bank_products` (opsi "Belum tahu, mohon dicarikan yang cocok" sebagai default) |

### 3.6 Technical Requirements
- **Responsiveness:** Mobile-first (70%+ traffic mobile)
- **Performance:** LCP <= 2.5s, CLS <= 0.1, INP <= 200ms
- **Meta Pixel:** Install + Conversions API (server-side)
- **Events:** PageView, ViewContent, Lead, Contact
- **UTM:** Capture all UTM parameters from URL
- **SEO:** Meta tags, OG tags, structured data

---

## 4. Admin Panel

### 4.1 Authentication
- **1 akun admin** (koordinator)
- Email + password login via InsForge Auth
- Session timeout 30 menit

### 4.2 CRUD: Konten Landing Page

| Operation | Deskripsi                                              |
| --------- | ------------------------------------------------------ |
| Create    | Tambah section baru (testimonial, FAQ, keunggulan)     |
| Read      | Lihat daftar semua section dengan preview              |
| Update    | Edit teks, gambar, urutan, status publish/draft        |
| Delete    | Hapus section (soft delete)                            |

**Fields:** title, content (rich text), image (max 2MB, jpg/png/webp), order, status

### 4.3 CRUD: Bank Mitra & Produk (Baru)

| Operation | Deskripsi                                              |
| --------- | ------------------------------------------------------ |
| Create    | Tambah bank mitra beserta produk kredit pensiunnya     |
| Read      | Daftar bank mitra dengan status aktif/nonaktif         |
| Update    | Edit nama bank, plafon, bunga indikatif, tenor, urutan |
| Delete    | Hapus bank mitra (soft delete dengan konfirmasi)       |

**Fields:** bank_name, product_name, plafon_min, plafon_max, bunga_indikatif (dengan catatan wajib "indikatif"), tenor_min, tenor_max, logo_url (opsional, max 1MB), display_order, is_active

> Data di tabel ini menjadi sumber section **Bank Mitra** di landing page dan opsi "Bank Pilihan" di form lead. Jika tidak ada bank aktif, section Bank Mitra otomatis disembunyikan.

### 4.4 CRUD: Data Lead

| Operation | Deskripsi                                              |
| --------- | ------------------------------------------------------ |
| Create    | Auto-created dari form landing page, bisa input manual |
| Read      | Daftar lead dengan filter, search, sort, pagination    |
| Update    | Update status follow-up, tambah catatan                |
| Delete    | Soft delete dengan konfirmasi                          |

**Fields:** name, whatsapp, pension_type, province, loan_amount, interested_bank (opsional), status, UTM params, notes

**Filter:** status, jenis pensiun, provinsi, bank pilihan, date range, campaign
**Search:** nama, no WhatsApp
**Export:** Excel (.xlsx)

### 4.5 CRUD: Testimonial & FAQ
- Testimonial: nama, jenis pensiun, isi, foto, rating, urutan
- **Catatan:** Section testimonial di landing page dibuat dengan struktur lengkap, namun konten dikosongkan dulu sampai koordinator menyiapkan data asli nasabah. Jika kosong, section otomatis disembunyikan dari landing page.
- FAQ: pertanyaan, jawaban, urutan, status

### 4.6 Pengaturan Umum (Baru)

Pengaturan situs yang bisa diubah koordinator tanpa edit kode / deploy ulang:

| Setting Key    | Deskripsi                                       | Default Awal                    |
| -------------- | ----------------------------------------------- | ------------------------------- |
| wa_number      | Nomor WhatsApp tujuan CTA (format internasional) | 082189902246                    |
| site_title     | Judul situs / nama agen yang ditampilkan         | -                               |
| wa_greeting    | Teks pre-filled message WhatsApp                 | Sesuai 3.2                      |

> Disimpan di tabel `app_settings` (key-value). Perubahan langsung berlaku di landing page.

### 4.7 Dashboard
- Total leads, leads hari ini
- Leads per status (chart)
- Leads per provinsi (chart/map)
- Leads per bank pilihan (chart)
- Leads per kampanye UTM (chart)

---

## 5. Meta Ads Integration

### 5.1 Pixel Events

| Event              | Trigger                    | Parameters       |
| ------------------ | -------------------------- | ---------------- |
| PageView           | Halaman dimuat             | -                |
| ViewContent        | Scroll >= 50%              | content_name     |
| Lead               | Form berhasil di-submit    | content_name     |
| Contact            | Tombol WhatsApp diklik     | content_name     |

### 5.2 Conversions API (Server-Side)
- Kirim event Lead secara server-side sebagai backup (iOS 14+)
- Hash data user (phone) untuk Advanced Matching
- Deduplication dengan event_id

### 5.3 UTM Parameter Flow

```
Meta Ads URL:
https://domain.com?utm_source=facebook&utm_medium=paid&utm_campaign=kredit_pensiun&utm_content=variant_a&utm_term=pensiunan_pns

-> Data tersimpan di tabel leads:
  source: "facebook"
  medium: "paid"
  campaign: "kredit_pensiun"
  content: "variant_a"
  term: "pensiunan_pns"
```

---

## 6. Database Schema (InsForge PostgreSQL)

### leads

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  pension_type TEXT NOT NULL,
  province TEXT NOT NULL,
  loan_amount INTEGER,
  interested_bank TEXT,
  status TEXT DEFAULT 'new',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  notes TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### bank_products

```sql
CREATE TABLE bank_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name TEXT NOT NULL,
  product_name TEXT,
  plafon_min BIGINT,
  plafon_max BIGINT,
  bunga_indikatif NUMERIC(5,2),
  tenor_min INTEGER,
  tenor_max INTEGER,
  notes TEXT,
  logo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### app_settings

```sql
CREATE TABLE app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### sections

```sql
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type TEXT NOT NULL,
  title TEXT,
  content JSONB,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### testimonials

```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pension_type TEXT,
  content TEXT NOT NULL,
  photo_url TEXT,
  rating INTEGER DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### faq

```sql
CREATE TABLE faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### campaign_settings

```sql
CREATE TABLE campaign_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  pixel_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. Tech Architecture (InsForge)

### 7.1 Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | Next.js 14+ (App Router)            |
| Styling        | Tailwind CSS v3.4                   |
| Language       | TypeScript                          |
| Form           | React Hook Form + Zod               |
| Database       | InsForge PostgreSQL                 |
| ORM/Client     | @insforge/sdk                       |
| Auth           | InsForge Auth                       |
| Storage        | InsForge Storage (images)           |
| Deployment     | InsForge Deployments                |
| Export         | xlsx library (Excel)                |

### 7.2 InsForge Setup

```bash
# Create project
npx -y @insforge/cli create

# Get credentials
npx -y @insforge/cli secrets get ANON_KEY

# .env.local
NEXT_PUBLIC_INSFORGE_URL=https://<project>.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=<anon-key>
INSFORGE_URL=https://<project>.insforge.app
INSFORGE_API_KEY=<api-key>
```

### 7.3 Deploy

```bash
# Build local
npm run build

# Deploy to InsForge
npx -y @insforge/cli deployments env set NEXT_PUBLIC_INSFORGE_URL <url>
npx -y @insforge/cli deployments env set NEXT_PUBLIC_INSFORGE_ANON_KEY <key>
npx -y @insforge/cli deployments deploy .
```

**Domain:** Subdomain InsForge gratis (misal: `lp-pensiunku.insforge.app`). Custom domain dapat ditambahkan nanti jika diperlukan via `npx -y @insforge/cli domains`.

---

## 8. Security & Compliance

### 8.1 Security
- HTTPS wajib
- Rate limiting form: max 5 per IP per jam
- Input validation server-side (Zod)
- RLS policies pada semua tabel

### 8.2 Legal & Compliance (Agen Independen)

Halaman ini milik pemasaran independen — BUKAN aplikasi/situs resmi bank. Aturan wajib:

- Disclaimer posisi di footer, wajib tampil jelas:
  "Website ini dikelola oleh agen pemasaran independen dan bukan bagian dari bank mana pun. Persetujuan kredit sepenuhnya merupakan wewenang bank."
- Penyebutan OJK memakai teks netral di section Bank Mitra/footer:
  "Produk kredit ditawarkan oleh bank mitra yang terdaftar dan diawasi oleh Otoritas Jasa Keuangan (OJK)."
  — tanpa menampilkan logo OJK seolah situs ini lembaga terdaftar
- Dilarang menggunakan logo/nama resmi bank sebagai identitas situs; nama bank hanya sebagai informasi produk di section Bank Mitra
- Bunga dan biaya dari `bank_products` wajib diberi label "indikatif" + catatan "syarat dan ketentuan berlaku"
- Transparansi bunga dan biaya
- Privacy Policy & Terms

---

## 9. Page Performance Budget

| Metric                  | Target    |
| ----------------------- | --------- |
| First Contentful Paint  | <= 1.5s   |
| Largest Contentful Paint| <= 2.5s   |
| Cumulative Layout Shift | <= 0.1    |
| Total Page Size         | <= 1.5MB  |
| Total Requests          | <= 30     |

---

## 10. Project Timeline

| Phase                           | Durasi    | Deliverable                          |
| ------------------------------- | --------- | ------------------------------------ |
| Setup & Design                  | 1 minggu  | InsForge setup, wireframe, UI design |
| Landing Page Development        | 2 minggu  | LP lengkap + Meta Pixel integration  |
| Admin CRUD Development          | 2 minggu  | Admin panel + export Excel           |
| Integration & Testing           | 1 minggu  | CAPI, end-to-end testing, QA        |
| Launch                          | 3 hari    | Deploy ke InsForge, setup iklan     |
| **Total**                       | **~6 minggu** |                                  |

---

## 11. Success Criteria

- [ ] Landing page load time <= 2.5 detik di mobile
- [ ] Form submission berfungsi dan data tersimpan di database
- [ ] WhatsApp CTA membuka chat koordinator dengan pre-filled message
- [ ] Meta Pixel tracking semua event (PageView, ViewContent, Lead, Contact)
- [ ] Conversions API mengirim event Lead server-side
- [ ] Admin bisa login, CRUD konten, CRUD bank mitra, lihat leads, export Excel
- [ ] Nomor WhatsApp bisa diganti dari menu Pengaturan tanpa deploy ulang
- [ ] Section Bank Mitra tersinkron dengan data `bank_products`; otomatis tersembunyi jika kosong
- [ ] UTM parameters ter-capture di setiap lead
- [ ] Disclaimer agen independen dan teks netral OJK tampil di footer
- [ ] Tidak ada nama bank sebagai identitas situs; tidak ada kesan aplikasi perbankan
- [ ] Responsif di semua ukuran layar
- [ ] Tidak ada error di console browser

---

## 12. Future Enhancements

- A/B testing framework untuk headline dan CTA
- WhatsApp Business API (auto-reply notifikasi)
- Multi-marketer portal dengan kode referral (?ref=nama) untuk atribusi lead per marketer
- Multi-landing page support
- Email notifikasi ke admin saat lead baru
- Analytics dashboard data Meta Ads (CPL, ROAS)

---

## 13. Open Questions

| No | Pertanyaan                                                 | Status     | Jawaban                              |
| -- | ---------------------------------------------------------- | ---------- | ------------------------------------ |
| 1  | No. WhatsApp koordinator untuk CTA WhatsApp?               | Answered   | 082189902246 (bisa diganti via admin) |
| 2  | Penyebutan OJK di landing page?                            | Answered   | Teks netral: bank mitra terdaftar & diawasi OJK |
| 3  | Contoh testimonial nasabah yang akan ditampilkan?          | Answered   | Section dibuat, dikosongkan dulu     |
| 4  | Domain khusus untuk landing page? (atau subdomain InsForge) | Answered   | Subdomain InsForge gratis           |
| 5  | Daftar awal bank mitra & produk untuk diinput ke admin?    | **Open**   | Menunggu data dari koordinator       |

> Open questions no. 1-4 telah terjawab per 2026-08-23. No. 5 dibutuhkan sebelum launch (seed data section Bank Mitra), namun tidak menghalangi development.

---

## 14. Decision Log

| Tanggal    | Keputusan                                              | Alasan                                        |
| ---------- | ------------------------------------------------------ | --------------------------------------------- |
| 2026-08-23 | Usia target diubah dari 45-65 menjadi 60-75 tahun      | Penyesuaian demografi produk                  |
| 2026-08-23 | CTA utama: WhatsApp, form menjadi sekunder             | Audiens senior lebih nyaman bicara langsung   |
| 2026-08-23 | Section simulasi kredit dihapus                        | Terlalu kompleks untuk audiens senior         |
| 2026-08-23 | Desain: seimbang (modern tapi mudah dibaca)            | Font sedang-besar, kontras tinggi             |
| 2026-08-23 | Gaya bahasa: formal-hangat sederhana                   | Sesuai dengan audiens pensiunan               |
| 2026-08-23 | Compliance OJK: logo + teks umum tanpa nomor izin      | Cukup "Terdaftar dan Diawasi oleh OJK"        |
| 2026-08-23 | Testimonial: section dibuat, konten dikosongkan dulu   | Menunggu data asli dari koordinator           |
| 2026-08-23 | Domain: subdomain InsForge gratis                      | Start cepat, hemat biaya (budget terbatas)    |
| 2026-08-23 | Reposisi: agen pemasaran independen multi-bank; hapus identitas BNI dari seluruh halaman | Hindari kesan aplikasi perbankan dan risiko legal penggunaan nama bank |
| 2026-08-23 | Section baru "Bank Mitra" + tabel `bank_products`      | Daftar bank dinamis, dikelola via admin tanpa deploy ulang |
| 2026-08-23 | Nomor WhatsApp dipindah ke `app_settings`              | Koordinator bisa ganti nomor dari admin panel |
| 2026-08-23 | Persona copywriting: pendamping personal + prinsip anti-slop | Natural untuk audiens senior; sesuai model referal |
| 2026-08-23 | Form lead + leads: kolom opsional bank pilihan         | Membantu rekomendasi produk saat follow-up    |

---

*Document ini bersifat living document dan akan diupdate di kemudian hari.*