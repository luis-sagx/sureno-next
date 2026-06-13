'use client';

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-label font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-secondary text-on-secondary hover:bg-secondary/90 shadow-sm hover:shadow-md",
      secondary:
        "bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest",
      outline:
        "border-2 border-secondary text-secondary bg-transparent hover:bg-secondary/10",
      ghost:
        "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-sm",
      lg: "h-13 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, type ButtonProps };
