/**
 * lib/data.ts
 *
 * Typed data-fetching utilities for the Michael Aristyo Portfolio.
 *
 * These functions run exclusively on the server (Next.js Server Components /
 * Server Actions / Route Handlers). Never import this file into a Client
 * Component — doing so will expose your database to the browser bundle.
 *
 * Usage example inside a Server Component:
 *   import { getFeaturedProjects } from "@/lib/data";
 *   const featured = await getFeaturedProjects();
 */

import { prisma } from "@/lib/prisma";
import type { Project, LabActivity } from "@prisma/client";

// ---------------------------------------------------------------------------
// Re-export Prisma types so consumers don't need to import from @prisma/client
// ---------------------------------------------------------------------------
export type { Project, LabActivity };

// ---------------------------------------------------------------------------
// Convenience type: Project without server-side fields you may want to hide
// ---------------------------------------------------------------------------
export type ProjectCard = Pick<
  Project,
  | "id"
  | "title"
  | "slug"
  | "description"
  | "thumbnailUrl"
  | "liveUrl"
  | "repoUrl"
  | "techStack"
  | "isFeatured"
  | "createdAt"
>;

export type LabActivityCard = Pick<
  LabActivity,
  "id" | "role" | "imageUrl" | "description" | "sortOrder"
>;

// ─────────────────────────────────────────────────────────────
// PROJECT QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Fetch only the projects marked as `isFeatured = true`.
 * Ordered by most recently created first.
 * Returns a lightweight subset of columns (ProjectCard).
 */
export async function getFeaturedProjects(): Promise<ProjectCard[]> {
  try {
    return await prisma.project.findMany({
      where: { isFeatured: true },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnailUrl: true,
        liveUrl: true,
        repoUrl: true,
        techStack: true,
        isFeatured: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("[data.ts] getFeaturedProjects failed:", error);
    // Return an empty array so the UI degrades gracefully
    return [];
  }
}

/**
 * Fetch every project, regardless of `isFeatured` status.
 * Featured projects are listed first, then ordered by creation date.
 */
export async function getAllProjects(): Promise<ProjectCard[]> {
  try {
    return await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnailUrl: true,
        liveUrl: true,
        repoUrl: true,
        techStack: true,
        isFeatured: true,
        createdAt: true,
      },
      orderBy: [
        { isFeatured: "desc" }, // featured projects come first
        { createdAt: "desc" },
      ],
    });
  } catch (error) {
    console.error("[data.ts] getAllProjects failed:", error);
    return [];
  }
}

/**
 * Fetch only the projects that are NOT marked as featured.
 * Ordered by creation date descending.
 */
export async function getOtherProjects(): Promise<ProjectCard[]> {
  try {
    return await prisma.project.findMany({
      where: { isFeatured: false },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnailUrl: true,
        liveUrl: true,
        repoUrl: true,
        techStack: true,
        isFeatured: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("[data.ts] getOtherProjects failed:", error);
    return [];
  }
}


/**
 * Fetch a single project by its unique slug.
 * Returns `null` if no matching project is found.
 */
export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  try {
    return await prisma.project.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error(`[data.ts] getProjectBySlug("${slug}") failed:`, error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// LAB ACTIVITY QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Fetch all *active* lab activities, ordered by `sortOrder` ascending.
 * Inactive entries (isActive = false) are excluded from the public gallery.
 */
export async function getLabActivities(): Promise<LabActivityCard[]> {
  try {
    return await prisma.labActivity.findMany({
      where: { isActive: true },
      select: {
        id: true,
        role: true,
        imageUrl: true,
        description: true,
        sortOrder: true,
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("[data.ts] getLabActivities failed:", error);
    return [];
  }
}

/**
 * Fetch ALL lab activities (including inactive ones).
 * Useful for an admin dashboard or CMS preview.
 */
export async function getAllLabActivities(): Promise<LabActivity[]> {
  try {
    return await prisma.labActivity.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("[data.ts] getAllLabActivities failed:", error);
    return [];
  }
}
