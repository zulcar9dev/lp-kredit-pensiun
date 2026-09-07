# Product Requirements Document (PRD)

## Landing Page Kredit Pensiun — Agen Pemasaran Independen (Meta Ads Campaign)

| Field              | Detail                                              |
| ------------------ | --------------------------------------------------- |
| **Product Name**   | Landing Page Kredit Pensiun (Agen Pemasaran Independen) |
| **Purpose**        | Halaman arahan Meta Ads milik pemasaran independen untuk menghasilkan lead calon peminjam kredit pensiun, mereferalkannya ke produk kredit pensiun dari bank mitra (BUMN/Swasta), dan mengarahkan konsultasi langsung via WhatsApp. |
| **Target Users**   | Segmen A: Pensiunan TNI/Polri, PNS, BUMN/Swasta (60–75 tahun). Segmen B: Anak/Mantu Pensiunan (35–50 tahun) sebagai perantara digital. |
| **Budget Iklan**   | Rp 500.000 – Rp 1.000.000 / bulan (Facebook & Instagram) |
| **Tech Stack**     | Next.js 14+ (App Router), Tailwind CSS v3.4, TypeScript, InsForge SDK |
| **Deployment**     | InsForge Deployments — Fase trial: subdomain InsForge. Sebelum scale: custom domain + verifikasi domain Meta (lihat §9) |
| **Status**         | Revised Draft v2 — KPI terukur, spesifikasi CAPI lengkap, kepatuhan UU PDP, konsistensi schema |

---

## 1. Goals & Objectives

### 1.1 Business Goals

- Menghasilkan lead berkualitas calon peminjam kredit pensiun melalui Meta Ads (Facebook & Instagram).
- Mereferalkan lead ke produk kredit pensiun bank mitra yang paling sesuai dengan profil nasabah.
- Mengoptimalkan konversi dengan pengalaman pengguna yang ramah lansia dan ramah perangkat mobile.
- Mengarahkan calon nasabah langsung ke WhatsApp koordinator untuk pendampingan personal.

### 1.2 KPI (Terukur & Budget-Aware)

| KPI                        | Definisi                                  | Target Initial     | Target Optimasi | Cara Audit                          |
| -------------------------- | ----------------------------------------- | ------------------ | --------------- | ----------------------------------- |
| **CVR Form (macro)**       | Lead form / total visitor                 | ≥ 5%               | ≥ 8%            | Meta Events Manager + tabel `leads` |
| **Click-WA Rate (micro)**  | Klik CTA WA unik / total visitor          | ≥ 3%               | ≥ 6%            | Tabel `wa_clicks` + Events Manager  |
| **Konversi Gabungan**      | (Form + Klik WA) / total visitor          | ≥ 8%               | ≥ 12%           | Gabungan dua metrik di atas         |
| **Cost per Lead (CPL)**    | Spend iklan / lead valid                  | Rp 35.000–50.000   | ≤ Rp 30.000     | Ads Manager + DB (manual, v1)       |
| **Valid Lead Rate**        | Lead terhubung via WA / total lead        | ≥ 60%              | ≥ 75%           | Status follow-up di admin           |
| **Page Load (LCP)**        | Core Web Vitals mobile                    | ≤ 2.0 detik        | ≤ 1.5 detik     | PageSpeed Insights                  |
| **WA Response Time**       | Balasan pertama ke lead baru              | ≤ 10 menit         | ≤ 5 menit       | Sampling manual mingguan koordinator |

Catatan operasional:

- Ekspektasi volume: budget Rp 500rb–1jt/bulan → **10–25 lead/bulan** pada CPL Rp 35–50rb.
- SLA WA hanya berlaku pada **jam operasional 08.00–21.00 WIB**. Copy halaman wajib menyebutkan jam operasional ("Dibalas cepat setiap hari 08.00–21.00"); di luar jam, ekspektasi "akan dibalas besok pagi".
- Bounce rate tidak dijadikan KPI utama (traffic iklan umumnya 50–70%); gunakan engagement rate Meta/GA4 sebagai indikator sekunder.

---

## 2. Target Audience & Meta Ads Strategy

### 2.1 Segmen Audiens

| Segmen                        | Usia    | Deskripsi                                                                 |
| ----------------------------- | ------- | ------------------------------------------------------------------------- |
| **A — Penerima Manfaat**      | 60–75   | Pensiunan TNI/Polri, PNS, BUMN/Swasta; sumber dana TASPEN/ASABRI/DPLK.    |
| **B — Perantara Digital**     | 35–50   | Anak/mantu pensiunan yang aktif di medsos dan membantu orang tua mencari solusi pembiayaan; sering menjadi pengisi form. |

