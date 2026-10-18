import { cn } from "@/lib/utils";

interface BadgeProps {
  variant: "save" | "bestseller" | "limited" | "premium";
  discount?: string;
  className?: string;
}

/**
 * Status tag. The pill radius is reserved exclusively for these (per the
 * design brief) — functional surfaces never round this far.
 */
const badgeConfig = {
  save: {
    label: (discount?: string) => `AHORRA ${discount ?? ""}`,
    className: "border-secondary/50 bg-secondary/10 text-secondary",
  },
  bestseller: {
    label: () => "MÁS VENDIDO",
    className: "border-secondary/50 bg-secondary/10 text-secondary",
  },
  limited: {
    label: () => "STOCK LIMITADO",
    className: "border-error/40 bg-error/10 text-error",
  },
  premium: {
    label: () => "RESERVA PREMIUM",
    className: "border-tertiary/40 bg-tertiary/10 text-tertiary",
  },
};

export function Badge({ variant, discount, className }: BadgeProps) {
  const config = badgeConfig[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-label text-[0.625rem] font-semibold uppercase tracking-[0.14em] whitespace-nowrap",
        config.className,
        className
      )}
    >
      {config.label(discount)}
    </span>
  );
}
