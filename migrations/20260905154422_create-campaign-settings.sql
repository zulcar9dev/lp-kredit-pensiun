CREATE TABLE IF NOT EXISTS campaign_settings (
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

ALTER TABLE campaign_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin read campaign_settings" ON campaign_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert campaign_settings" ON campaign_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update campaign_settings" ON campaign_settings
  FOR UPDATE USING (true);

CREATE POLICY "Allow admin delete campaign_settings" ON campaign_settings
  FOR DELETE USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON campaign_settings TO anon, authenticated;
