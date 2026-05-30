import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { 
  ArrowRight, Download, Github, Linkedin, Mail, ExternalLink, 
  Terminal, Server, Brain, Code, BookOpen, Layers, Monitor, ChevronLeft, ChevronRight, Menu, X
} from "lucide-react";
import { ThemeProvider, Footer, ThemeToggle } from "@/components/ui/footer";
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";
import { GlassBlogCard } from "@/components/ui/glass-blog-card-shadcnui";
import IntegrationHero from "@/components/ui/integration-hero";
import { Button } from "@/components/ui/button";
import { SectionDivider } from "@/components/ui/section-divider";
import { InteractiveGrid } from "@/components/ui/interactive-grid";
import { getFeaturedProjects, getOtherProjects, getLabActivities, getLabGalleryItems, ProjectRow, LabActivityRow, LabGalleryItemRow } from "@/lib/supabase";
import type { MediaItemType } from "@/components/ui/interactive-bento-gallery";

// Technical skills mapping for the configurator option chip layout
const SKILLS_LIST = [
  { 
    name: "Python", 
    icon: "🐍", 
    category: "Core & Data Science",
    paradigm: "Architecting high-performance numeric workflows, vectorized operations using micro-indexing (Pandas/NumPy), and spatial data representations backed by GIS raster-vector frameworks (GDAL, Shapely, GeoPandas)." 
  },
  { 
    name: "Golang", 
    icon: "🐹", 
    category: "Backend Systems",
    paradigm: "Engineering concurrent backends utilizing channel multiplexing, Goroutine pool sizing, customized context propagation, and highly optimized network packet routing." 
  },
  { 
    name: "C#", 
    icon: "⚙️", 
    category: "Enterprise App",
    paradigm: "Modeling distributed business components under .NET Core, implementing asynchronous thread scheduling queues, and developing hardware-layer integration routines." 
  },
  { 
    name: "Java", 
    icon: "☕", 
    category: "Core Systems",
    paradigm: "Structuring deep object-oriented algorithms, JVM garbage-collector and memory footprint analysis, and highly responsive multi-threaded server orchestration." 
  },
  { 
    name: "SQL", 
    icon: "💾", 
    category: "Databases",
    paradigm: "Designing declarative schemas, formulating spatial indexing constructs (PostGIS R-Tree), indexing deep hierarchy sets (recursive CTEs), and query plan compiling." 
  },
  { 
    name: "CSS / Tailwind", 
    icon: "🎨", 
    category: "Front-End",
    paradigm: "Building scalable visual designs, implementing device-agnostic fluid breakpoints, utilizing hardware-accelerated animations, and maintaining design tokens." 
  },
  { 
    name: "SwiftUI", 
    icon: "📱", 
    category: "Mobile iOS",
    paradigm: "Designing native declarative layouts with reactive data-binding state, high-fidelity responsive layouts, and performance-tuned background thread integrations." 
  },
  { 
    name: "Docker", 
    icon: "🐳", 
    category: "Infrastructure",
    paradigm: "Assembling secure, containerized deployment systems, minimizing runtime dependencies with multi-stage compilations, and setting local sandboxed integration layers." 
  },
  { 
    name: "Nextcloud", 
    icon: "☁️", 
    category: "Deployment",
    paradigm: "Architecting decentralized file systems, metadata syncing interfaces, distributed session caching databases, and container-backed remote storage nodes." 
  },
  { 
    name: "LLMs (DeepSeek/Ollama)", 
    icon: "🧠", 
    category: "AI Orchestration",
    paradigm: "Assembling local generative pipelines, orchestrating parameters on local quantized hardware (Ollama), parsing contextual prompt streams, and designing offline agent frameworks." 
  }
];