### 2.2 Meta Ads Targeting Set

- **Targeting Demografi A (Lansia):** Usia 60–65+ | Minat: TASPEN, ASABRI, Pegawai Negeri Sipil, Pensiun.
- **Targeting Demografi B (Anak/Mantu):** Usia 35–50 | Minat: Keuangan Keluarga, Pinjaman, Investasi, TASPEN, PNS.
- **Format Creative:** Gambar tunggal teks besar kontras tinggi, serta video penjelasan pendek (20–30 detik) dari konsultan ramah.

### 2.3 Meta Ads Policy Notes (Wajib dipatuhi tim iklan)

1. **Larangan atribut personal:** Kreatif/copy dilarang menyiratkan mengetahui status personal atau finansial pengguna (mis. "Anda pensiunan PNS?") — berisiko ditolak Meta. Gunakan bentuk umum: "Sudah pensiun, butuh dana tambahan?"
2. **Kategori finansial sensitif:** Landing page wajib informatif (bunga indikatif, disclaimer, S&K) untuk menekan risiko penolakan iklan dan komplain.
3. **Retargeting:** Bangun Custom Audience dari semua visitor (PageView), engaged (ViewContent ≥50% scroll), dan lead (Lead event). Jalankan campaign retargeting setelah volume audiens cukup.

---

## 3. Landing Page Structure & Senior UX Guidelines

### 3.1 Structure Sections (Single Page)

| No | Section                  | Prioritas | Deskripsi                                                                    |
| -- | ------------------------ | --------- | ---------------------------------------------------------------------------- |
| 1  | **Hero**                 | P0        | Headline persona pendamping personal, sub-headline nilai tambah, CTA WhatsApp utama, dan form ringkas. |
| 2  | **Keunggulan**           | P0        | 4 poin: gratis konsultasi, pilihan banyak bank mitra, didampingi sampai cair, jaminan data aman. |
| 3  | **Bank Mitra & Produk**  | P0        | Informasi indikatif kisaran plafon, bunga, dan tenor dari tabel `bank_products`. Otomatis tersembunyi jika tidak ada bank aktif. |
| 4  | **Cara Pengajuan**       | P0        | 3 langkah: Chat WhatsApp → Dicarikan produk pas → Didampingi sampai cair.     |
| 5  | **Testimonial**          | P0        | Slider manual (tanpa autoplay) testimonial asli nasabah. Otomatis tersembunyi jika data kosong. |
| 6  | **Form Lead Ringkas**    | P0        | 4 field + consent (lihat §3.3).                                              |
| 7  | **FAQ**                  | P1        | Accordion 5–8 pertanyaan umum seputar batas usia dan syarat dokumen.          |
| 8  | **Footer & Compliance**  | P0        | Profil agen independen, disclaimer legal, kontak, jam operasional WA.         |

> Landing page TIDAK menyebutkan satu nama bank sebagai identitas utama dan tidak menampilkan kesan aplikasi perbankan. Identitas halaman adalah agen pemasaran independen; nama bank hanya muncul sebagai informasi produk di section Bank Mitra.

### 3.2 CTA Strategy (WhatsApp Utama)

Audiens 60–75 tahun lebih nyaman berbicara langsung daripada mengisi form.

- **Primary CTA:** "Konsultasi via WhatsApp" → melalui route internal `/api/contact-wa` (BUKAN langsung ke `wa.me` — lihat §4.1).
- **Secondary CTA:** "Ajukan Sekarang" → scroll ke form.
- **Floating CTA:** Tombol WhatsApp sticky kanan bawah, selalu terlihat.
- Pre-filled message diambil dari `app_settings.wa_greeting`.
- Nomor WhatsApp ditampilkan juga sebagai teks yang bisa disalin/ditelepon (`tel:`), bukan hanya tombol.
- Jam operasional ditampilkan di dekat CTA.

### 3.3 Form Lead Ringkas (4 Field + Consent)

| Field                | Type              | Required | Validasi / Keterangan                                                                 |
| -------------------- | ----------------- | -------- | ------------------------------------------------------------------------------------- |
| **Nama Lengkap**     | Text              | Ya       | Minimal 3 karakter.                                                                    |
| **No. WhatsApp**     | Phone             | Ya       | Format Indonesia (`08xxx`/`+62xxx`); dinormalisasi ke E.164 (`628…`) sebelum disimpan & di-hash. |
| **Jenis Pensiun**    | Select            | Ya       | PNS / TNI-Polri / BUMN / Swasta.                                                       |
| **Pengajuan Untuk**  | Segmented (2 tombol besar) | Tidak | "Diri sendiri" (default) / "Orang tua" — membedakan lead dari segmen B (anak/mantu). |
| **Nominal Pinjaman** | Chips preset      | Tidak    | Rp 25jt / 50jt / 100jt / 200jt / 300jt + opsi "Lainnya" (input manual). **Tanpa slider** (motorik lansia). |
| **Persetujuan UU PDP** | Checkbox        | Ya       | Wajib dicentang; teks consent + link ke `/privacy-policy`. Nilai & waktu consent dicatat di DB. |

