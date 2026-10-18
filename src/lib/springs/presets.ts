/**
 * House motion presets.
 *
 * `SPRING` holds the physics configs; the reveal presets are the shared
 * `from`/`to` vocabulary every section uses for entrances, so the site reads
 * as one authored system instead of one-offs. Keep totals capped: a list
 * staggers at most `max`.
 */

import type { SpringConfig } from "@react-spring/web";
import type { SpringStyle } from "@/types/springs";

/** Linear easing for scroll-linked scrubs (react-spring config easing). */
const linear = (t: number) => t;

export const SPRING = {
  /** Arrivals — reveals, section entrances. */
  entrance: { tension: 170, friction: 26 } satisfies SpringConfig,
  /** Fast feedback — hover lifts, control states. */
  snappy: { tension: 320, friction: 30 } satisfies SpringConfig,
  /** Large, calm surfaces — drawers, panels, overlays. */
  gentle: { tension: 120, friction: 26 } satisfies SpringConfig,
  /** Scroll-linked scrub values — re-targeted every frame. */
  scrub: { duration: 1, easing: linear } satisfies SpringConfig,
  /** Content swap inside a fixed frame (hero panels). */
  crossfade: { tension: 150, friction: 24, clamp: true } satisfies SpringConfig,
} as const;

/** Standard scroll reveal: content settles up into place. */
export const revealUp: { from: SpringStyle; to: SpringStyle } = {
  from: { opacity: 0, y: 34 },
  to: { opacity: 1, y: 0 },
};

/** Short reveal for dense grids and list rows. */
export const revealSoft: { from: SpringStyle; to: SpringStyle } = {
  from: { opacity: 0, y: 18 },
  to: { opacity: 1, y: 0 },
};

/** Editorial reveal: clip-path wipe from the bottom edge, no vertical drift. */
export const revealWipe: { from: SpringStyle; to: SpringStyle } = {
  from: { opacity: 0, clipPath: "inset(12% 0% 0% 0%)" },
  to: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
};

/** Hairline rule that draws itself in. */
export const ruleDraw: { from: SpringStyle; to: SpringStyle } = {
  from: { scaleX: 0, opacity: 0 },
  to: { scaleX: 1, opacity: 1 },
};

/** Image stage settle: slight scale-down as it fades in (photography calm). */
export const imageSettle: { from: SpringStyle; to: SpringStyle } = {
  from: { opacity: 0, scale: 1.06 },
  to: { opacity: 1, scale: 1 },
};

/** Sibling stagger step (ms). Keep total delay capped. */
export const STAGGER_STEP = 70;

/** Capped stagger delay for index `i` in a list. */
export const staggerDelay = (i: number, step = STAGGER_STEP, max = 420) =>
  Math.min(i * step, max);
