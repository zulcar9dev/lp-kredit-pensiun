-- Susulan 20260909000000: data historis sudah bersih (terverifikasi:
-- pension_type hanya bumn/pns, applicant_relation hanya sendiri, status
-- hanya new), jadi CHECK yang tadinya NOT VALID sekarang dikunci penuh.
ALTER TABLE leads VALIDATE CONSTRAINT leads_pension_type_check;
ALTER TABLE leads VALIDATE CONSTRAINT leads_applicant_relation_check;
ALTER TABLE leads VALIDATE CONSTRAINT leads_status_check;
