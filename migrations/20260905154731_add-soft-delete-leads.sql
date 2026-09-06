ALTER TABLE leads ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX idx_leads_deleted_at ON leads(deleted_at) WHERE deleted_at IS NULL;
