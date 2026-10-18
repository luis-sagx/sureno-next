import { Inview } from "@/components/animation/springs";
import { revealUp, SPRING } from "@/lib/springs/presets";
import type { ReactNode } from "react";

interface LegalSectionProps {
  /** 1-based section number, rendered as an editorial numeral. */
  index: number;
  title: string;
  children: ReactNode;
}

/**
 * One numbered clause of a legal document: numeral and serif heading over a
 * hairline, body under the heading column. No boxes.
 */
export function LegalSection({ index, title, children }: LegalSectionProps) {
  return (
    <Inview
      from={revealUp.from}
      to={revealUp.to}
      mode="once"
      config={SPRING.entrance}
    >
      <section className="grid gap-x-6 gap-y-4 border-t border-line pt-10 md:grid-cols-[3rem_minmax(0,1fr)]">
        <span className="index-numeral text-base text-secondary md:pt-1">
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="font-headline text-2xl leading-snug text-on-surface md:col-start-2">
          {title}
        </h2>
        <div className="flex flex-col gap-4 text-base leading-relaxed text-on-surface-variant md:col-start-2">
          {children}
        </div>
      </section>
    </Inview>
  );
}
