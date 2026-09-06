-- Perbaikan hasil audit (Fase 3):
-- 1. Soft delete untuk sections & bank_products (PRD 4.2 & 4.3)
-- 2. Seed app_settings default (PRD 4.6) agar nilai WhatsApp/greeting
--    langsung ada di database tanpa harus save dari admin dulu.

-- ============================================
-- 1. Soft delete columns
-- ============================================

ALTER TABLE sections ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE bank_products ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_sections_deleted_at
  ON sections (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_bank_products_deleted_at
  ON bank_products (deleted_at) WHERE deleted_at IS NULL;

-- ============================================
-- 2. Seed app_settings (tidak menimpa nilai yang sudah diubah admin)
-- ============================================

INSERT INTO app_settings (setting_key, setting_value) VALUES
  ('wa_number', '082189902246'),
  ('wa_number_display', '0821-8990-2246'),
  ('wa_greeting', 'Halo, saya tertarik dengan informasi kredit pensiun. Boleh minta info?')
ON CONFLICT (setting_key) DO NOTHING;
