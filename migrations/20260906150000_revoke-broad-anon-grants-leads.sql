-- Korelasi security-hardening: platform memberi privilege DML default yang luas
-- ke role runtime (anon punya INSERT+UPDATE semua kolom), sehingga GRANT kolom
-- saja tidak membatasi. REVOKE ALL dulu, lalu beri GRANT kolom selektif.

REVOKE ALL ON leads FROM anon;

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
