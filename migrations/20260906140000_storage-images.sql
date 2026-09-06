-- Fase 4: InsForge Storage untuk gambar konten (PRD 4.2/4.3/4.5 & 7.1)
-- 1. Kolom *_key untuk operasi download/delete (WAJIB simpan url + key)
-- 2. RLS storage.objects untuk bucket 'images':
--    - public bucket: direct GET bypass RLS (landing page bisa tampilkan gambar)
--    - upload/delete hanya untuk admin yang login (authenticated)
--    - bucket 'images' dibuat via CLI: insforge storage create-bucket images (public)

-- ============================================
-- 1. Storage key columns
-- ============================================

ALTER TABLE sections ADD COLUMN IF NOT EXISTS image_key TEXT;
ALTER TABLE bank_products ADD COLUMN IF NOT EXISTS logo_key TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS photo_key TEXT;

-- ============================================
-- 2. Storage objects RLS (bucket images)
-- ============================================

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS storage_images_select ON storage.objects;
DROP POLICY IF EXISTS storage_images_insert ON storage.objects;
DROP POLICY IF EXISTS storage_images_delete ON storage.objects;

CREATE POLICY storage_images_select ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket = 'images');

CREATE POLICY storage_images_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket = 'images');

CREATE POLICY storage_images_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket = 'images'
    AND uploaded_by = (SELECT auth.jwt() ->> 'sub')
  );

GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT SELECT, INSERT, DELETE ON storage.objects TO authenticated;
