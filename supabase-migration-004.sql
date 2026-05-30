-- ============================================================
-- Michael Aristyo Portfolio — Migration 004
-- Extends `projects` table with icon & theming fields:
--   • icon_url      TEXT  — URL gambar ikon proyek (48–64 px, rounded)
--   • accent_color  TEXT  — Kode HEX warna dominan ikon (cth: "#4F8EF7")
--
-- Menyimpan HEX di DB jauh lebih ringan daripada mengekstrak warna
-- on-the-fly di frontend setiap kali halaman dibuka.
--
-- Run di Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- 1. ADD COLUMNS (idempotent — aman jika dijalankan ulang)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS icon_url     TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT NULL;

-- Komentar kolom (opsional, berguna di Supabase Table Editor)
COMMENT ON COLUMN projects.icon_url IS
  'URL gambar ikon proyek (disarankan 128×128 px, format PNG/WebP transparan).';
COMMENT ON COLUMN projects.accent_color IS
  'Kode HEX warna dominan ikon, cth: #4F8EF7. Digunakan untuk tema dinamis halaman detail.';


-- ─────────────────────────────────────────────────────────────
-- 2. UPDATE SEED DATA — FinExtract (featured project)
--    Warna aksen: biru-ungu keunguan seperti tema keuangan/data
-- ─────────────────────────────────────────────────────────────
UPDATE projects
SET
  icon_url     = 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png',
  accent_color = '#4F8EF7'
WHERE slug = 'finextract';


-- ─────────────────────────────────────────────────────────────
-- 3. UPDATE SEED DATA — Portfolio v2 (non-featured project)
--    Warna aksen: teal/cyan sebagai identitas web/frontend
-- ─────────────────────────────────────────────────────────────
UPDATE projects
SET
  icon_url     = 'https://cdn-icons-png.flaticon.com/512/1197/1197460.png',
  accent_color = '#00C9A7'
WHERE slug = 'portfolio-v2';


-- ─────────────────────────────────────────────────────────────
-- 4. VERIFICATION QUERIES
-- ─────────────────────────────────────────────────────────────
-- SELECT slug, icon_url, accent_color FROM projects;
