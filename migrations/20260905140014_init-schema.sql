-- ============================================
-- FASE 1: Database Schema + RLS + Triggers
-- Landing Page Kredit Pensiun
-- ============================================

-- ============================================
-- 1. TABEL: leads
-- ============================================
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

-- ============================================
-- 2. TABEL: bank_products
-- ============================================
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

-- ============================================
-- 3. TABEL: app_settings
-- ============================================
CREATE TABLE app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. TABEL: sections
-- ============================================
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

-- ============================================
-- 5. TABEL: testimonials
-- ============================================
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

-- ============================================
-- 6. TABEL: faq
-- ============================================
CREATE TABLE faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIGGERS: auto-update updated_at
-- ============================================
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER bank_products_updated_at
  BEFORE UPDATE ON bank_products
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

-- ============================================
-- RLS: Enable Row Level Security
-- ============================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: leads
-- ============================================

-- Public (anon) bisa INSERT lead dari form landing page
CREATE POLICY "leads_insert_anon" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Admin (authenticated) bisa SELECT semua leads
CREATE POLICY "leads_select_authenticated" ON leads
  FOR SELECT TO authenticated
  USING (true);

-- Admin (authenticated) bisa UPDATE leads
CREATE POLICY "leads_update_authenticated" ON leads
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admin (authenticated) bisa DELETE leads
CREATE POLICY "leads_delete_authenticated" ON leads
  FOR DELETE TO authenticated
  USING (true);

-- ============================================
-- RLS POLICIES: bank_products
-- ============================================

-- Public (anon) bisa SELECT bank_products (untuk landing page)
CREATE POLICY "bank_products_select_anon" ON bank_products
  FOR SELECT TO anon
  USING (true);

-- Admin bisa full CRUD
CREATE POLICY "bank_products_insert_authenticated" ON bank_products
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "bank_products_select_authenticated" ON bank_products
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "bank_products_update_authenticated" ON bank_products
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "bank_products_delete_authenticated" ON bank_products
  FOR DELETE TO authenticated
  USING (true);

-- ============================================
-- RLS POLICIES: app_settings
-- ============================================

-- Public (anon) bisa SELECT app_settings (untuk landing page)
CREATE POLICY "app_settings_select_anon" ON app_settings
  FOR SELECT TO anon
  USING (true);

-- Admin bisa UPDATE app_settings
CREATE POLICY "app_settings_update_authenticated" ON app_settings
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admin bisa INSERT app_settings (jika perlu tambah setting baru)
CREATE POLICY "app_settings_insert_authenticated" ON app_settings
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- ============================================
-- RLS POLICIES: sections
-- ============================================

-- Public (anon) bisa SELECT sections yang published
CREATE POLICY "sections_select_anon" ON sections
  FOR SELECT TO anon
  USING (status = 'published');

-- Admin bisa full CRUD
CREATE POLICY "sections_insert_authenticated" ON sections
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "sections_select_authenticated" ON sections
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "sections_update_authenticated" ON sections
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "sections_delete_authenticated" ON sections
  FOR DELETE TO authenticated
  USING (true);

-- ============================================
-- RLS POLICIES: testimonials
-- ============================================

-- Public (anon) bisa SELECT testimonials
CREATE POLICY "testimonials_select_anon" ON testimonials
  FOR SELECT TO anon
  USING (true);

-- Admin bisa full CRUD
CREATE POLICY "testimonials_insert_authenticated" ON testimonials
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "testimonials_select_authenticated" ON testimonials
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "testimonials_update_authenticated" ON testimonials
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "testimonials_delete_authenticated" ON testimonials
  FOR DELETE TO authenticated
  USING (true);

-- ============================================
-- RLS POLICIES: faq
-- ============================================

-- Public (anon) bisa SELECT faq yang published
CREATE POLICY "faq_select_anon" ON faq
  FOR SELECT TO anon
  USING (status = 'published');

-- Admin bisa full CRUD
CREATE POLICY "faq_insert_authenticated" ON faq
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "faq_select_authenticated" ON faq
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "faq_update_authenticated" ON faq
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "faq_delete_authenticated" ON faq
  FOR DELETE TO authenticated
  USING (true);

-- ============================================
-- GRANTS: Allow access to tables
-- ============================================
GRANT SELECT, INSERT ON leads TO anon;
GRANT SELECT, UPDATE, DELETE ON leads TO authenticated;

GRANT SELECT ON bank_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON bank_products TO authenticated;

GRANT SELECT ON app_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON app_settings TO authenticated;

GRANT SELECT ON sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON sections TO authenticated;

GRANT SELECT ON testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON testimonials TO authenticated;

GRANT SELECT ON faq TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON faq TO authenticated;
