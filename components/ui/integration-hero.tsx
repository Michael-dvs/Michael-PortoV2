"use client";

import { Button } from "@/components/ui/button";
import React from "react";

const ICONS_ROW1 = [
  "https://cdn-icons-png.flaticon.com/512/5968/5968854.png", // Python
  "https://cdn-icons-png.flaticon.com/512/5968/5968869.png", // Go-lang/Golang
  "https://cdn-icons-png.flaticon.com/512/732/732221.png",   // JS/HTML
  "https://cdn-icons-png.flaticon.com/512/733/733609.png",   // GitHub
  "https://cdn-icons-png.flaticon.com/512/732/732084.png",   // C#
  "https://cdn-icons-png.flaticon.com/512/226/226773.png",   // Java
  "https://cdn-icons-png.flaticon.com/512/5968/5968313.png", // PostgreSQL/SQL
];

const ICONS_ROW2 = [
  "https://cdn-icons-png.flaticon.com/512/888/888879.png",   // Docker
  "https://cdn-icons-png.flaticon.com/512/919/919853.png",   // Docker/Servers
  "https://cdn-icons-png.flaticon.com/512/733/733585.png",   // TypeScript/React
  "https://cdn-icons-png.flaticon.com/512/906/906361.png",   // Linux/SwiftUI
  "https://cdn-icons-png.flaticon.com/512/5968/5968267.png", // CSS3
  "https://cloud.nextcloud.com/core/img/favicon.ico",        // Nextcloud favicon fallback or similar
  "https://cdn-icons-png.flaticon.com/512/2103/2103632.png", // AI/Ollama / DeepsSeek equivalent
];

// Utility to repeat icons enough times
const repeatedIcons = (icons: string[], repeat = 4) => Array.from({ length: repeat }).flatMap(() => icons);

export default function IntegrationHero() {
  return (
    <section className="relative py-24 overflow-hidden bg-white dark:bg-zinc-950">
      {/* Light grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <span className="inline-block px-3 py-1 mb-4 text-xs rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white font-medium">
          Integrations & Core Tools
        </span>
        <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
          A Robust System of Tech Stack & Concepts
        </h2>
        <p className="mt-4 text-base text-gray-500 dark:text-zinc-400 max-w-xl mx-auto">
          Powering scalable software engineering and intelligent data pipelines with Michael's core tools.
        </p>

        {/* Carousel */}
        <div className="mt-12 overflow-hidden relative pb-4">
          {/* Row 1 */}
          <div className="flex gap-10 whitespace-nowrap animate-scroll-left">
            {repeatedIcons(ICONS_ROW1, 4).map((src, i) => (
              <div key={i} className="h-16 w-16 flex-shrink-0 rounded-2xl bg-[#f5f5f7] dark:bg-zinc-850 shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center justify-center hover:scale-105 transition-transform duration-150">
                <img src={src} alt="icon" className="h-9 w-9 object-contain" onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/5968/5968854.png"
                }} loading="lazy" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex gap-10 whitespace-nowrap mt-6 animate-scroll-right">
            {repeatedIcons(ICONS_ROW2, 4).map((src, i) => (
              <div key={i} className="h-16 w-16 flex-shrink-0 rounded-2xl bg-[#f5f5f7] dark:bg-zinc-850 shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center justify-center hover:scale-105 transition-transform duration-150">
                <img src={src} alt="icon" className="h-9 w-9 object-contain" onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/888/888879.png"
                }} loading="lazy" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>

          {/* Fade overlays */}
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent pointer-events-none" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 35s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 35s linear infinite;
        }
        .animate-scroll-left:hover, .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
}
