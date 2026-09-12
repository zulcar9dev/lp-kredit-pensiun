-- 2026-09-12: hapus permanen bank_products (keputusan anti-penolakan Meta).
-- Halaman jadi jasa pendampingan umum, bukan katalog bank (hindari
-- impersonation + klaim bunga/plafon tak terbukti).
--
-- PENTING: backup dulu sebelum apply:
--   pg_dump -t bank_products > backup-bank_products.sql
-- Tabel leads.interested_bank (legacy, nullable) TIDAK di-drop agar
-- history lead lama tetap aman.

DROP POLICY IF EXISTS "bank_products_select_anon" ON bank_products;
DROP POLICY IF EXISTS "bank_products_insert_authenticated" ON bank_products;
DROP POLICY IF EXISTS "bank_products_select_authenticated" ON bank_products;
DROP POLICY IF EXISTS "bank_products_update_authenticated" ON bank_products;
DROP POLICY IF EXISTS "bank_products_delete_authenticated" ON bank_products;

REVOKE ALL ON bank_products FROM anon, authenticated;

DROP TRIGGER IF EXISTS trg_bank_products_updated ON bank_products;
DROP INDEX IF EXISTS idx_bank_products_active;

DROP TABLE IF EXISTS bank_products CASCADE;
