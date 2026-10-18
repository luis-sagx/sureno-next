import { cn } from "@/lib/utils";

interface ProductSpecsProps {
  origin?: string | null;
  volumeMl?: number | null;
  abv?: number | null;
  category?: string | null;
  className?: string;
}

/**
 * Spec sheet as a hairline definition grid: caps label over a serif value.
 * Unknown values stay honest with a dash instead of disappearing.
 */
export function ProductSpecs({
  origin,
  volumeMl,
  abv,
  category,
  className,
}: ProductSpecsProps) {
  const specs = [
    { label: "Volumen", value: volumeMl ? `${volumeMl} ml` : "—" },
    { label: "Graduación", value: abv ? `Alc. ${abv}%` : "—" },
    { label: "Categoría", value: category || "—" },
    ...(origin ? [{ label: "Origen", value: origin }] : []),
  ];

  return (
    <dl
      className={cn(
        "grid grid-cols-2 border-t border-line md:grid-cols-4",
        className
      )}
    >
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="flex flex-col gap-2 border-b border-line py-4 pr-6"
        >
          <dt className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
            {spec.label}
          </dt>
          <dd className="font-headline text-lg leading-none text-on-surface tnum">
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
