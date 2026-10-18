import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Button styling lives outside the client boundary: server components need to
 * dress `next/link` CTAs with the exact same classes the Button renders.
 */

const baseStyles =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-label font-semibold uppercase tracking-[0.18em] transition-[color,background-color,border-color,box-shadow,filter] duration-[var(--theme-duration-fast)] ease-entrance disabled:pointer-events-none disabled:opacity-45";

const variantStyles: Record<ButtonVariant, string> = {
  /* Gold plate — the commerce action. A whisper of inner light along the top
     edge keeps it reading as metal, not a flat rectangle. */
  primary:
    "bg-secondary text-on-secondary shadow-[inset_0_1px_0_var(--theme-inner-light)] hover:brightness-[1.06] active:brightness-[0.95]",
  /* Neutral hairline — the quiet companion action. */
  secondary:
    "border border-line-strong bg-transparent text-on-surface hover:border-secondary hover:text-secondary",
  /* Gold hairline — tertiary emphasis without filling the surface. */
  outline:
    "border border-secondary/60 bg-transparent text-secondary hover:border-secondary hover:bg-secondary/10",
  /* Text-only — navigation-weight actions. */
  ghost:
    "bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-secondary",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.6875rem]",
  md: "h-11 px-6 text-xs",
  lg: "h-[3.4rem] px-8 text-[0.8125rem]",
};

/** Shared classes so `next/link` CTAs match real buttons exactly. */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(baseStyles, variantStyles[variant], sizeStyles[size], className);
}
