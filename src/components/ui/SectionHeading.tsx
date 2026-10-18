import { Inview } from "@/components/animation/springs";
import { TextReveal } from "@/components/animation/text/TextReveal";
import { SPRING, revealUp } from "@/lib/springs/presets";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  /** Editorial index numeral, e.g. "01". */
  index?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * The shared section opener: eyebrow (or editorial numeral) over an animated
 * serif title, with an optional lede. Everything reveals on scroll once.
 */
export function SectionHeading({
  title,
  eyebrow,
  index,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        centered ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {(eyebrow || index) && (
        <Inview
          from={{ opacity: 0, y: 14 }}
          to={{ opacity: 1, y: 0 }}
          mode="once"
          config={SPRING.entrance}
          className="flex items-center gap-4"
        >
          {index && (
            <span className="index-numeral text-base text-secondary">
              {index}
            </span>
          )}
          {eyebrow && <Eyebrow rule={!index}>{eyebrow}</Eyebrow>}
        </Inview>
      )}

      <TextReveal tag="h2" align={align} className="type-title text-on-surface">
        {title}
      </TextReveal>

      {description && (
        <Inview
          from={revealUp.from}
          to={revealUp.to}
          mode="once"
          delayIn={140}
          config={SPRING.entrance}
        >
          <p className="max-w-prose text-base leading-relaxed text-on-surface-variant">
            {description}
          </p>
        </Inview>
      )}
    </div>
  );
}