// Carousel media items representing university lab life and coding sprints
const LAB_MEDIA_ITEMS = [
  {
    id: 1,
    type: "image",
    title: "Gunadarma Computing Lab",
    desc: "Coaching over 120 Informatics undergraduates weekly in core algorithm practicals.",
    url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
  },
  {
    id: 2,
    type: "video",
    title: "AI Inference Testing",
    desc: "Conducting local model benchmarking utilizing ollama shell scripts.",
    url: "https://cdn.pixabay.com/video/2021/10/12/91632-638069344_large.mp4",
    span: "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
  },
  {
    id: 3,
    type: "image",
    title: "Data Science Research Lab",
    desc: "Deep-diving into GIS geographic mapping algorithms during quiet research windows.",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    span: "md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-2 ",
  },
  {
    id: 4,
    type: "image",
    title: "Algorithm Hackathon Hub",
    desc: "Collaborating with local teams during overnight competitive code challenges.",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2 ",
  },
  {
    id: 5,
    type: "video",
    title: "Nextcloud Infrastructure Test",
    desc: "Orchestrating container filesystems and private cloud directories.",
    url: "https://cdn.pixabay.com/video/2020/07/30/46026-447087782_large.mp4",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 ",
  },
  {
    id: 6,
    type: "image",
    title: "Technical Mentorship",
    desc: "Guiding juniors in syntax structuring, repository branching, and Git conventions.",
    url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
    span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2 ",
  },
  {
    id: 7,
    type: "video",
    title: "FinExtract Automation Live",
    desc: "Running automated spreadsheet compiling tests.",
    url: "https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 ",
  }
];

const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1] as const
    }
  }
};

