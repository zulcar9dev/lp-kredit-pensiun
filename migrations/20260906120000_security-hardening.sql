-- Security hardening hasil audit:
-- 1. campaign_settings: policy lama berlaku untuk PUBLIC (tanpa TO authenticated)
--    dan anon diberi GRANT penuh (bisa hapus data kampanye). Kunci ke authenticated.
-- 2. leads: anon INSERT tanpa batas bisa memalsukan status/notes/deleted_at/ip_address.
--    Batasi dengan CHECK dan column-level grant.
-- 3. Index untuk filter/sort leads dan rate limit per IP.

-- ============================================
-- 1. FIX RLS campaign_settings
-- ============================================

DROP POLICY IF EXISTS "Allow admin read campaign_settings" ON campaign_settings;
DROP POLICY IF EXISTS "Allow admin insert campaign_settings" ON campaign_settings;
DROP POLICY IF EXISTS "Allow admin update campaign_settings" ON campaign_settings;
DROP POLICY IF EXISTS "Allow admin delete campaign_settings" ON campaign_settings;

CREATE POLICY "campaign_settings_select_admin" ON campaign_settings
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "campaign_settings_insert_admin" ON campaign_settings
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "campaign_settings_update_admin" ON campaign_settings
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "campaign_settings_delete_admin" ON campaign_settings
  FOR DELETE TO authenticated
  USING (true);

REVOKE ALL ON campaign_settings FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON campaign_settings TO authenticated;

-- ============================================
-- 2. HARDENING RLS leads (anon INSERT)
-- ============================================

DROP POLICY IF EXISTS "leads_insert_anon" ON leads;

CREATE POLICY "leads_insert_anon" ON leads
  FOR INSERT TO anon
  WITH CHECK (
    status = 'new'
    AND deleted_at IS NULL
    AND notes IS NULL
    AND ip_address IS NULL
  );

-- Anon tidak butuh SELECT atas leads
REVOKE SELECT ON leads FROM anon;

-- Anon hanya boleh mengisi kolom milik form publik
GRANT INSERT (
  name,
  whatsapp,
  pension_type,
  province,
  loan_amount,
  interested_bank,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_content,
  utm_term
) ON leads TO anon;

-- ============================================
-- 3. Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_ip_created_at ON leads (ip_address, created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
