-- Perbaikan P0 audit PRD v2 (2026-09-09):
-- 1) P0-2: normalisasi leads.pension_type ke snake_case (PRD §5) + CHECK.
-- 2) P0-5: kunci RLS anon bank_products (hanya baris aktif & belum dihapus).

-- ---------- 1a. Normalisasi data historis (label form -> snake_case) ----------
UPDATE leads SET pension_type = 'tni_polri' WHERE pension_type = 'TNI/Polri';
UPDATE leads SET pension_type = 'pns' WHERE pension_type = 'PNS';
UPDATE leads SET pension_type = 'bumn' WHERE pension_type = 'BUMN';
UPDATE leads SET pension_type = 'swasta' WHERE pension_type = 'Swasta';

-- ---------- 1b. CHECK constraints (NOT VALID: baris lama tak diblokir,
-- penegakan penuh untuk insert/update baru; jalankan VALIDATE manual
-- setelah data historis dibersihkan) ----------
ALTER TABLE leads
  ADD CONSTRAINT leads_pension_type_check
  CHECK (pension_type IN ('pns', 'tni_polri', 'bumn', 'swasta')) NOT VALID;

ALTER TABLE leads
  ADD CONSTRAINT leads_applicant_relation_check
  CHECK (applicant_relation IN ('sendiri', 'orang_tua')) NOT VALID;

ALTER TABLE leads
  ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'qualified', 'approved', 'rejected', 'invalid')) NOT VALID;

-- ---------- 2. RLS bank_products: anon hanya baris aktif & belum dihapus ----------
DROP POLICY IF EXISTS "bank_products_select_anon" ON bank_products;
CREATE POLICY "bank_products_select_anon" ON bank_products
  FOR SELECT TO anon
  USING (is_active = true AND deleted_at IS NULL);
