import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Clock,
  Calendar,
  Tag,
  ImageOff,
  Loader2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { getProjectBySlug, ProjectRow } from "@/lib/supabase";

// ─── Animation variants ────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.215, 0.61, 0.355, 1] as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

// ─── Helpers ───────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(text: string | null) {
  if (!text) return "2 min read";
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(2, Math.ceil(words / 200))} min read`;
}

// Split content on newlines into paragraphs (simple prose renderer)
function renderContent(content: string | null) {
  if (!content) return null;
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((para, i) => (
      <p key={i} className="text-zinc-300 leading-8 text-base sm:text-[17px] font-light">
        {para}
      </p>
    ));
}

// ─── Accent colour utilities ───────────────────────────────

/**
 * Converts a hex colour string ("#RRGGBB" or "#RGB") to an RGB object.
 * Returns null if the string is malformed.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace(/^#/, "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

/**
 * Build an inline style object containing CSS custom properties
 * derived from the project's accent_color.
 *
 * Properties injected:
 *   --accent        : full hex colour
 *   --accent-r/g/b  : individual RGB channels (for rgba() usage)
 */
function buildAccentVars(accentColor: string | null): React.CSSProperties {
  const fallback = "#006fee";
  const hex = accentColor ?? fallback;
  const rgb = hexToRgb(hex) ?? hexToRgb(fallback)!;
  return {
    "--accent": hex,
    "--accent-r": rgb.r,
    "--accent-g": rgb.g,
    "--accent-b": rgb.b,
  } as React.CSSProperties;
}

// ─── Loading State ─────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader2 className="w-8 h-8 text-[#006fee] animate-spin" />
        <p className="text-zinc-400 text-sm font-mono tracking-widest uppercase">
          Loading case study…
        </p>
      </motion.div>
    </div>
  );
}

// ─── 404 State ─────────────────────────────────────────────
function NotFoundScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 text-center max-w-sm"
      >
        <AlertTriangle className="w-12 h-12 text-amber-400" />
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">Project not found</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            This case study doesn't exist or hasn't been published yet.
          </p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#006fee] text-white rounded-full text-sm font-medium hover:bg-[#0080ff] transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </button>
      </motion.div>
    </div>
  );
}

// ─── Project Icon ──────────────────────────────────────────
function ProjectIcon({ iconUrl, title, accentColor }: {
  iconUrl: string | null;
  title: string;
  accentColor: string | null;
}) {
  const [imgError, setImgError] = useState(false);

  if (!iconUrl || imgError) return null;

  const hex = accentColor ?? "#006fee";
  const rgb = hexToRgb(hex);
  const glowColor = rgb
    ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`
    : "rgba(0, 111, 238, 0.35)";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
      className="flex-shrink-0"
    >
      <img
        src={iconUrl}
        alt={`${title} icon`}
        width={56}
        height={56}
        loading="eager"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          objectFit: "contain",
          background: "rgba(255,255,255,0.04)",
          padding: 4,
          boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 8px 24px ${glowColor}`,
          backdropFilter: "blur(4px)",
        }}
      />
    </motion.div>
  );
}

// ─── Infographics Gallery ──────────────────────────────────
function InfographicsGallery({ urls }: { urls: string[] }) {
  if (!urls || urls.length === 0) return null;
  return (
    <section className="py-20 px-6 bg-[#1a1a1c]">
      <div className="max-w-6xl mx-auto space-y-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          custom={0}
          className="space-y-2"
        >
          {/* Uses CSS variable so it matches the accent colour */}
          <span
            className="text-xs font-mono uppercase tracking-widest font-semibold"
            style={{ color: "var(--accent, #006fee)" }}
          >
            Visual Documentation
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Screenshots &amp; Architecture
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg">
            Visual breakdown of the system architecture, UI screens, and data pipeline diagrams.
          </p>
        </motion.div>

        {/* Responsive masonry-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {urls.map((url, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={i * 0.5}
              className={`group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 ${
                i === 0 ? "sm:col-span-2 aspect-[16/7]" : "aspect-[16/9]"
              }`}
            >
              <img
                src={url}
                alt={`Infographic ${i + 1}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.querySelector(
                    ".img-fallback"
                  )!.classList.remove("hidden");
                }}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Fallback icon if image fails */}
              <div className="img-fallback hidden absolute inset-0 flex items-center justify-center">
                <ImageOff className="w-8 h-8 text-zinc-600" />
              </div>
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Index badge */}
              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/10">
                {String(i + 1).padStart(2, "0")}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Component ────────────────────────────────────────