Aturan UX form:

- Label selalu di **atas** input (bukan placeholder-only); error tampil besar & spesifik di bawah field.
- Honeypot field tersembunyi sebagai anti-bot.
- **Success state** setelah submit: panel "Terima kasih, Bapak/Ibu [Nama]. Tim kami akan menghubungi via WhatsApp pada jam 08.00–21.00." + tombol besar "Lanjut Chat WhatsApp Sekarang" (melewati `/api/contact-wa` dengan konteks lead).
- Anti double-submit: nomor sama yang submit dalam 24 jam terakhir tidak membuat baris lead baru; respons tetap sukses.

### 3.4 Senior-Friendly Design System

- **Ukuran Teks:** Body 17–18px (line-height ≥ 1.5), Headline 28–36px bold.
- **Kontras Warna:** Min 4.5:1 — teks gelap di atas latar terang (skema putih/biru tua/hijau WhatsApp).
- **Target Sentuh:** Tombol CTA minimal `56×56px` dengan teks padat dan jelas.
- **Motion:** Tanpa animasi berlebihan; slider testimonial tanpa autoplay dengan tombol navigasi besar; hormati `prefers-reduced-motion`.
- **Aksessibilitas:** Nomor WhatsApp tersedia sebagai teks yang bisa disalin/ditelepon, selain tombol tautan.

### 3.5 Persona & Copywriting Guidelines (Pendamping Personal)

**Pendekatan:** Formal-hangat, seperti berbicara dengan orang tua sendiri. Hindari istilah teknis bank (gunakan "cicilan", bukan "installment/tenor/refinance").

Prinsip penulisan:

1. Formal-hangat dan sederhana; kalimat pendek, percakapan hangat.
2. Angka dan fakta konkret; hindari janji abstrak ("cepat & mudah" tanpa bukti).
3. Tanpa buzzword, tanpa emoji berlebihan, tanpa klaim "terbaik #1".
4. Nada setara dan menghormati — audiens pensiunan TNI/PNS/BUMN yang berprestasi; jangan menggurui.
5. Jujur sebagai agen perantara; tidak menirukan gaya resmi bank.

| Hindari (korporat / AI slop)                           | Gunakan (pendamping personal)                                                     |
| ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| "Solusi finansial inovatif untuk masa emas Anda!"       | "Sudah pensiun tapi masih butuh dana tambahan? Chat saja, saya bantu urus."        |
| "Dapatkan penawaran eksklusif #1 dari bank terpercaya!" | "Saya carikan produk dari beberapa bank mitra, nanti dipilihkan yang paling pas."  |
| "Proses cepat mudah tanpa ribet!!"                      | "Cukup chat WhatsApp. Sisanya kami yang urus sampai dana cair."                    |

- **Contoh Headline Hero:** *"Sudah Pensiun, Masih Butuh Dana Tambahan? Saya Bantu Urus Sampai Cair."*
- **Contoh Sub-headline:** *"Gratis konsultasi. Saya bantu carikan produk dari beberapa bank mitra yang paling pas dengan gaji pensiun Bapak/Ibu."*

---

## 4. Technical Architecture & Tracking Integration

```
[User Browser]
   │
   ├── (Klik CTA WA) ──> fbq('track','Contact',{},{eventID:eid})
   │                        └──> [Next.js Route: /api/contact-wa?eid=...&utm_*=...&fbc=...]
   │                                 ├──> Fire Meta CAPI "Contact" (server-side, event_id sama → dedup)
   │                                 ├──> Log klik ke tabel wa_clicks
   │                                 └──> 302 Redirect ──> wa.me/<wa_number>?text=<wa_greeting>
   │
   └── (Submit Form) ──> InsForge Edge Function: submit-lead  (rate limit 5/IP/jam + honeypot)
                             ├──> Validasi (consent wajib) + normalisasi phone ke E.164
                             ├──> Insert ke tabel leads (+consent, consent_at, event_id, fbp, fbc)
                             ├──> Anti double-submit: nomor sama < 24 jam → sukses tanpa baris baru
                             ├──> Fire Meta CAPI "Lead" (server-side, hashed)
                             └──> 200 OK ──> fbq('track','Lead',{},{eventID:eid}) + Success State
```

