"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { 
  Sun, Moon, ArrowUp, Mail, Instagram, Eye, Heart, 
  Linkedin, Github, Youtube, HelpCircle, Code
} from "lucide-react";
import { cn } from "@/lib/utils";

// Robust Theme Context specifically for React + Vite Single Page Application setup
type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
      // Detect system preference if no user preference is stored
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sync theme changes across browser tabs/instances and listen to system preference changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme" && (e.newValue === "light" || e.newValue === "dark")) {
        setThemeState(e.newValue as Theme);
      }
    };

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only change if user has not explicitly set their preference override in localStorage
      const hasUserOverride = localStorage.getItem("theme") !== null;
      if (!hasUserOverride) {
        setThemeState(e.matches ? "dark" : "light");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Elegant fallback if ThemeProvider is not mounted
    return {
      theme: "light" as Theme,
      setTheme: (t: string) => {
        const root = window.document.documentElement;
        if (t === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
        localStorage.setItem("theme", t);
      }
    };
  }
  return context;
}

// Fallback safety icons proxy for DIcons in case of environment loading differences
const DIconsSafe = {
  Sun: ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => <Sun className={className} strokeWidth={strokeWidth} />,
  Moon: ({ className, strokeWidth }: { className?: string, strokeWidth?: number }) => <Moon className={className} strokeWidth={strokeWidth} />,
  ArrowUp: ({ className }: { className?: string }) => <ArrowUp className={className} />,
  Designali: ({ className }: { className?: string }) => (
    <span className="flex items-center gap-1 font-semibold tracking-tight text-lg text-primary">
      <Code className="w-5 h-5" />
      <span>Michael-dvs</span>
    </span>
  ),
  Mail: ({ className }: { className?: string }) => <Mail className={className} />,
  X: ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Instagram: ({ className }: { className?: string }) => <Instagram className={className} />,
  Threads: ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.846 11.972c-.443.415-.992.62-1.644.62-.65 0-1.202-.205-1.65-.62-.448-.415-.672-.942-.672-1.583v-1.17c0-.64.224-1.168.672-1.583.448-.414 1-.62 1.65-.62.652 0 1.201.206 1.644.62.443.415.666.943.666 1.583v1.17c0 .64-.223 1.168-.666 1.583z" />
    </svg>
  ),
  WhatsApp: ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.454L0 24zm6.59-4.846c1.62.962 3.21 1.761 5.362 1.762 5.564 0 10.093-4.524 10.096-10.086.002-2.696-1.044-5.231-2.946-7.133C17.397 3.795 14.887 2.75 12.008 2.75c-5.57 0-10.101 4.526-10.104 10.089-.001 2.057.535 4.062 1.551 5.84l-.994 3.633 3.722-.976q.429.231.864.448z" />
    </svg>
  ),
  Behance: ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 10.5h-5v1h5v-1zm-10.45 2.1c0-.75-.15-1.35-.45-1.8-.3-.45-.75-.75-1.35-.9-.45-.15-1.05-.15-1.8-.15H5v7.2h3.3c1.05 0 1.8-.15 2.25-.45.45-.3.75-.75.9-1.35.15-.5.15-1.05.15-1.55zm-1.8-6.1c0-.6-.15-1.05-.45-1.35s-.75-.45-1.35-.45H5v4.2H8.1c.6 0 1.05-.15 1.35-.45.3-.25.45-.7.45-1.15zM22 13c0-.9-.3-1.65-.9-2.25s-1.35-.9-2.25-.9c-.9 0-1.65.3-2.25.9S15.7 12.1 15.7 13c0 .9.3 1.65.9 2.25s1.35.9 2.25.9c.9 0 1.65-.3 2.25-.9s.9-1.35.9-2.25zm-2.15 0c0 .45-.15.75-.45.9-.3.15-.6.15-.9.15s-.6 0-.9-.15c-.3-.15-.45-.45-.45-.9 0-.45.15-.75.45-.9.3-.15.6-.15.9-.15s.6 0 .9.15c.3.15.45.45.45.9z" />
    </svg>
  ),
  Facebook: ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  ),
  LinkedIn: ({ className }: { className?: string }) => <Linkedin className={className} />,
  YouTube: ({ className }: { className?: string }) => <Youtube className={className} />,
  Heart: ({ className }: { className?: string }) => <Heart className={className} />
};

function handleScrollTop() {
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
}

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex items-center rounded-full border border-dotted border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-1 shadow-sm">
        <button
          onClick={() => setTheme("light")}
          className={cn(
            "rounded-full p-2.5 cursor-pointer active:scale-90 transition-all duration-200",
            theme === "light"
              ? "bg-black text-white dark:bg-zinc-800 shadow-sm"
              : "text-gray-400 hover:text-black dark:text-zinc-500 dark:hover:text-white"
          )}
          aria-label="Set Light Mode"
        >
          <DIconsSafe.Sun className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <button 
          type="button" 
          onClick={handleScrollTop}
          className="mx-3 text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white cursor-pointer active:scale-90 transition-transform p-1.5"
          aria-label="Scroll to Top"
        >
          <DIconsSafe.ArrowUp className="h-4.5 w-4.5" />
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={cn(
            "rounded-full p-2.5 cursor-pointer active:scale-90 transition-all duration-200",
            theme === "dark"
              ? "bg-black text-white dark:bg-zinc-800 shadow-sm"
              : "text-gray-400 hover:text-black dark:text-zinc-500 dark:hover:text-white"
          )}
          aria-label="Set Dark Mode"
        >
          <DIconsSafe.Moon className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