export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }
    setLoading(true);
    setNotFound(false);

    getProjectBySlug(slug)
      .then((data) => {
        if (!data) setNotFound(true);
        else setProject(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // Update document title when project is loaded
  useEffect(() => {
    if (project) {
      document.title = `${project.title} - Michael-dvs`;
    }
    return () => {
      document.title = "Home - Michael-dvs";
    };
  }, [project]);

  const handleBack = () => navigate("/");

  if (loading) return <LoadingScreen />;
  if (notFound || !project) return <NotFoundScreen onBack={handleBack} />;

  const readTime = estimateReadTime(project.content);
  const publishDate = formatDate(project.created_at);

  // ── Derive accent values ──
  const accentHex = project.accent_color ?? "#006fee";
  const accentRgb = hexToRgb(accentHex) ?? { r: 0, g: 111, b: 238 };
  const accentVars = buildAccentVars(project.accent_color);

  return (
    <AnimatePresence>
      <motion.div
        key={project.slug}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-[#1c1c1e] text-white"
        style={{
          fontFamily: "Inter, 'SF Pro Text', system-ui, sans-serif",
          ...accentVars,
        }}
      >

        {/* ── Sticky Nav ── */}
        <header className="sticky top-0 z-50 bg-[#1c1c1e]/80 backdrop-blur-xl border-b border-zinc-800/60">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Portfolio
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-zinc-500 overflow-hidden">
              <span className="truncate">Michael Aristyo</span>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Projects</span>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="truncate" style={{ color: "var(--accent, #006fee)" }}>
                {project.title}
              </span>
            </div>

            {/* Quick CTA links */}
            <div className="flex items-center gap-2">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-white rounded-full text-xs font-medium transition-all active:scale-95"
                  style={{
                    background: `var(--accent, #006fee)`,
                  }}
                >
                  <ExternalLink className="w-3 h-3" />
                  Live Demo
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="github-btn flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 text-zinc-300 rounded-full text-xs font-medium hover:text-white transition-all active:scale-95"
                  style={
                    {
                      "--github-hover-border": `${accentHex}88`,
                    } as React.CSSProperties
                  }
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = `${accentHex}80`;
                    el.style.backgroundColor = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.06)`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "";
                    el.style.backgroundColor = "";
                  }}
                >
                  <Github className="w-3 h-3" />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </header>

        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0d1117] via-[#1a1f2e] to-[#1c1c1e] px-6 pt-20 pb-24">
          {/* Ambient glow — uses accent colour */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.07] blur-3xl pointer-events-none"
            style={{
              background: `radial-gradient(ellipse, ${accentHex} 0%, transparent 70%)`,
            }}
          />

          <div className="max-w-4xl mx-auto relative space-y-8">
            {/* Meta row */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="flex flex-wrap items-center gap-3"
            >
              {/* ── FEATURED / CASE STUDY badge — accent themed ── */}
              <span
                className="inline-flex items-center px-3 py-1 text-[10px] rounded-full font-mono tracking-widest border"
                style={{
                  background: `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.12)`,
                  color: accentHex,
                  borderColor: `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.30)`,
                }}
              >
                {project.is_featured ? "FEATURED PROJECT" : "CASE STUDY"}
              </span>
              <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                <Calendar className="w-3.5 h-3.5" />
                {publishDate}
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                <Clock className="w-3.5 h-3.5" />
                {readTime}
              </div>
            </motion.div>

            {/* ── Title row with project icon ── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="flex items-center gap-5"
            >
              {/* Project icon with accent glow */}
              <ProjectIcon
                iconUrl={project.icon_url}
                title={project.title}
                accentColor={project.accent_color}
              />

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.1]">
                {project.title}
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-zinc-400 font-light leading-relaxed max-w-2xl"
            >
              {project.description}
            </motion.p>

            {/* Tech stack pills */}
            {project.tech_stack.length > 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={3}
                className="flex flex-wrap gap-2"
              >
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono mr-1">
                  <Tag className="w-3 h-3" />
                  Tech Stack
                </div>
                {project.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs font-mono text-zinc-300 transition-colors"
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLSpanElement;
                      el.style.borderColor = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.5)`;
                      el.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLSpanElement;
                      el.style.borderColor = "";
                      el.style.color = "";
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Hero CTA Buttons */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-7 py-3 text-white rounded-full text-sm font-medium transition-all active:scale-95 shadow-md"
                  style={{
                    background: accentHex,
                    boxShadow: `0 4px 20px rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.35)`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      `0 0 24px rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.55)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      `0 4px 20px rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.35)`;
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Official Website / Live Demo
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-7 py-3 border border-zinc-600 text-zinc-200 rounded-full text-sm font-medium transition-all active:scale-95"
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.65)`;
                    el.style.backgroundColor = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.07)`;
                    el.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "";
                    el.style.backgroundColor = "";
                    el.style.color = "";
                  }}
                >
                  <Github className="w-4 h-4" />
                  GitHub Repository
                </a>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── Hero Thumbnail ── */}
        {project.thumbnail_url && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="px-6 -mt-6 pb-0 max-w-5xl mx-auto"
          >
            <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-zinc-900 aspect-[16/8]">
              <img
                src={project.thumbnail_url}
                alt={`${project.title} preview`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* ── Infographics Gallery ── */}
        <InfographicsGallery urls={project.infographic_urls} />

        {/* ── Documentation / Content ── */}
        {project.content && (
          <section className="py-20 px-6 bg-[#1c1c1e]">
            <div className="max-w-3xl mx-auto space-y-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                custom={0}
                className="space-y-2"
              >
                <span
                  className="text-xs font-mono uppercase tracking-widest font-semibold"
                  style={{ color: "var(--accent, #006fee)" }}
                >
                  Case Study
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                  Project Documentation
                </h2>
              </motion.div>

              {/* Divider — accent gradient */}
              <div
                className="h-px"
                style={{
                  background: `linear-gradient(to right, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.45), rgb(63 63 70), transparent)`,
                }}
              />

              {/* Prose content */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                custom={1}
                className="space-y-6"
              >
                {renderContent(project.content)}
              </motion.div>
            </div>
          </section>
        )}

        {/* ── Footer CTA ── */}
        <section className="py-20 px-6 bg-[#141416] border-t border-zinc-800">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="space-y-3"
            >
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                Want to explore more?
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                {project.title}
              </h2>
              <p className="text-zinc-400 text-sm max-w-md mx-auto">
                {project.live_url && project.repo_url
                  ? "Check out the live product or dive into the source code below."
                  : project.repo_url
                  ? "The full source code is available on GitHub."
                  : "Reach out if you'd like to learn more about this project."}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-8 py-3.5 text-white rounded-full text-sm font-medium transition-all active:scale-95 shadow-md"
                  style={{
                    background: accentHex,
                    boxShadow: `0 4px 24px rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.35)`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      `0 0 28px rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.55)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      `0 4px 24px rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.35)`;
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Official Website
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-8 py-3.5 border border-zinc-600 text-zinc-200 rounded-full text-sm font-medium transition-all active:scale-95"
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.65)`;
                    el.style.backgroundColor = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.07)`;
                    el.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "";
                    el.style.backgroundColor = "";
                    el.style.color = "";
                  }}
                >
                  <Github className="w-4 h-4" />
                  GitHub Repository
                </a>
              )}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-8 py-3.5 text-zinc-400 hover:text-white text-sm font-medium transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                Back to Portfolio
              </button>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );
}