### 4.1 Reliable CAPI Tracking via Redirect Endpoint

Untuk mengatasi pembatasan privasi browser (iOS 14+), klik tombol WhatsApp tidak langsung mengarah ke `wa.me`, melainkan melalui route internal `/api/contact-wa`.

1. **Event ID & Deduplication (wajib):**
   - Setiap interaksi (PageView, ViewContent, Lead, Contact) menghasilkan `event_id = crypto.randomUUID()` di klien.
   - Klik CTA WA: klien memanggil `fbq('track','Contact',{},{eventID:eid})` lalu mengarahkan ke `/api/contact-wa?eid=<eid>&utm_*=...`. Server mengirim CAPI `Contact` dengan `event_id` yang sama → Meta menghitung 1 konversi (dedup).
   - Submit form: `eid` dibuat klien dan dikirim dalam payload; server CAPI `Lead` dan client `fbq` Lead memakai `eid` yang sama.
2. **Parameter Browser & Click IDs:**
   - `fbp`: dibaca dari cookie `_fbp` (server membaca dari request header).
   - `fbc`: jika URL landing mengandung `fbclid`, klien membangun `fbc = "fb.1.<unix_ts>.<fbclid>"`, menyimpannya di first-party cookie/localStorage, dan meneruskannya ke endpoint.
   - UTM: disimpan saat landing (sessionStorage) dan diteruskan pada setiap event.
3. **Normalisasi & Hashing (Advanced Matching):**
   - Phone → E.164 digit tanpa `+` (contoh `628123…`), lalu SHA-256.
   - Nama → lowercase + trim, lalu SHA-256 (field `fn`).
   - `external_id`: UUID sesi di localStorage untuk memperkuat matching (opsional, P1).
4. **Fail-Safe (Non-Blocking):** Seluruh panggilan CAPI & logging dibungkus try/catch. Kegagalan CAPI/DB TIDAK boleh menghalangi redirect 302 ke WhatsApp; error dicatat di server log untuk di-replay.
5. **Rate Limiting:**
   - Edge function `submit-lead` (submit form): maks **5 / IP / jam** (in-memory + DB-based) + honeypot.
   - `GET /api/contact-wa`: maks **30 / IP / jam** (mencegah spam klik yang membakar event CAPI & budget); saat limit terlampaui tetap diarahkan ke WhatsApp tanpa tracking.
6. **Pre-filled Message:** Berasal dari `app_settings.wa_greeting`; server dapat menambahkan konteks kampanye (mis. "via campaign X") agar koordinator tahu sumber chat.

### 4.2 Pixel & Server Events

| Event Name   | Trigger Location              | Method                       | Payload Data                                                      |
| ------------ | ----------------------------- | ---------------------------- | ----------------------------------------------------------------- |
| **PageView** | On page load                  | Client (pixel) + Server (P1) | URL, User-Agent, IP, event_id                                     |
| **ViewContent** | Scroll ≥ 50% (1× per sesi) | Client                       | `content_name: "Landing Page Kredit Pensiun"`, event_id           |
| **Lead**     | Submit form berhasil          | Client + Server              | Name (hash), Phone (hash E.164), Pension Type, Applicant Relation, UTMs, Event ID |
| **Contact**  | Klik tombol CTA WhatsApp      | Client (fbq saat klik) + Server (`/api/contact-wa`) | Phone (hash, jika ada), UTMs, fbp/fbc, Event ID |

### 4.3 UTM Parameter Flow

```
Meta Ads URL:
https://domain.com?utm_source=facebook&utm_medium=paid&utm_campaign=kredit_pensiun&utm_content=variant_a&utm_term=pensiunan_pns

-> Disimpan sessionStorage saat landing, diteruskan ke semua event, tersimpan di tabel leads:
   utm_source: "facebook" | utm_medium: "paid" | utm_campaign: "kredit_pensiun"
   utm_content: "variant_a" | utm_term: "pensiunan_pns"
```

### 4.4 WhatsApp Response Workflow (Operasional)

- Jam 08.00–21.00 WIB: balas ≤ 10 menit; gunakan template balasan cepat WhatsApp Business.
- Di luar jam: balas pagi berikutnya; halaman sudah menetapkan ekspektasi yang benar.
- Koordinator memproses lead dari admin panel (filter status `new`), lalu meng-update status follow-up.

---

## 5. Database Schema (InsForge PostgreSQL)

