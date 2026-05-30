-- ============================================================
-- Michael Aristyo Portfolio — Migration 002
-- New table: lab_gallery_items (for the Draggable Bento Gallery)
--
-- Run this in the Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- 1. TABLE: lab_gallery_items
-- Stores media items for the interactive draggable bento gallery.
-- Each item can be an image or video with a CSS grid span class.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lab_gallery_items (
  id          TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  type        TEXT        NOT NULL DEFAULT 'image',       -- 'image' or 'video'
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  url         TEXT        NOT NULL,                       -- image/video source URL
  span        TEXT        NOT NULL DEFAULT 'md:col-span-1 md:row-span-2',  -- CSS grid classes
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT lab_gallery_items_pkey PRIMARY KEY (id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lab_gallery_items_active     ON lab_gallery_items (is_active);
CREATE INDEX IF NOT EXISTS idx_lab_gallery_items_sort_order ON lab_gallery_items (sort_order ASC);

-- Auto-update trigger (reuses the function created in migration 001)
DROP TRIGGER IF EXISTS set_lab_gallery_items_updated_at ON lab_gallery_items;
CREATE TRIGGER set_lab_gallery_items_updated_at
  BEFORE UPDATE ON lab_gallery_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ─────────────────────────────────────────────────────────────
-- 2. ROW-LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
ALTER TABLE lab_gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read lab_gallery_items" ON lab_gallery_items;
CREATE POLICY "Public read lab_gallery_items"
  ON lab_gallery_items FOR SELECT USING (TRUE);


-- ─────────────────────────────────────────────────────────────
-- 3. SEED DATA — 7 gallery items (matching current UI layout)
-- ─────────────────────────────────────────────────────────────
INSERT INTO lab_gallery_items (id, type, title, description, url, span, sort_order, is_active)
VALUES
  (
    'gallery_001',
    'image',
    'Gunadarma Computing Lab',
    'Coaching over 120 Informatics undergraduates weekly in core algorithm practicals.',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2',
    1,
    TRUE
  ),
  (
    'gallery_002',
    'video',
    'AI Inference Testing',
    'Conducting local model benchmarking utilizing ollama shell scripts.',
    'https://cdn.pixabay.com/video/2021/10/12/91632-638069344_large.mp4',
    'md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2',
    2,
    TRUE
  ),
  (
    'gallery_003',
    'image',
    'Data Science Research Lab',
    'Deep-diving into GIS geographic mapping algorithms during quiet research windows.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-2',
    3,
    TRUE
  ),
  (
    'gallery_004',
    'image',
    'Algorithm Hackathon Hub',
    'Collaborating with local teams during overnight competitive code challenges.',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2',
    4,
    TRUE
  ),
  (
    'gallery_005',
    'video',
    'Nextcloud Infrastructure Test',
    'Orchestrating container filesystems and private cloud directories.',
    'https://cdn.pixabay.com/video/2020/07/30/46026-447087782_large.mp4',
    'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2',
    5,
    TRUE
  ),
  (
    'gallery_006',
    'image',
    'Technical Mentorship',
    'Guiding juniors in syntax structuring, repository branching, and Git conventions.',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
    'md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2',
    6,
    TRUE
  ),
  (
    'gallery_007',
    'video',
    'FinExtract Automation Live',
    'Running automated spreadsheet compiling tests.',
    'https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4',
    'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2',
    7,
    TRUE
  )
ON CONFLICT (id) DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 4. VERIFICATION
-- ─────────────────────────────────────────────────────────────
-- SELECT * FROM lab_gallery_items ORDER BY sort_order;
