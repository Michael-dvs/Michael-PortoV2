-- ============================================================
-- Michael Aristyo Portfolio — Migration 003
-- Extends `projects` table with case study fields:
--   • content          TEXT       — long-form markdown/plain-text documentation
--   • infographic_urls TEXT[]     — array of screenshot / diagram image URLs
--
-- Run this in the Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- 1. ADD COLUMNS (idempotent — safe to re-run)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS content          TEXT        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS infographic_urls TEXT[]      NOT NULL DEFAULT '{}';


-- ─────────────────────────────────────────────────────────────
-- 2. ROW-LEVEL SECURITY — ensure new columns are covered
-- (The existing "Public read projects" policy covers SELECT *,
--  so no new policy is needed.)
-- ─────────────────────────────────────────────────────────────


-- ─────────────────────────────────────────────────────────────
-- 3. UPDATE SEED DATA — FinExtract (featured project)
-- ─────────────────────────────────────────────────────────────
UPDATE projects
SET
  content = E'FinExtract is a cross-platform desktop application designed to automate the tedious manual process of extracting and categorising financial data from scanned bank statement PDFs.\n\nThe core challenge was handling the vast inconsistency between bank PDF layouts — every institution formats their statements differently, using varied table structures, fonts, and column orderings. A naive regex approach would break with every new bank format.\n\nThe solution uses a two-stage pipeline. In the first stage, pdfplumber parses the raw PDF and extracts positional text data — not just the characters, but their exact X/Y coordinates on the page. This spatial metadata is then used to reconstruct table structures that survive even the most unconventional PDF layouts.\n\nIn the second stage, a rule-based NLP classifier analyses each extracted transaction row. It tokenises the merchant name and applies a curated keyword taxonomy to assign one of 12 spending categories (Food & Dining, Transport, Utilities, etc.). An OpenCV pre-processing step handles scanned image PDFs where the source is a photograph of a physical statement, running adaptive thresholding and deskewing before passing the image to Tesseract OCR.\n\nThe final output is a clean, structured Excel workbook with category subtotals, a monthly spending trend chart generated via openpyxl, and a full audit trail CSV. The GUI is built with CustomTkinter, giving it a native dark-mode appearance on both Windows and macOS without requiring Electron or a web view.\n\nPerformance benchmarks show the tool processes a 12-month, 200-transaction statement in under 4 seconds on a mid-range laptop, compared to 45–60 minutes of manual entry.',
  infographic_urls = ARRAY[
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1200&q=80'
  ]
WHERE slug = 'finextract';


-- ─────────────────────────────────────────────────────────────
-- 4. UPDATE SEED DATA — Portfolio v2 (non-featured project)
-- ─────────────────────────────────────────────────────────────
UPDATE projects
SET
  content = E'This portfolio is the second major iteration of my personal website, rebuilt from scratch with a focus on performance, content-driven architecture, and a premium visual language inspired by Apple product pages.\n\nVersion 1 was a static HTML/CSS site. Version 2 migrates entirely to a component-based React architecture using Vite as the build tool, enabling hot module replacement during development and highly optimised production bundles via Rollup.\n\nThe design system is built on Tailwind CSS v4 with a custom theme layer defining semantic colour tokens (dark tile, parchment, accent blue) that propagate through every component. Framer Motion drives all entrance animations, using IntersectionObserver-based viewport triggers so animations only fire once per session.\n\nThe backend is a Supabase PostgreSQL instance. All project and lab gallery content is stored in the database and fetched client-side using the Supabase JS SDK, making content updates a simple database row edit rather than a code deployment. Row-Level Security policies ensure only SELECT operations are permitted from the public anon key.\n\nThe draggable bento gallery uses pointer events and spring physics via Framer Motion to create a tactile, physics-based drag interaction without any additional library dependencies.',
  infographic_urls = ARRAY[
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'
  ]
WHERE slug = 'portfolio-v2';


-- ─────────────────────────────────────────────────────────────
-- 5. VERIFICATION QUERIES
-- ─────────────────────────────────────────────────────────────
-- SELECT slug, content IS NOT NULL AS has_content, array_length(infographic_urls, 1) AS infographic_count
-- FROM projects;
