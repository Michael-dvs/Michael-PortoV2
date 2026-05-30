import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    let variantStyles = "bg-[#0066cc] text-white hover:bg-[#0071e3] focus:ring-[#0066cc]";
    if (variant === "outline") {
      variantStyles = "border border-[#0066cc] text-[#0066cc] bg-transparent hover:bg-[#0066cc]/10 focus:ring-[#0066cc]";
    } else if (variant === "secondary") {
      variantStyles = "bg-[#f5f5f7] text-[#1d1d1f] border border-gray-200 hover:bg-gray-200 focus:ring-gray-400";
    } else if (variant === "ghost") {
      variantStyles = "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-[#1d1d1f] focus:ring-gray-300";
    } else if (variant === "destructive") {
      variantStyles = "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
    } else if (variant === "link") {
      variantStyles = "text-[#0066cc] bg-transparent hover:underline hover:opacity-90";
    }

    let sizeStyles = "h-11 px-6 rounded-[9999px] text-sm font-medium";
    if (size === "sm") {
      sizeStyles = "h-8 rounded-full px-3 text-xs";
    } else if (size === "lg") {
      sizeStyles = "h-14 rounded-full px-8 text-base font-light";
    } else if (size === "icon") {
      sizeStyles = "h-10 w-10 rounded-full flex items-center justify-center p-0";
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer shadow-sm",
          variantStyles,
          sizeStyles,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
