import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
  className?: string;
  children?: React.ReactNode;
  key?: React.Key;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  let badgeStyles = "border-transparent bg-[#0066cc] text-white";
  if (variant === "secondary") {
    badgeStyles = "border-transparent bg-[#f5f5f7] text-[#1d1d1f] dark:bg-zinc-800 dark:text-zinc-200";
  } else if (variant === "outline") {
    badgeStyles = "border-gray-200 bg-transparent text-gray-700 dark:border-zinc-800 dark:text-zinc-300";
  } else if (variant === "destructive") {
    badgeStyles = "border-transparent bg-red-600 text-white";
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2",
        badgeStyles,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
