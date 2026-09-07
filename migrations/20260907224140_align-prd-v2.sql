-- ============================================
-- Alignment PRD v2 (2026-09-08)
-- 1. leads: + applicant_relation, consent, consent_at, event_id, fbp, fbc;
--    province jadi nullable (kolom legacy dipertahankan); whatsapp dinormalisasi E.164.
-- 2. wa_clicks: tabel log klik CTA WhatsApp (audit Click-WA Rate per kampanye).
-- 3. testimonials: + is_active, deleted_at (soft delete; is_featured deprecated).
-- 4. faq: + is_active (backfill dari status), deleted_at. Kolom status dipertahankan sementara.
-- 5. app_settings: nilai wa_number dinormalisasi ke E.164.
-- 6. DROP sections & campaign_settings (konten landing statis di kode; campaigns jadi builder client-side).
-- 7. RLS & grants diselaraskan (anon INSERT leads wajib consent = true).
-- ============================================

-- --------------------------------------------
-- 1. leads
-- --------------------------------------------

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS applicant_relation TEXT NOT NULL DEFAULT 'sendiri',
  ADD COLUMN IF NOT EXISTS consent BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS event_id TEXT,
  ADD COLUMN IF NOT EXISTS fbp TEXT,
  ADD COLUMN IF NOT EXISTS fbc TEXT;

-- Legacy: form v2 tidak lagi mengumpulkan provinsi; data historis dipertahankan.
ALTER TABLE leads ALTER COLUMN province DROP NOT NULL;

-- Normalisasi E.164 idempotent: strip non-digit; 08…/8… → 62…; sudah 62… dibiarkan.
UPDATE leads
SET whatsapp = CASE
  WHEN left(clean, 2) = '62' THEN clean
  WHEN left(clean, 1) = '0' THEN '62' || substr(clean, 2)
  ELSE '62' || clean
END
FROM (SELECT id, regexp_replace(whatsapp, '\D', '', 'g') AS clean FROM leads) AS norm
WHERE leads.id = norm.id
  AND leads.whatsapp !~ '^62[0-9]{9,13}$';

CREATE INDEX IF NOT EXISTS idx_leads_whatsapp_created
  ON leads (whatsapp, created_at DESC);

-- Anon INSERT wajib consent = true (bukti persetujuan UU PDP)
DROP POLICY IF EXISTS "leads_insert_anon" ON leads;

CREATE POLICY "leads_insert_anon" ON leads
  FOR INSERT TO anon
  WITH CHECK (
    status = 'new'
    AND deleted_at IS NULL
    AND notes IS NULL
    AND ip_address IS NULL
    AND consent = true
  );

REVOKE ALL ON leads FROM anon;

GRANT INSERT (
  name,
  whatsapp,
  pension_type,
  applicant_relation,
  loan_amount,
  consent,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_content,
  utm_term,
  event_id,
  fbp,
  fbc
) ON leads TO anon;

-- --------------------------------------------
-- 2. wa_clicks
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS wa_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  fbp TEXT,
  fbc TEXT,
  lead_id UUID REFERENCES leads(id),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wa_clicks_created_at ON wa_clicks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_clicks_campaign ON wa_clicks (utm_campaign);

ALTER TABLE wa_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wa_clicks_insert_anon" ON wa_clicks;
CREATE POLICY "wa_clicks_insert_anon" ON wa_clicks
  FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "wa_clicks_select_admin" ON wa_clicks;
CREATE POLICY "wa_clicks_select_admin" ON wa_clicks
  FOR SELECT TO authenticated
  USING (true);

REVOKE ALL ON wa_clicks FROM anon;
GRANT INSERT ON wa_clicks TO anon;
GRANT SELECT, DELETE ON wa_clicks TO authenticated;

-- --------------------------------------------
-- 3. testimonials
-- --------------------------------------------

ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_testimonials_active
  ON testimonials (is_active, display_order)
  WHERE deleted_at IS NULL;

DROP POLICY IF EXISTS "testimonials_select_anon" ON testimonials;
CREATE POLICY "testimonials_select_anon" ON testimonials
  FOR SELECT TO anon
  USING (is_active = true AND deleted_at IS NULL);

-- --------------------------------------------
-- 4. faq
-- --------------------------------------------

ALTER TABLE faq
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

UPDATE faq SET is_active = (status = 'published');

CREATE INDEX IF NOT EXISTS idx_faq_active
  ON faq (is_active, display_order)
  WHERE deleted_at IS NULL;

DROP POLICY IF EXISTS "faq_select_anon" ON faq;
CREATE POLICY "faq_select_anon" ON faq
  FOR SELECT TO anon
  USING (is_active = true AND deleted_at IS NULL);

-- --------------------------------------------
-- 5. app_settings: wa_number → E.164
-- --------------------------------------------

UPDATE app_settings
SET setting_value = '62' || substr(regexp_replace(setting_value, '\D', '', 'g'), 2)
WHERE setting_key = 'wa_number'
  AND setting_value LIKE '0%';

-- --------------------------------------------
-- 6. DROP tabel legacy
-- --------------------------------------------

DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS campaign_settings CASCADE;