function PortfolioContent() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  
  // Dynamic Supabase data states
  const [dbProjects, setDbProjects] = useState<ProjectRow[]>([]);
  const [dbOtherProjects, setDbOtherProjects] = useState<ProjectRow[]>([]);
  const [dbLabActivities, setDbLabActivities] = useState<LabActivityRow[]>([]);
  const [dbLabGalleryItems, setDbLabGalleryItems] = useState<LabGalleryItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsData, otherProjectsData, labData, galleryData] = await Promise.all([
          getFeaturedProjects(),
          getOtherProjects(),
          getLabActivities(),
          getLabGalleryItems()
        ]);
        setDbProjects(projectsData);
        setDbOtherProjects(otherProjectsData);
        setDbLabActivities(labData);
        setDbLabGalleryItems(galleryData);
      } catch (err) {
        console.error("Gagal memuat data dari Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out coordinate tracking
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Map mouse coordinates to angles of rotation
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [8, -8]); // Tilt up to 8 degrees
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse coords relative to element
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Normalize between -0.5 and 0.5
    const normalizedX = (mouseX / width) - 0.5;
    const normalizedY = (mouseY / height) - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    x.set(0);
  };
  
  // Carousel implementation state for "Life at the Lab" visual
  const [activeLabImage, setActiveLabImage] = useState(0);
  
  // Fallback static carousel images, updated by Supabase activities if available
  const labCarouselImages = dbLabActivities.length > 0
    ? dbLabActivities.map(act => ({
        src: act.image_url,
        caption: `${act.role} — ${act.description}`
      }))
    : [
        {
          src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
          caption: "Teaching practicum classes in programming paradigms and software architecture."
        },
        {
          src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
          caption: "Collaboratively wireframing GIS database components at LePKom Labs."
        },
        {
          src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
          caption: "Mentoring Informatics engineering juniors during intensive programming labs."
        }
      ];

  const handleNextLabImage = () => {
    setActiveLabImage((prev) => (prev + 1) % labCarouselImages.length);
  };

  const handlePrevLabImage = () => {
    setActiveLabImage((prev) => (prev - 1 + labCarouselImages.length) % labCarouselImages.length);
  };

  // Touch Swipe Gesture State & Handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNextLabImage();
    } else if (distance < -minSwipeDistance) {
      handlePrevLabImage();
    }
  };

  // Keyboard navigation listener (ArrowLeft / ArrowRight) with input evasion
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        handlePrevLabImage();
      } else if (e.key === "ArrowRight") {
        handleNextLabImage();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [activeLabImage]);

  const triggerDownload = () => {
    // Generate standard download callback for Michael
    alert("Michael Aristyo's latest academic resume is being prepared for download.\nCredentials Profile: Gunadarma Informatics (GPA: 3.89).");
  };

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      
      {/* 1. Global Navigation (global-nav) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#000000] border-b border-zinc-800 text-white backdrop-blur-md opacity-95 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          
          {/* Logo / Left name */}
          <a 
            href="#" 
            onClick={() => setMobileMenuOpen(false)}
            className="font-semibold text-sm tracking-tight hover:opacity-80 active:scale-95 transition-transform duration-100 flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#0066cc]" />
            <span>Michael Aristyo</span>
          </a>

          {/* Desktop Links (Right side) */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-light text-zinc-350">
            <a href="#projects" className="hover:text-white transition-colors duration-150 active:scale-95">Projects</a>
            <a href="#skills" className="hover:text-white transition-colors duration-150 active:scale-95">Tools & Stack</a>
            <a href="#lab" className="hover:text-white transition-colors duration-150 active:scale-95">Life at the Lab</a>
            <a href="#other-projects" className="hover:text-white transition-colors duration-150 active:scale-95">Other Apps</a>
            <a href="#contact" className="hover:text-white transition-colors duration-150 active:scale-95 px-3 py-1 bg-[#0066cc] rounded-full text-white font-medium hover:bg-[#0071e3]">Download CV</a>
          </div>

          {/* Mobile hamburger button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-zinc-400 hover:text-white p-1 hover:bg-zinc-900 rounded-lg active:scale-95 transition-all"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/80 backdrop-blur-xl border-b border-zinc-800 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-3 flex flex-col text-sm font-light">
            <a 
              href="#projects" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-white transition-colors py-1"
            >
              Projects
            </a>
            <a 
              href="#skills" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-white transition-colors py-1"
            >
              Tools & Stack
            </a>
            <a 
              href="#lab" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-white transition-colors py-1"
            >
              Life at the Lab
            </a>
            <a 
              href="#other-projects" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-white transition-colors py-1"
            >
              Other Apps
            </a>
            <a 
              href="#contact" 
              onClick={() => { setMobileMenuOpen(false); triggerDownload(); }}
              className="inline-flex items-center justify-center py-2 px-4 bg-[#0066cc] text-white rounded-full font-medium active:scale-95 transition-all text-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Latest Resume
            </a>
          </div>
        )}
      </nav>

      {/* Adjust viewport for sticky nav bar */}
      <div className="pt-12" />

      {/* 2. Heroes Section (product-tile-light in side-by-side split screen with Infinite Interactive Scrolling Grid) */}
      <section className="relative bg-[#212124] py-20 px-6 overflow-hidden md:py-28 select-none">
        
        {/* Dynamic Interactive Infinite Scrolling Grid Layer */}
        <InteractiveGrid />

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (Content) - pointer-events-none to let mouse grid-tracking pass through seamlessly */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.1
                }
              }
            }}
            className="md:col-span-7 flex flex-col items-start text-left space-y-6 pointer-events-none"
          >
            <motion.span 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
              className="inline-block px-3.5 py-1 text-xs font-semibold rounded-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 pointer-events-auto"
            >
              Available for Fall 2026 Opportunities
            </motion.span>

            {/* Headline: Use 56px displays with negative tracking */}
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.28px] text-white leading-[1.07] font-display"
            >
              Michael Aristyo Rahadiyan
            </motion.h1>

            {/* Tagline: lead font style to outline credentials */}
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
              className="text-lg sm:text-xl font-light text-zinc-300 leading-relaxed font-sans max-w-2xl"
            >
              Software Engineer &amp; Data Science Enthusiast. Dedicated Informatics Engineering student (6th Semester, <span className="font-semibold text-sky-400">3.89 GPA</span>) at Universitas Gunadarma.
            </motion.p>

            {/* Action Buttons: side-by-side, aligned to the left */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
              className="flex flex-row flex-wrap items-center gap-4 pt-2 pointer-events-auto"
            >
              <Button 
                onClick={() => {
                  const target = document.getElementById("projects");
                  if (target) target.scrollIntoView({ behavior: "smooth" });
                }}
                className="font-medium active:scale-95 transition-transform"
              >
                Explore Featured Projects
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Button>
              <a 
                href="#contact" 
                className="h-11 px-6 rounded-full inline-flex items-center justify-center text-sm font-medium border border-zinc-800 text-zinc-300 bg-transparent hover:bg-zinc-900 active:scale-95 transition-all duration-150"
              >
                Contact Michael
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column (Visual aspect - remains interactive) */}
          <div className="md:col-span-5 w-full flex flex-col items-center justify-center pointer-events-auto" style={{ perspective: "1200px" }}>
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-[#212124] to-transparent z-10 bottom-0 h-16 pointer-events-none" />
              
              {/* Interactive mouse follow tilt wrapper */}
              <motion.div 
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d"
                }}
                whileHover={{ scale: 1.015 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="apple-portrait-shadow rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/40 cursor-pointer select-none relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80" 
                  alt="Michael Aristyo Portrait" 
                  className="w-full aspect-[4/3] md:aspect-[3/4] object-cover mix-blend-normal object-top pointer-events-none select-none max-h-[480px]"
                  style={{ transform: "translateZ(10px)" }}
                  referrerPolicy="no-referrer"
                />
                
                {/* Float tag representation */}
                <div 
                  style={{ transform: "translateZ(25px)" }}
                  className="absolute top-4 right-4 bg-black/85 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-mono border border-zinc-800 font-semibold text-sky-400 pointer-events-none select-none shadow-md"
                >
                  Jakarta, ID
                </div>
              </motion.div>
              
              <p className="mt-4 text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <span>Portrait Representation</span>
                <span>•</span>
                <span>Michael Aristyo</span>
              </p>
            </div>
          </div>

        </div>
      </section>
      <SectionDivider />
      <section id="projects" className="divide-y divide-gray-100 dark:divide-zinc-900">
        
        {/* Dynamic Project mapping from Supabase */}
        {dbProjects.length > 0 ? (
          dbProjects.map((project, index) => (
            <motion.div 
              key={project.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className={`group ${index % 2 === 0 ? "bg-[#272729]" : "bg-[#212124]"} text-white py-24 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ease-in-out hover:bg-zinc-900/80`}
            >
              <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Project Specs */}
                <div className={`lg:col-span-5 space-y-6 text-left ${index % 2 !== 0 ? "lg:order-2" : "lg:order-1"}`}>
                  <span className="inline-block px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300 font-mono tracking-widest border border-zinc-700 transition-all duration-300 group-hover:border-[#006fee] group-hover:bg-zinc-850 group-hover:text-white shadow-sm">
                    {project.is_featured ? "FEATURED AI PROJECT" : "PORTFOLIO PROJECT"}
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight font-display">
                    {project.title}
                  </h2>
                  <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tech_stack.map(tech => (
                      <span key={tech} className="px-2.5 py-1 rounded-md bg-zinc-850 border border-zinc-700 text-xs font-mono text-zinc-350 transition-all duration-300 group-hover:border-zinc-500 group-hover:bg-[#f5f5f7]/5 group-hover:text-white">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-4">
                    {/* Case Study CTA — always visible */}
                    <button
                      onClick={() => navigate(`/projects/${project.slug}`)}
                      className="px-6 py-2.5 bg-[#006fee] text-white rounded-full text-xs font-medium hover:bg-[#007ef3] hover:shadow-[0_0_15px_rgba(0,111,238,0.4)] transition-all active:scale-95 cursor-pointer shadow-sm flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Case Study
                    </button>
                    {project.live_url && (
                      <a 
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-2.5 border border-zinc-650 text-zinc-100 rounded-full text-xs font-medium hover:bg-zinc-800 transition-all active:scale-95 flex items-center gap-2 bg-transparent"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                    {project.repo_url && (
                      <a 
                        href={project.repo_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-6 py-2.5 border border-zinc-650 text-zinc-100 rounded-full text-xs font-medium hover:bg-zinc-800 transition-all active:scale-95 flex items-center gap-2 bg-transparent"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>

                {/* Mockup image */}
                <div className={`lg:col-span-7 ${index % 2 !== 0 ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="apple-mockup-shadow rounded-2xl overflow-hidden border border-zinc-805 bg-[#1d1d1f] p-2 aspect-[16/10] relative transition-transform duration-300 ease-in-out group-hover:-translate-y-1">
                    <img 
                      src={project.thumbnail_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

              </div>
            </motion.div>
          ))
        ) : (
          <>
            {/* Fallback Static project 1 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="group bg-[#272729] text-white py-24 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ease-in-out hover:bg-[#2a2a2c]"
            >
              <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 space-y-6 text-left">
                  <span className="inline-block px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300 font-mono tracking-widest border border-zinc-700 transition-all duration-300 group-hover:border-[#006fee] shadow-sm">
                    FEATURED AI PROJECT
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight font-display">
                    TrashMap AI
                  </h2>
                  <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
                    Integrating GIS (Geographic Information Systems) and Large Language Models for waste management.
                  </p>
                </div>
                <div className="lg:col-span-7">
                  <div className="apple-mockup-shadow rounded-2xl overflow-hidden border border-zinc-805 bg-[#1d1d1f] p-2 aspect-[16/10] relative transition-transform duration-300 group-hover:-translate-y-1">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover rounded-xl" alt="TrashMap" />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

      </section>

      {/* 4. GitHub Project Gallery (store-utility-card Grid) */}
      <motion.section 
        id="other-projects" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="bg-[#f5f5f7] dark:bg-zinc-950 py-24 px-6 transition-colors"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center md:text-left">
            <span className="text-xs font-mono text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">
              RECURRING CODE REPOSITORIES
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
              Other Personal Projects
            </h2>
          </div>

          {/* Dynamic 3-column grid from Supabase — non-featured projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            
            {dbOtherProjects.length > 0 ? (
              dbOtherProjects.map((project) => {
                // Derive display-friendly date from created_at
                const displayDate = new Date(project.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                // Rough read-time estimate from description length
                const readTime = `${Math.max(2, Math.ceil(project.description.length / 200))} min read`;

                return (
                  <GlassBlogCard
                    key={project.id}
                    title={project.title}
                    excerpt={project.description}
                    tags={project.tech_stack}
                    image={project.thumbnail_url}
                    date={displayDate}
                    readTime={readTime}
                    actionText={project.repo_url ? "View Code on GitHub ↗" : "View Project ↗"}
                    onActionClick={() => {
                      const url = project.repo_url || project.live_url;
                      if (url) window.open(url, "_blank");
                    }}
                    author={{
                      name: "Michael Aristyo",
                      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=50&q=80",
                    }}
                  />
                );
              })
            ) : (
              /* Fallback — 3 static cards shown while data loads or if DB is empty */
              <>
                <GlassBlogCard
                  title="Windows-System-Indexer"
                  excerpt="A robust Python multi-threaded CLI utility for high-speed scraping and caching of local file metadata structures on Windows partitions."
                  tags={["Python", "CLI", "OS APIs"]}
                  image="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80"
                  date="March 12, 2026"
                  readTime="4 min read"
                  actionText="View Code on GitHub ↗"
                  onActionClick={() => window.open("https://github.com", "_blank")}
                  author={{ name: "Michael Aristyo", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=50&q=80" }}
                />
                <GlassBlogCard
                  title="Twin Talk Summary Tool"
                  excerpt="A lightweight Google Chrome extension using Gemini API models to read YouTube transcript streams and deliver visual digests on-click."
                  tags={["Chrome Ext", "AI / LLM", "JavaScript"]}
                  image="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80"
                  date="January 28, 2026"
                  readTime="6 min read"
                  actionText="View Code on GitHub ↗"
                  onActionClick={() => window.open("https://github.com", "_blank")}
                  author={{ name: "Michael Aristyo", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=50&q=80" }}
                />
                <GlassBlogCard
                  title="Informatics Lab Hub"
                  excerpt="An automated queue scheduling assistant used in LePKom classes to distribute live algorithm tests and monitor student answers."
                  tags={["Vite React", "Node Server", "Practicum"]}
                  image="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80"
                  date="October 15, 2025"
                  readTime="8 min read"
                  actionText="Read Docs ↗"
                  onActionClick={() => alert("Redirecting to LePKom scheduler documentation portal...")}
                  author={{ name: "LePKom Mentor Team", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=50&q=80" }}
                />
              </>
            )}

          </div>

        </div>
      </motion.section>

      <SectionDivider />

      {/* 5. Tech Stack & Skills (configurator-option-chip Grid wrapped in relative layout) */}
      <section id="skills" className="bg-[#212124] text-white py-24 px-6 relative border-t border-zinc-800 transition-colors">
        <div className="max-w-4xl mx-auto space-y-10 text-center relative">
          
          <div className="space-y-4">
            <span className="text-xs font-mono text-sky-400 font-semibold uppercase tracking-widest block font-display">
              Configurator Option Chip Layout
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight font-display">
              Tools &amp; Technologies
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-light font-sans">
              Meticulously structured stack aligned to modern computer engineering and geographic systems optimization. Hover over or click options below.
            </p>
          </div>

          {/* Flexible wrap of configurator option chips with thin borders in a relative container */}
          <div className="relative flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto pt-6">
            {SKILLS_LIST.map((chip) => {
              const matchesActive = activeTech === chip.name || hoveredTech === chip.name;
              return (
                <button
                  key={chip.name}
                  onClick={() => setActiveTech(activeTech === chip.name ? null : chip.name)}
                  onMouseEnter={() => setHoveredTech(chip.name)}
                  onMouseLeave={() => setHoveredTech(null)}
                  className={`
                    px-5 py-2.5 rounded-full border text-xs sm:text-sm font-medium tracking-tight cursor-pointer 
                    transition-all duration-200 active:scale-95 shadow-md flex items-center gap-2 outline-none
                    ${matchesActive 
                      ? "bg-[#f5f5f7] text-[#1d1d1f] border-transparent scale-[1.03] shadow-[0_0_15px_rgba(255,255,255,0.15)]" 
                      : "bg-[#272729] border-zinc-850 text-zinc-300 hover:bg-zinc-800 hover:text-white"}
                  `}
                >
                  <span>{chip.icon}</span>
                  <span>{chip.name}</span>
                </button>
              );
            })}
          </div>

          {/* Coordinated dynamic paradigm presentation panel */}
          <div className="relative mt-8 min-h-[125px] flex items-center justify-center pt-2">
            <motion.div
              key={hoveredTech || activeTech || "empty"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className="w-full max-w-xl p-6 rounded-2xl bg-[#272729]/80 border border-zinc-800 backdrop-blur-sm mx-auto shadow-xl"
            >
              {(hoveredTech || activeTech) ? (
                <div className="space-y-2 text-center">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-semibold flex items-center justify-center gap-1.5">
                    <span>{SKILLS_LIST.find(c => c.name === (hoveredTech || activeTech))?.icon}</span>
                    <span>{(hoveredTech || activeTech)} Paradigm &mdash; {SKILLS_LIST.find(c => c.name === (hoveredTech || activeTech))?.category}</span>
                  </div>
                  <p className="text-sm font-light text-zinc-200 leading-relaxed max-w-lg mx-auto">
                    {SKILLS_LIST.find(c => c.name === (hoveredTech || activeTech))?.paradigm}
                  </p>
                </div>
              ) : (
                <p className="text-xs font-mono text-zinc-500 text-center py-4">
                  💡 Interactive Desk: Hover or tap any option chip above to inspect its associated engineering paradigms natively.
                </p>
              )}
            </motion.div>
          </div>

        </div>
      </section>

      <SectionDivider />

      {/* Integration Hero Technology Carousel */}
      <IntegrationHero />

      <SectionDivider />

      {/* 6. Lab Assistant & Campus Life (product-tile-dark) */}
      <motion.section 
        id="lab" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="bg-[#272729] dark:bg-zinc-950 text-white py-24 px-6 md:px-12"
      >
        <div className="max-w-6xl mx-auto space-y-12 text-center lg:text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Written specs & Life details */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-zinc-855 text-sky-400 font-mono tracking-wider border border-zinc-700">
                CAMPUS RESPONSIBILITY
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-white font-display">
                Life at the Lab
              </h2>
              <p className="text-xl text-zinc-300 font-light font-sans">
                Laboratory Assistant &amp; Technical Tutor at LePKom Universitas Gunadarma, Jakarta.
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Guiding heavy practical laboratory tracks in assembly compilers, data systems, and algorithmic analysis. Leading peer programming marathons, verifying homework scripts, and managing lab server arrays natively.
              </p>

              <div className="rounded-xl bg-zinc-900 p-4 border border-zinc-850 text-left space-y-3">
                <p className="text-xs font-mono text-[#0066cc] dark:text-sky-400 uppercase tracking-widest font-semibold">
                  📌 INSTRUCTOR HIGHLIGHTS
                </p>
                <ul className="text-xs text-zinc-300 space-y-2 list-disc pl-4 font-light">
                  <li>Guiding live practical labs since August 2024 (over three separate terms).</li>
                  <li>Drafted responsive evaluation codes for automatic grading scripts.</li>
                  <li>Mentored competitor groups in external Java hackathons.</li>
                </ul>
              </div>
            </div>

            {/* Visual: Landscape image with circular overlay carousel indicators */}
            <div className="lg:col-span-7">
              <div 
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") handlePrevLabImage();
                  if (e.key === "ArrowRight") handleNextLabImage();
                }}
                tabIndex={0}
                className="rounded-2xl overflow-hidden border border-zinc-800 bg-[#1d1d1f] p-2 aspect-[16/10] relative group focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all cursor-grab active:cursor-grabbing"
                aria-label="Campus Lab Life Interactive Slideshow. Use arrow keys or swipe gestures to navigate."
              >
                
                {/* Image render */}
                <img 
                  src={labCarouselImages[activeLabImage].src} 
                  alt="Michael lecturing students at Universitas Gunadarma" 
                  className="w-full h-full object-cover rounded-xl transition-all duration-300 group-hover:scale-[1.01]"
                  referrerPolicy="no-referrer"
                  draggable={false}
                />

                {/* Left floating translucent circular button */}
                <button 
                  onClick={handlePrevLabImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-black/60 hover:bg-[#0066cc] text-white border border-zinc-700/80 hover:border-transparent cursor-pointer transition-all active:scale-90 shadow-md backdrop-blur-sm z-20"
                  aria-label="Previous Lab Image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Right floating translucent circular button */}
                <button 
                  onClick={handleNextLabImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-black/60 hover:bg-[#0066cc] text-white border border-zinc-700/80 hover:border-transparent cursor-pointer transition-all active:scale-90 shadow-md backdrop-blur-sm z-20"
                  aria-label="Next Lab Image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Floating indicator helper badge */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-zinc-800 text-[9px] font-mono text-zinc-400 select-none pointer-events-none flex items-center gap-1.5 transition-opacity duration-300 group-hover:opacity-100 opacity-60 z-20">
                  <span>Swipe ⇄ or Keyboard Arrows</span>
                </div>

                {/* Translucent overlay caption bar */}
                <div className="absolute bottom-4 left-4 right-4 bg-zinc-900/90 text-zinc-250 backdrop-blur-md px-4 py-2.5 rounded-xl border border-zinc-800 text-xs text-left max-w-sm truncate whitespace-normal leading-relaxed shadow-sm block z-20">
                  {labCarouselImages[activeLabImage].caption}
                </div>

              </div>
              <div className="flex justify-center items-center gap-1.5 mt-4">
                {labCarouselImages.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveLabImage(i)}
                    className={`h-2 rounded-full transition-all duration-150 ${activeLabImage === i ? "w-6 bg-[#0066cc]" : "w-2 bg-zinc-700 hover:bg-zinc-500"}`}
                  />
                ))}
              </div>
            </div>

          </div>

          <div className="pt-12 border-t border-zinc-800/80">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block text-center mb-1">
              📷 COGNITIVE DRAGGABLE BOARD
            </span>
            <InteractiveBentoGallery 
              mediaItems={
                dbLabGalleryItems.length > 0
                  ? dbLabGalleryItems.map((item, index) => ({
                      id: index + 1,
                      type: item.type,
                      title: item.title,
                      desc: item.description,
                      url: item.url,
                      span: item.span,
                    } as MediaItemType))
                  : LAB_MEDIA_ITEMS
              }
              title="Draggable Lab Gallery"
              description="Explore live visual slices from classroom study, computing research, and server hardware calibrations. Drag and rearrange items."
            />
          </div>

        </div>
      </motion.section>

      <SectionDivider />

      {/* 7. Contact & Resume (footer / CTA overlay) */}
      <section id="contact" className="bg-[#f5f5f7] dark:bg-zinc-900 text-[#1d1d1f] dark:text-zinc-100 py-24 px-6 text-center transition-colors">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <span className="text-xs font-mono text-[#0066cc] dark:text-sky-400 font-semibold uppercase tracking-widest block">
            LET'S CONVERT CODE INTO VALUABLE INVENTIONS
          </span>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white leading-tight font-display max-w-2xl mx-auto">
            Let's build something great together.
          </h2>

          <p className="text-[#1d1d1f]/70 dark:text-zinc-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Whether for technical intern roles in machine learning models, production APIs, or high-performance desktop dashboards. Contact Michael for credentials inquiries.
          </p>

          {/* Large Action Blue CTA button */}
          <div className="pt-4 flex flex-col items-center justify-center gap-3">
            <button 
              onClick={triggerDownload}
              className="px-8 py-4 rounded-[9999px] text-base font-medium text-white bg-[#0066cc] hover:bg-[#0071e3] transition-all duration-150 active:scale-95 shadow-md hover:shadow-lg hover:shadow-[#0066cc]/10 cursor-pointer flex items-center gap-3"
            >
              <Download className="w-5 h-5" />
              Download Latest Resume
            </button>
            <p className="text-[10px] font-mono text-gray-400">PDF Document • 480 KB • English Transcript Included</p>
          </div>

          {/* Core metadata details list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto pt-12 border-t border-gray-200 dark:border-zinc-800">
            <div className="text-center p-4 bg-white dark:bg-zinc-950 rounded-xl border border-gray-150/10 dark:border-zinc-850 shadow-sm">
              <Mail className="w-5 h-5 text-[#0066cc] dark:text-sky-400 mx-auto mb-2" />
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1">Email Michael</p>
              <a href="mailto:michael.aristyo@gmail.com" className="text-xs hover:underline text-[#0066cc] dark:text-sky-400 truncate block">
                michael.aristyo@gmail.com
              </a>
            </div>

            <div className="text-center p-4 bg-white dark:bg-zinc-950 rounded-xl border border-gray-150/10 dark:border-zinc-850 shadow-sm">
              <Linkedin className="w-5 h-5 text-[#0066cc] dark:text-sky-400 mx-auto mb-2" />
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1">LinkedIn Profile</p>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-xs hover:underline text-gray-750 dark:text-zinc-300 block">
                linkedin.com/in/aristyo
              </a>
            </div>

            <div className="text-center p-4 bg-white dark:bg-zinc-950 rounded-xl border border-gray-150/10 dark:border-zinc-850 shadow-sm">
              <Github className="w-5 h-5 text-[#0066cc] dark:text-sky-400 mx-auto mb-2" />
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#1d1d1f]/50 dark:text-zinc-450 mb-1">GitHub Space</p>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-xs hover:underline text-gray-750 dark:text-zinc-300 block">
                github.com/aristyorahadiyan
              </a>
            </div>
          </div>

        </div>
      </section>

      <SectionDivider className="opacity-80" />

      {/* Unified footer from instructions */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioContent />
    </ThemeProvider>
  );
}