// Also exported default for the theme toggle, according to import requirements mapping
export default ThemeToggle;

const navigation = {
  categories: [
    {
      id: "women",
      name: "Women",
      sections: [
        {
          id: "about",
          name: "About",
          items: [
            { name: "Back to Home", href: "#" },
            { name: "Featured Works", href: "#projects" },
            { name: "Academic Journey", href: "#experience" },
          ],
        },
        {
          id: "features",
          name: "Features",
          items: [
            { name: "Music-Wails", href: "/projects/music-wails" },
            { name: "FinExtract", href: "projects/finextract" },          ],
        },
        {
          id: "products",
          name: "Technical Stack",
          items: [
            { name: "Python / Data Science", href: "#skills" },
            { name: "Go / Cloud Infra", href: "#skills" },
            { name: "LLM Orchestration", href: "#skills" },
          ],
        },
        {
          id: "designs",
          name: "Academic Achievements",
          items: [
            { name: "Universitas Gunadarma", href: "#" },
            { name: "Laboratory Tutor", href: "#lab" },
          ],
        },
        {
          id: "other",
          name: "Explore Labs",
          items: [
            { name: "LePKom Gunadarma", href: "https://lepkom.gunadarma.ac.id" }
          ],
        },
        {
          id: "company",
          name: "Inquiries",
          items: [
            { name: "Email Michael", href: "mailto:23.michaelaristio@gmail.com" },
            { name: "Personal GitHub", href: "https://github.com/michael-dvs" },
            { name: "Informatics Portals", href: "michaelarhdyn.my.id" },
          ],
        },
      ],
    },
  ],
};

const Underline = `hover:-translate-y-1 hover:border-solid border border-dotted border-gray-300 dark:border-zinc-700 rounded-xl p-2.5 transition-transform cursor-pointer text-gray-600 hover:text-[#0066cc] dark:text-zinc-400 dark:hover:text-sky-400 bg-white dark:bg-zinc-900 shadow-sm`;

export function Footer() {
  return (
    <footer className="mx-auto w-full border-t border-gray-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 px-4 md:px-8 py-12 transition-colors">
      <div className="relative mx-auto grid max-w-7xl items-start justify-center gap-6 p-6 pb-0 md:flex">
        <div className="flex items-center justify-center rounded-full p-2">
          <DIconsSafe.Designali className="w-12 text-[#0066cc]" />
        </div>
        <p className="bg-transparent text-center text-xs leading-5 text-gray-500 dark:text-zinc-400 max-w-3xl md:text-left font-light">
          Welcome to Michael Aristyo Rahadiyan's digital showcase, where meticulous engineering meets
          computational research to bring complex systems to life. Assisting lecturers, tutoring juniors, and
          building production-ready software as an Informatics Engineering student at Universitas Gunadarma, Jakarta. 
          Focusing on highly modular full-stack code, machine learning integrations, and crisp user interfaces. 
          Believing firmly in quality over quantity, and minimalist, high-impact craftsmanship.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="border-b border-dotted border-gray-200 dark:border-zinc-800"> </div>
        <div className="py-10">
          {navigation.categories.map((category) => (
            <div
              key={category.name}
              className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row justify-between gap-6 leading-6"
            >
              {category.sections.map((section) => (
                <div key={section.id} className="min-w-[120px]">
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-zinc-350 tracking-wider uppercase mb-3">
                    {section.name}
                  </h4>
                  <ul className="flex flex-col space-y-2">
                    {section.items.map((item) => (
                      <li key={item.name} className="flow-root">
                        <a
                          href={item.href}
                          className="text-xs text-gray-500 hover:text-[#0066cc] dark:text-zinc-400 dark:hover:text-sky-400 font-light"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="border-b border-dotted border-gray-200 dark:border-zinc-800"> </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 pb-4">
        <div className="flex flex-wrap items-center justify-center gap-6 gap-y-4 px-6">
          <a
            aria-label="Email Address"
            href="mailto:23.michaelaristio@gmail.com"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIconsSafe.Mail className="h-5 w-5" />
          </a>
          <a
            aria-label="GitHub Account"
            href="https://github.com/michael-dvs"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
          </a>
          <a
            aria-label="Instagram Profile"
            href="https://instagram.com/michaelarhdyn"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIconsSafe.Instagram className="h-5 w-5" />
          </a>
          <a
            aria-label="LinkedIn Profile"
            href="https://www.linkedin.com/in/michaelarhdyn"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIconsSafe.LinkedIn className="h-5 w-5" />
          </a>
        </div>
        <ThemeToggle />
      </div>

      <div className="mx-auto mb-6 mt-6 flex flex-col justify-between text-center text-[11px] md:max-w-7xl">
        <div className="flex flex-row items-center justify-center gap-1 text-gray-400 dark:text-zinc-500 font-light">
          <span> © </span>
          <span>{new Date().getFullYear()}</span>
          <span>Michael Aristyo Rahadiyan
          </span>
        </div>
      </div>
    </footer>
  );
}
