-- ============================================================
-- Michael Aristyo Portfolio — Supabase Database Setup
-- Run this entire file in the Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- 1. EXTENSIONS
-- ─────────────────────────────────────────────────────────────
-- gen_random_uuid() is available in Supabase by default via
-- the pgcrypto / pg_crypto extension. Enable it just in case.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ─────────────────────────────────────────────────────────────
-- 2. TABLE: projects
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  title         TEXT        NOT NULL,
  slug          TEXT        NOT NULL,
  description   TEXT        NOT NULL,
  thumbnail_url TEXT        NOT NULL,
  live_url      TEXT,                          -- nullable: optional live demo
  repo_url      TEXT,                          -- nullable: optional GitHub link
  tech_stack    TEXT[]      NOT NULL DEFAULT '{}',
  is_featured   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT projects_pkey     PRIMARY KEY (id),
  CONSTRAINT projects_slug_key UNIQUE (slug)
);

-- Keep updated_at in sync automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_projects_updated_at ON projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects (is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at  ON projects (created_at DESC);


-- ─────────────────────────────────────────────────────────────
-- 3. TABLE: lab_activities
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lab_activities (
  id          TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  role        TEXT        NOT NULL,
  image_url   TEXT        NOT NULL,
  description TEXT        NOT NULL,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT lab_activities_pkey PRIMARY KEY (id)
);

DROP TRIGGER IF EXISTS set_lab_activities_updated_at ON lab_activities;
CREATE TRIGGER set_lab_activities_updated_at
  BEFORE UPDATE ON lab_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_lab_activities_is_active   ON lab_activities (is_active);
CREATE INDEX IF NOT EXISTS idx_lab_activities_sort_order  ON lab_activities (sort_order ASC);


-- ─────────────────────────────────────────────────────────────
-- 4. ROW-LEVEL SECURITY (optional but recommended on Supabase)
-- ─────────────────────────────────────────────────────────────
-- Public read-only: anyone can SELECT, no anonymous writes.
ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_activities ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated requests from your server (service-role key bypasses RLS anyway)
-- Allow anonymous public read access so Next.js Server Components can query without auth
DROP POLICY IF EXISTS "Public read projects"       ON projects;
CREATE POLICY "Public read projects"
  ON projects FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read lab_activities" ON lab_activities;
CREATE POLICY "Public read lab_activities"
  ON lab_activities FOR SELECT USING (TRUE);


-- ─────────────────────────────────────────────────────────────
-- 5. SEED DATA — 2 Projects (1 featured, 1 regular)
-- ─────────────────────────────────────────────────────────────
INSERT INTO projects (id, title, slug, description, thumbnail_url, live_url, repo_url, tech_stack, is_featured)
VALUES
  (
    'proj_featured_001',
    'FinExtract',
    'finextract',
    'A desktop application that automatically extracts, parses, and categorises financial data from scanned PDF bank statements using OCR and rule-based NLP.',
    'https://placehold.co/800x450/1a1a2e/e2e8f0?text=FinExtract',
    NULL,
    'https://github.com/michael-aristyo/finextract',
    ARRAY['Python', 'CustomTkinter', 'pdfplumber', 'OpenCV'],
    TRUE
  ),
  (
    'proj_regular_001',
    'Portfolio v2',
    'portfolio-v2',
    'My personal portfolio website — built with Next.js 14 App Router, Tailwind CSS, Framer Motion, and powered by a Supabase PostgreSQL backend.',
    'https://placehold.co/800x450/0f172a/94a3b8?text=Portfolio+v2',
    'https://michael-aristyo.vercel.app',
    'https://github.com/michael-aristyo/portfolio',
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'Supabase'],
    FALSE
  )
ON CONFLICT (id) DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 6. SEED DATA — 2 Lab Activities
-- ─────────────────────────────────────────────────────────────
INSERT INTO lab_activities (id, role, image_url, description, sort_order, is_active)
VALUES
  (
    'lab_act_001',
    'Head Laboratory Assistant',
    'https://placehold.co/600x400/1e293b/94a3b8?text=Lab+Activity+1',
    'Supervised undergraduate practicum sessions, managed equipment inventory, and mentored junior assistants across three concurrent lab courses.',
    1,
    TRUE
  ),
  (
    'lab_act_002',
    'Practicum Tutor',
    'https://placehold.co/600x400/0f172a/64748b?text=Lab+Activity+2',
    'Delivered weekly tutorial sessions for the Digital Systems practicum, guiding students through FPGA board programming and logic circuit design.',
    2,
    TRUE
  )
ON CONFLICT (id) DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 7. VERIFICATION QUERIES (run after setup to confirm data)
-- ─────────────────────────────────────────────────────────────
-- SELECT * FROM projects;
-- SELECT * FROM lab_activities;