```sql
-- Helper: auto-update kolom updated_at (Postgres tidak melakukannya otomatis)
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Pengaturan aplikasi (key-value, dikelola admin)
-- Keys: wa_number (E.164 tanpa '+', contoh: 6282189902246), site_title, wa_greeting
CREATE TABLE app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_app_settings_updated BEFORE UPDATE ON app_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,                       -- disimpan normal E.164: 628…
  pension_type TEXT NOT NULL CHECK (pension_type IN ('pns','tni_polri','bumn','swasta')),
  applicant_relation TEXT NOT NULL DEFAULT 'sendiri' CHECK (applicant_relation IN ('sendiri','orang_tua')),
  loan_amount BIGINT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','approved','rejected','invalid')),
  consent BOOLEAN NOT NULL DEFAULT false,       -- bukti persetujuan UU PDP
  consent_at TIMESTAMPTZ,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  fbp TEXT,
  fbc TEXT,
  event_id TEXT,                                -- dedup Meta CAPI
  ip_address TEXT,
  user_agent TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ                        -- soft delete
);
CREATE INDEX idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX idx_leads_status ON leads (status) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_whatsapp ON leads (whatsapp);
CREATE INDEX idx_leads_campaign ON leads (utm_campaign);
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Log klik CTA WhatsApp (audit Click-WA Rate & performa per kampanye)
CREATE TABLE wa_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  fbp TEXT,
  fbc TEXT,
  lead_id UUID REFERENCES leads(id),            -- diisi jika klik berasal dari success-state
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_wa_clicks_created_at ON wa_clicks (created_at DESC);

-- Bank Products (dynamic listing; sumber section Bank Mitra & rekomendasi follow-up)
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
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ                        -- soft delete
);
CREATE INDEX idx_bank_products_active ON bank_products (is_active, display_order) WHERE deleted_at IS NULL;
CREATE TRIGGER trg_bank_products_updated BEFORE UPDATE ON bank_products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Testimonials (section otomatis tersembunyi jika tidak ada baris aktif)
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pension_type TEXT,
  content TEXT NOT NULL,
  photo_url TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- FAQ
CREATE TABLE faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
```

**RLS Policies (via InsForge CLI):**

| Tabel | Anon (publik) | Authenticated (admin) |
| --- | --- | --- |
| `leads` | INSERT saja, dengan `WITH CHECK (consent = true)` | SELECT/UPDATE/DELETE penuh |
| `wa_clicks` | INSERT saja | SELECT penuh |
| `bank_products`, `testimonials`, `faq` | SELECT hanya baris `is_active = true AND deleted_at IS NULL` | CRUD penuh |
| `app_settings` | SELECT saja | SELECT/UPDATE penuh |

**Aturan data:**

- Nomor WhatsApp (`leads.whatsapp`, `app_settings.wa_number`) disimpan **E.164 tanpa `+`** (`628…`) — `wa.me` butuh format ini; mencegah bug format campur.
- Soft delete = set `deleted_at`; semua query publik & admin mengecualikan baris ter-soft-delete.
- Duplikat lead dideteksi via `idx_leads_whatsapp` (nomor sama muncul > 1×) dan ditandai admin.
- **Kolom legacy (dipertahankan, tidak dipakai form v2):** `leads.province` (nullable) & `leads.interested_bank`; `testimonials.is_featured` (deprecated oleh `is_active`); `faq.status` (deprecated oleh `is_active`).
- Tabel `campaign_settings` **dihapus** — halaman admin Campaigns menjadi UTM link builder murni client-side (tanpa DB).

---

## 6. Admin Panel Requirements

### 6.1 Authentication

- **1 akun admin** (koordinator) — email + password via InsForge Auth, session timeout 30 menit.

### 6.2 Pengaturan Umum (`app_settings`)

- Mengubah Nomor WhatsApp koordinator (validasi input format E.164) tanpa re-deploy.
- Mengubah teks pre-filled message WhatsApp (`wa_greeting`) dan nama agen (`site_title`).
- Perubahan memicu revalidation (ISR on-demand) agar langsung tampil di landing page.

### 6.3 Manajemen Lead (`leads`)

- Filter: tanggal, jenis pensiun, relasi pengaju, status follow-up, campaign UTM.
- Search: nama, no WhatsApp. Sort + pagination.
- Update status follow-up (`new/contacted/qualified/approved/rejected/invalid`) + catatan kualifikasi.
- Deteksi & penandaan lead duplikat (nomor sama).
- Ekspor data ke `.xlsx` (hanya baris aktif).
- Soft delete dengan konfirmasi.

### 6.4 Manajemen Bank Mitra (`bank_products`)

