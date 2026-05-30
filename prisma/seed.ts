/**
 * prisma/seed.ts
 *
 * Database seeding script for the Michael Aristyo Portfolio.
 *
 * Run with:
 *   npx prisma db seed
 *
 * Or directly:
 *   npx tsx prisma/seed.ts
 *
 * This script uses `upsert` so it is safely re-runnable (idempotent).
 * Re-running will overwrite existing seed rows but not delete any data
 * you have manually added.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("🌱  Starting database seed …");

  // ── Projects ──────────────────────────────────────────────
  const featuredProject = await prisma.project.upsert({
    where: { slug: "finextract" },
    update: {},
    create: {
      id: "proj_featured_001",
      title: "FinExtract",
      slug: "finextract",
      description:
        "A desktop application that automatically extracts, parses, and categorises financial data from scanned PDF bank statements using OCR and rule-based NLP.",
      thumbnailUrl:
        "https://placehold.co/800x450/1a1a2e/e2e8f0?text=FinExtract",
      liveUrl: null,
      repoUrl: "https://github.com/michael-aristyo/finextract",
      techStack: ["Python", "CustomTkinter", "pdfplumber", "OpenCV"],
      isFeatured: true,
    },
  });

  const regularProject = await prisma.project.upsert({
    where: { slug: "portfolio-v2" },
    update: {},
    create: {
      id: "proj_regular_001",
      title: "Portfolio v2",
      slug: "portfolio-v2",
      description:
        "My personal portfolio website — built with Next.js 14 App Router, Tailwind CSS, Framer Motion, and powered by a Supabase PostgreSQL backend.",
      thumbnailUrl:
        "https://placehold.co/800x450/0f172a/94a3b8?text=Portfolio+v2",
      liveUrl: "https://michael-aristyo.vercel.app",
      repoUrl: "https://github.com/michael-aristyo/portfolio",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Supabase"],
      isFeatured: false,
    },
  });

  // ── Lab Activities ────────────────────────────────────────
  const labActivity1 = await prisma.labActivity.upsert({
    where: { id: "lab_act_001" },
    update: {},
    create: {
      id: "lab_act_001",
      role: "Head Laboratory Assistant",
      imageUrl:
        "https://placehold.co/600x400/1e293b/94a3b8?text=Lab+Activity+1",
      description:
        "Supervised undergraduate practicum sessions, managed equipment inventory, and mentored junior assistants across three concurrent lab courses.",
      sortOrder: 1,
      isActive: true,
    },
  });

  const labActivity2 = await prisma.labActivity.upsert({
    where: { id: "lab_act_002" },
    update: {},
    create: {
      id: "lab_act_002",
      role: "Practicum Tutor",
      imageUrl:
        "https://placehold.co/600x400/0f172a/64748b?text=Lab+Activity+2",
      description:
        "Delivered weekly tutorial sessions for the Digital Systems practicum, guiding students through FPGA board programming and logic circuit design.",
      sortOrder: 2,
      isActive: true,
    },
  });

  console.log("✅  Seed complete!");
  console.log("   Projects:");
  console.log(`     • ${featuredProject.title} (featured: ${featuredProject.isFeatured})`);
  console.log(`     • ${regularProject.title} (featured: ${regularProject.isFeatured})`);
  console.log("   Lab Activities:");
  console.log(`     • ${labActivity1.role}`);
  console.log(`     • ${labActivity2.role}`);
}

main()
  .catch((error) => {
    console.error("❌  Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
