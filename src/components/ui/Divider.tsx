import { cn } from "@/lib/utils";

interface DividerProps {
  align?: "left" | "center" | "right";
  className?: string;
}

/**
 * Section divider: two hairlines drawn outward from a small gold diamond —
 * the flourish the design brief reserves for editorial breaks.
 */
export function Divider({ align = "center", className }: DividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex w-full items-center gap-4", className)}
    >
      {align !== "left" && (
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-line" />
      )}
      <span className="size-[5px] shrink-0 rotate-45 border border-secondary/60 bg-secondary/15" />
      {align !== "right" && (
        <span className="h-px flex-1 bg-gradient-to-r from-line to-transparent" />
      )}
    </div>
  );
}