- Tambah/edit/hapus (soft delete) bank mitra beserta plafon, bunga indikatif, tenor.
- Sakelar active/inactive — jika tidak ada bank aktif, section Bank Mitra di landing page otomatis tersembunyi.

### 6.5 Dashboard Analytic

- Kartu ringkasan: total lead hari ini / bulan ini.
- Chart distribusi jenis pensiun dan relasi pengaju (sendiri vs orang tua).
- Tabel performa per campaign UTM: leads & WA clicks per campaign/content.
- **CPL dihitung manual** dari Ads Manager (v1) — input biaya per campaign masuk Future Enhancements.

---

## 7. Legal & Compliance Requirements

### 7.1 Agen Pemasaran Independen

- **Sifat Identitas:** Halaman TIDAK boleh mencantumkan logo bank atau berpura-pura sebagai situs/aplikasi resmi perbankan.
- **Disclaimer wajib di footer:**
  > "Website ini dikelola oleh agen pemasaran independen dan bukan merupakan aplikasi resmi perbankan. Persetujuan pinjaman, penetapan bunga, dan pencairan dana sepenuhnya merupakan wewenang dari lembaga keuangan / bank mitra yang bersangkutan."
- **Penyebutan OJK (teks netral):**
  > "Seluruh produk kredit pensiun ditawarkan oleh bank mitra yang terdaftar dan diawasi oleh Otoritas Jasa Keuangan (OJK)."
  Dilarang memasang logo OJK seolah agen terafiliasi institusional.
- **Label Bunga:** Seluruh informasi bunga & simulasi wajib mencantumkan kata **"Indikatif"** dan **"Syarat & Ketentuan Berlaku"**.

### 7.2 Kepatuhan UU PDP (UU No. 27/2022)

Halaman mengumpulkan data pribadi (nama, nomor WhatsApp, IP, user-agent, cookie Meta Pixel) — wajib:

1. **Consent checkbox wajib** di form sebelum submit, dengan teks eksplisit: *"Saya setuju data saya (nama, nomor WhatsApp) diproses untuk dihubungi terkait informasi produk kredit pensiun."* + link `/privacy-policy`. Waktu consent dicatat (`consent_at`).
2. **Halaman `/privacy-policy`** (static, bahasa sederhana senior-friendly): data yang dikumpulkan, tujuan pemrosesan, dasar persetujuan, penggunaan cookie/pixel Meta, hak subjek (akses/perbaikan/penghapusan — hubungi via WA), masa retensi.
3. **Halaman `/terms`** (static): sifat jasa agen perantara, disclaimer, ketentuan penggunaan.
4. Data dipakai **hanya** untuk keperluan kontak penawaran; tidak dijual/dibagikan ke pihak ketiga di luar proses referal ke bank mitra.

---

## 8. Page Performance Budget & Security

### 8.1 Performance Budget

| Metric                        | Target      |
| ----------------------------- | ----------- |
| First Contentful Paint (FCP)  | ≤ 1.2 detik |
| Largest Contentful Paint (LCP)| ≤ 2.0 detik |
| Cumulative Layout Shift (CLS) | ≤ 0.05      |
| INP                           | ≤ 200 ms    |
| Ukuran Halaman Total          | ≤ 1.2 MB (gambar WebP/AVIF via `next/image`) |

**Mitigasi CLS ≤ 0.05 (wajib, karena konten dinamis):**

- Section dinamis (Bank Mitra, Testimonial, FAQ) di-fetch **server-side** (React Server Components), bukan client-side water-fall.
- Skeleton dengan fixed-height untuk konten asinkron; heading font di-preload dengan `font-display: swap`.
- Slider testimonial & accordion FAQ punya dimensi tetap.

### 8.2 Security

- Kunci API (CAPI token, service key) disembunyikan di environment variables — tidak pernah di bundle klien.
- Validasi data server-side dengan Zod (normalisasi & sanitasi sebelum insert).
- Rate limiting: form 5/IP/jam; `/api/contact-wa` 30/IP/jam; honeypot anti-bot.
- RLS policies aktif di semua tabel (lihat §5).
- Tidak ada data pribadi sensitif di URL publik — pre-filled message WA memakai teks generik dari settings.
- HTTPS wajib.

---

## 9. Prerequisite & QA Launch Checklist

### 9.1 Prerequisites (sebelum development launch)

