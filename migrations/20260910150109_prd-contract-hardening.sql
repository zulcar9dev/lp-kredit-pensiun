-- Plan 100% PRD — Fase F: kontrak DB sisa (D-1..D-4).
-- Terverifikasi pra-migrasi: nol NULL di semua kolom target, nol rating liar.
-- Backfill UPDATE tetap disertakan sebagai jaring pengaman.

-- ---------- D-1a. Backfill (no-op bila sudah bersih) ----------
UPDATE leads SET created_at = NOW() WHERE created_at IS NULL;
UPDATE leads SET updated_at = NOW() WHERE updated_at IS NULL;
UPDATE bank_products SET display_order = 0 WHERE display_order IS NULL;
UPDATE bank_products SET is_active = true WHERE is_active IS NULL;
UPDATE bank_products SET created_at = NOW() WHERE created_at IS NULL;
UPDATE bank_products SET updated_at = NOW() WHERE updated_at IS NULL;
UPDATE testimonials SET rating = 5 WHERE rating IS NULL;
UPDATE testimonials SET display_order = 0 WHERE display_order IS NULL;
UPDATE testimonials SET created_at = NOW() WHERE created_at IS NULL;
UPDATE faq SET display_order = 0 WHERE display_order IS NULL;
UPDATE faq SET created_at = NOW() WHERE created_at IS NULL;

-- ---------- D-1b. NOT NULL (PRD §5) ----------
ALTER TABLE app_settings ALTER COLUMN setting_value SET NOT NULL;
ALTER TABLE app_settings ALTER COLUMN updated_at SET NOT NULL;
ALTER TABLE leads ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE leads ALTER COLUMN updated_at SET NOT NULL;
ALTER TABLE bank_products ALTER COLUMN display_order SET NOT NULL;
ALTER TABLE bank_products ALTER COLUMN is_active SET NOT NULL;
ALTER TABLE bank_products ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE bank_products ALTER COLUMN updated_at SET NOT NULL;
ALTER TABLE testimonials ALTER COLUMN rating SET NOT NULL;
ALTER TABLE testimonials ALTER COLUMN display_order SET NOT NULL;
ALTER TABLE testimonials ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE faq ALTER COLUMN display_order SET NOT NULL;
ALTER TABLE faq ALTER COLUMN created_at SET NOT NULL;

-- ---------- D-2. CHECK rating 1–5 (PRD §5:317) ----------
ALTER TABLE testimonials
  ADD CONSTRAINT testimonials_rating_check
  CHECK (rating BETWEEN 1 AND 5) NOT VALID;
ALTER TABLE testimonials VALIDATE CONSTRAINT testimonials_rating_check;

-- ---------- D-3. Index hilang (PRD §5:263-266,306) ----------
CREATE INDEX IF NOT EXISTS idx_leads_campaign ON leads (utm_campaign);
CREATE INDEX IF NOT EXISTS idx_bank_products_active
  ON bank_products (is_active, display_order) WHERE deleted_at IS NULL;
DROP INDEX IF EXISTS idx_leads_status;
CREATE INDEX idx_leads_status ON leads (status) WHERE deleted_at IS NULL;

-- ---------- D-4. RLS sisa (PRD §5 tabel RLS) ----------
-- app_settings: SELECT untuk authenticated (sebelumnya hanya anon)
DROP POLICY IF EXISTS "app_settings_select_authenticated" ON app_settings;
CREATE POLICY "app_settings_select_authenticated" ON app_settings
  FOR SELECT TO authenticated
  USING (true);

-- leads: INSERT untuk authenticated (admin createLead; anon tetap terpisah)
DROP POLICY IF EXISTS "leads_insert_authenticated" ON leads;
CREATE POLICY "leads_insert_authenticated" ON leads
  FOR INSERT TO authenticated
  WITH CHECK (true);
GRANT INSERT ON leads TO authenticated;

-- wa_clicks: cabut grant DELETE ekstra (PRD: authenticated SELECT saja).
-- Kebijakan DELETE memang tidak pernah ada; GRANT tanpa policy = dead privilege.
REVOKE DELETE ON wa_clicks FROM authenticated;
