import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Supabase Browser Client
//
// Ini adalah koneksi utama untuk mengambil data dari Supabase langsung
// di browser (Vite/React). Menggunakan PUBLISHABLE key (aman di browser).
//
// Untuk operasi yang butuh service-role (admin), gunakan server-side saja
// dan jangan pernah expose SUPABASE_SECRET_KEY ke browser.
// ---------------------------------------------------------------------------

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "[supabase.ts] VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diisi di file .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------------------------------------------------------------------------
// Typed helpers — memanfaatkan Row-Level Security yang sudah diset di SQL
// ---------------------------------------------------------------------------

export type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  live_url: string | null;
  repo_url: string | null;
  tech_stack: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Case study fields (added in migration-003)
  content: string | null;
  infographic_urls: string[];
};

export type LabActivityRow = {
  id: string;
  role: string;
  image_url: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// ─── Project queries ────────────────────────────────────────

/** Ambil semua project yang is_featured = true, terbaru dulu */
export async function getFeaturedProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[supabase.ts] getFeaturedProjects error:", error.message);
    return [];
  }
  return data ?? [];
}

/** Ambil semua project (featured tampil lebih dulu) */
export async function getAllProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[supabase.ts] getAllProjects error:", error.message);
    return [];
  }
  return data ?? [];
}

/** Ambil satu project berdasarkan slug-nya */
export async function getProjectBySlug(
  slug: string
): Promise<ProjectRow | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`[supabase.ts] getProjectBySlug("${slug}") error:`, error.message);
    return null;
  }
  return data;
}

// ─── Lab Activity queries ───────────────────────────────────

/** Ambil lab activities yang is_active = true, urut berdasarkan sort_order */
export async function getLabActivities(): Promise<LabActivityRow[]> {
  const { data, error } = await supabase
    .from("lab_activities")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[supabase.ts] getLabActivities error:", error.message);
    return [];
  }
  return data ?? [];
}

// ─── Other (non-featured) Project queries ───────────────────

/** Ambil project yang is_featured = false untuk grid "Other Personal Projects" */
export async function getOtherProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_featured", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[supabase.ts] getOtherProjects error:", error.message);
    return [];
  }
  return data ?? [];
}

// ─── Lab Gallery Items (Draggable Bento Board) ──────────────

export type LabGalleryItemRow = {
  id: string;
  type: string;        // 'image' or 'video'
  title: string;
  description: string;
  url: string;
  span: string;        // CSS grid span classes
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

/** Ambil semua gallery items aktif untuk Cognitive Draggable Board */
export async function getLabGalleryItems(): Promise<LabGalleryItemRow[]> {
  const { data, error } = await supabase
    .from("lab_gallery_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[supabase.ts] getLabGalleryItems error:", error.message);
    return [];
  }
  return data ?? [];
}