- [ ] Akun Meta Business Manager dibuat; Pixel/dataset + CAPI token tersimpan di environment variables.
- [ ] Seed data bank mitra & produk (Open Question #1) siap diinput admin.
- [ ] Copy final: hero, keunggulan, FAQ, cara pengajuan.
- [ ] Halaman `/privacy-policy` & `/terms` live.
- [ ] Penanggung jawab balasan WA 08.00–21.00 WIB ditetapkan (Open Question #2).
- [ ] Fase trial: subdomain InsForge aktif. Sebelum scale: custom domain dibeli + diverifikasi di Meta Business (Open Question #3).

### 9.2 QA Checklist (sebelum campaign aktif)

- [ ] **Dedup test via Meta Test Events:** event pixel & CAPI dengan `event_id` sama tercatat sebagai 1 konversi (Lead dan Contact).
- [ ] `fbp` & `fbc` terkirim di semua payload CAPI (uji dengan URL ber-`fbclid`).
- [ ] Form: validasi, honeypot, rate limit, consent tersimpan (`consent`, `consent_at`), phone tersimpan E.164.
- [ ] Redirect `/api/contact-wa` membuka chat WA dengan nomor (E.164) dan pre-filled message benar.
- [ ] Anti double-submit berfungsi (nomor sama < 24 jam).
- [ ] Admin: login, CRUD lead/bank/testimonial/FAQ, ganti nomor WA tanpa deploy ulang, export .xlsx.
- [ ] Section otomatis tersembunyi: Bank Mitra (0 aktif), Testimonial (kosong).
- [ ] Lighthouse mobile ≥ 90 (Performance, Best Practices, SEO); CLS ≤ 0.05; LCP ≤ 2.0 s.
- [ ] Compliance sign-off: disclaimer footer, teks OJK netral, label "Indikatif" + S&K, tanpa identitas bank, tanpa kreatif atribut personal.
- [ ] Tidak ada error di console browser.

---

## 10. Timeline Eksekusi (Estimasi 5 Minggu)

| Minggu | Fokus | Deliverable |
| ------ | ----- | ----------- |
| **1** | Setup | InsForge (DB, RLS, storage), setup Meta BM/Pixel/dataset CAPI, wireframe, copy final |
| **2** | Landing Page | Development LP lengkap + mobile/senior UX + form + halaman PDP |
| **3** | Tracking | Endpoint `/api/contact-wa`, integrasi CAPI (dedup, fbp/fbc, hashing), semua event |
| **4** | Admin Panel | Auth, leads + export, bank CRUD, settings, dashboard |
| **5** | QA & Launch | QA end-to-end (dedup test, Lighthouse), compliance sign-off, seed data, deploy, aktivasi campaign |

---

## 11. Future Enhancements

- A/B testing framework untuk headline dan CTA.
- WhatsApp Business API: auto-reply di luar jam operasional + notifikasi lead baru.
- Input biaya iklan per campaign di admin → CPL otomatis di dashboard.
- Multi-marketer portal dengan kode referral (`?ref=nama`) untuk atribusi per marketer.
- Multi-landing page support.
- Analytics dashboard terhubung data Meta Ads (CPL, ROAS).

---

## 12. Open Questions

| No | Pertanyaan                                                 | Status     | Jawaban                              |
| -- | ---------------------------------------------------------- | ---------- | ------------------------------------ |
| 1  | No. WhatsApp koordinator untuk CTA WhatsApp?               | Answered   | 6282189902246 — bisa diganti via admin (E.164) |
| 2  | Penyebutan OJK di landing page?                            | Answered   | Teks netral: bank mitra terdaftar & diawasi OJK |
| 3  | Contoh testimonial nasabah yang akan ditampilkan?          | Answered   | Section dibuat, dikosongkan dulu     |
| 4  | Domain khusus untuk landing page?                          | Answered   | Trial: subdomain InsForge; custom domain sebelum scale |
| 5  | Daftar awal bank mitra & produk untuk seed data admin?     | **Open**   | Menunggu data dari koordinator (blocking launch, tidak blocking dev) |
| 6  | Siapa penanggung jawab balasan WA jam 08.00–21.00 WIB?     | **Open**   | Prasyarat SLA WA                     |
| 7  | Nama custom domain yang akan dibeli?                       | **Open**   | Rekomendasi `.com`/`.id` singkat & mudah diingat |
| 8  | Akun Meta Business Manager & Pixel sudah tersedia?         | **Open**   | Prasyarat minggu 1                   |

---

## 13. Decision Log

| Tanggal    | Keputusan                                              | Alasan                                        |
| ---------- | ------------------------------------------------------ | --------------------------------------------- |
| 2026-08-23 | Usia target diubah dari 45-65 menjadi 60-75 tahun      | Penyesuaian demografi produk                  |
| 2026-08-23 | CTA utama: WhatsApp, form menjadi sekunder             | Audiens senior lebih nyaman bicara langsung   |
| 2026-08-23 | Section simulasi kredit dihapus                        | Terlalu kompleks untuk audiens senior         |
| 2026-08-23 | Desain: seimbang (modern tapi mudah dibaca)            | Font sedang-besar, kontras tinggi             |
| 2026-08-23 | Gaya bahasa: formal-hangat sederhana                   | Sesuai dengan audiens pensiunan               |
| 2026-08-23 | Testimonial: section dibuat, konten dikosongkan dulu   | Menunggu data asli dari koordinator           |
| 2026-08-23 | Reposisi: agen pemasaran independen multi-bank; hapus identitas BNI dari seluruh halaman | Hindari kesan aplikasi perbankan dan risiko legal penggunaan nama bank |
| 2026-08-23 | Section baru "Bank Mitra" + tabel `bank_products`      | Daftar bank dinamis, dikelola via admin tanpa deploy ulang |
| 2026-08-23 | Nomor WhatsApp dipindah ke `app_settings`              | Koordinator bisa ganti nomor dari admin panel |
| 2026-08-23 | Persona copywriting: pendamping personal + prinsip anti-slop | Natural untuk audiens senior; sesuai model referal |
| 2026-09-08 | Segmen B (anak/mantu 35–50) masuk strategi targeting   | Perantara digital yang mengisi form untuk orang tua |
| 2026-09-08 | KPI dipisah: CVR Form (macro) & Click-WA Rate (micro); konversi gabungan sebagai agregat | Metrik campuran menyulitkan optimasi & audit Meta |
| 2026-09-08 | Budget iklan Rp 500rb–1jt/bln; volume 10–25 lead/bln   | Jawaban koordinator; KPI jadi budget-aware    |
| 2026-09-08 | Form + leads: field `applicant_relation` ("Diri sendiri"/"Orang tua", opsional) | Kualifikasi lead segmen B sejak awal |
| 2026-09-08 | Nominal pakai chips preset; slider dihapus             | Motorik lansia di layar sentuh                |
| 2026-09-08 | Provinsi & bank pilihan dihapus dari form/leads        | Digali saat wawancara WA; form tetap pendek   |
| 2026-09-08 | Kepatuhan UU PDP lengkap: consent checkbox + halaman privacy & terms | Risiko legal lead-gen finansial; pengumpulan IP/UA/pixel |
| 2026-09-08 | Domain: trial subdomain InsForge → custom domain sebelum scale + verifikasi Meta | Trust audiens lansia & verifikasi domain Meta |
| 2026-09-08 | SLA WA ≤ 10 menit pada jam operasional 08.00–21.00 WIB | Realistis dan bisa diaudit                    |
| 2026-09-08 | Tabel `sections` & `campaign_settings` dihapus         | Copy statis di kode (anti-slop); pixel via env; admin lebih fokus |
| 2026-09-08 | Soft delete via `deleted_at` di semua tabel admin-managed | Konsistensi schema ↔ requirement admin     |
| 2026-09-08 | `wa_number` & `leads.whatsapp` disimpan E.164 (`628…`) | Mencegah bug format `wa.me` dan hashing CAPI  |
| 2026-09-08 | Dedup CAPI via `event_id` shared client ↔ server       | Best practice Meta; konversi tak dobel hitung |
| 2026-09-08 | Tabel `wa_clicks` baru untuk log klik CTA              | Click-WA Rate & performa per kampanye jadi terukur |
| 2026-09-08 | Status lead baru `invalid`                             | Menopang metrik Valid Lead Rate               |
| 2026-09-08 | CTA WA wajib via `/api/contact-wa` (bukan wa.me langsung) | Membuka jalur CAPI server-side yang reliable |
| 2026-09-08 | Submit lead via InsForge Edge Function (bukan Next.js API route) | Edge function sudah hardened (rate limit 2 lapis + CAPI); PRD §4 disesuaikan |
| 2026-09-08 | Tabel `campaign_settings` dihapus; halaman Campaigns jadi UTM builder client-side | Utilitas UTM builder tetap tersedia tanpa beban tabel & CRUD |
| 2026-09-08 | Kolom legacy dipertahankan nullable (`province`, `interested_bank`, `is_featured`, `faq.status`) | Data historis aman; form & query baru memakai kolom v2 |
| 2026-09-08 | Implementasi align-prd-v2 selesai (migration, edge function, route, admin, UU PDP) | Codebase selaras dengan PRD v2 |

---

*Document ini bersifat living document dan akan diupdate di kemudian hari.*
