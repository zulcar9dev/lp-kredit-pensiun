-- PRD v2 §5: leads.user_agent untuk logging & CAPI client_user_agent
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_agent TEXT;
