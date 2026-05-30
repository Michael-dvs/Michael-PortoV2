import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionDividerProps {
  className?: string;
  animate?: boolean;
}

export function SectionDivider({ className, animate = true }: SectionDividerProps) {
  const divider = (
    <div
      className={cn(
        "w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-zinc-800/80 md:via-gray-250/70 md:dark:via-zinc-800/60",
        className
      )}
      style={{
        backgroundImage: "linear-gradient(90deg, transparent, var(--divider-color, rgba(0, 0, 0, 0.08)) 12%, var(--divider-color, rgba(0, 0, 0, 0.08)) 88%, transparent)",
      }}
    />
  );

  if (!animate) {
    return (
      <div 
        className="w-full overflow-hidden select-none"
        style={{
          "--divider-color": "rgba(120, 120, 128, 0.16)",
        } as React.CSSProperties}
      >
        <div className={cn("w-full h-[1px] bg-gray-200/40 dark:bg-zinc-800/50", className)} />
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden select-none">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        className={cn(
          "w-full h-[1px] origin-center bg-gray-200/50 dark:bg-zinc-800/60",
          className
        )}
      />
    </div>
  );
}
