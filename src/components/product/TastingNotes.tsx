import { cn } from "@/lib/utils";

interface TastingNotesProps {
  aroma?: string | null;
  palate?: string | null;
  finish?: string | null;
  className?: string;
}

const noteItems = [
  { key: "aroma", label: "Aroma", index: "01" },
  { key: "palate", label: "En boca", index: "02" },
  { key: "finish", label: "Final", index: "03" },
] as const;

/**
 * Tasting notes as three editorial columns — numeral, label and the note —
 * divided by hairlines rather than wrapped in cards. Renders nothing until
 * the house actually has notes to show.
 */
export function TastingNotes({
  aroma,
  palate,
  finish,
  className,
}: TastingNotesProps) {
  const notes: Record<string, string | null | undefined> = {
    aroma,
    palate,
    finish,
  };

  const available = noteItems.filter((item) => Boolean(notes[item.key]));
  if (available.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-3", className)}>
      {available.map((item, index) => (
        <article
          key={item.key}
          className={cn(
            "flex flex-col gap-3 pt-5",
            "border-t border-line",
            index === 0 && "border-t-line-strong"
          )}
        >
          <span className="index-numeral text-sm text-secondary">
            {item.index}
          </span>
          <h3 className="font-label text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-on-surface">
            {item.label}
          </h3>
          <p className="text-base leading-relaxed text-on-surface-variant">
            {notes[item.key]}
          </p>
        </article>
      ))}
    </div>
  );
}
