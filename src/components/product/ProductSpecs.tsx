import { cn } from "@/lib/utils";
import { MapPin, Beaker, Gauge, Tag } from "lucide-react";

interface ProductSpecsProps {
  origin?: string | null;
  volumeMl?: number | null;
  abv?: number | null;
  category?: string | null;
  className?: string;
}

const specItems = [
  { key: "origin", icon: MapPin, label: "Origen" },
  { key: "volume", icon: Beaker, label: "Volumen" },
  { key: "abv", icon: Gauge, label: "ABV" },
  { key: "category", icon: Tag, label: "Categoría" },
] as const;

export function ProductSpecs({
  origin,
  volumeMl,
  abv,
  category,
  className,
}: ProductSpecsProps) {
  const values: Record<string, string> = {
    origin: origin || "—",
    volume: volumeMl ? `${volumeMl}ml` : "—",
    abv: abv ? `${abv}%` : "—",
    category: category || "—",
  };

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4",
        className
      )}
    >
      {specItems.map(({ key, icon: Icon, label }) => (
        <div
          key={key}
          className="flex flex-col items-center text-center p-4 rounded-lg bg-surface-container"
        >
          <Icon className="w-5 h-5 text-secondary mb-2" />
          <span className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">
            {label}
          </span>
          <span className="font-headline text-sm text-on-surface">
            {values[key]}
          </span>
        </div>
      ))}
    </div>
  );
}
