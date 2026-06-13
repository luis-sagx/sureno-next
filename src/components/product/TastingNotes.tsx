import { cn } from "@/lib/utils";
import { Sparkles, Wine, Trophy } from "lucide-react";

interface TastingNotesProps {
  aroma?: string | null;
  palate?: string | null;
  finish?: string | null;
  className?: string;
}

const noteItems = [
  { key: "aroma", icon: Sparkles, label: "Aroma" },
  { key: "palate", icon: Wine, label: "En Boca" },
  { key: "finish", icon: Trophy, label: "Final" },
] as const;

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

  const hasAnyNote = Object.values(notes).some(Boolean);
  if (!hasAnyNote) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-headline text-lg text-on-surface mb-4">
        Notas de Cata
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {noteItems.map(({ key, icon: Icon, label }) => (
          <div
            key={key}
            className="p-5 rounded-lg bg-surface-container space-y-2"
          >
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-secondary" />
              <span className="font-headline text-sm text-on-surface uppercase tracking-wider">
                {label}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {notes[key] || "Información no disponible"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
