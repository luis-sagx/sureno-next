import { cn } from "@/lib/utils";

interface BadgeProps {
  variant: "save" | "bestseller" | "limited" | "premium";
  discount?: string;
  className?: string;
}

const badgeConfig = {
  save: {
    label: (discount?: string) => `AHORRA ${discount ?? ""}`,
    className: "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300",
  },
  bestseller: {
    label: () => "MÁS VENDIDO",
    className: "bg-secondary/20 text-secondary",
  },
  limited: {
    label: () => "STOCK LIMITADO",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  premium: {
    label: () => "RESERVA PREMIUM",
    className: "bg-primary/15 text-primary",
  },
};

export function Badge({ variant, discount, className }: BadgeProps) {
  const config = badgeConfig[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide whitespace-nowrap",
        config.className,
        className
      )}
    >
      {config.label(discount)}
    </span>
  );
}
