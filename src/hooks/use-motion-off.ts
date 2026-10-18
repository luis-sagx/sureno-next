"use client";

import { useState } from "react";
import { useReducedMotion } from "@react-spring/web";

const reducedAtStart = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * True when motion is off: the visitor prefers reduced motion.
 *
 * **Every looping spring must read it** — `loop: !motionOff` — because
 * react-spring's global `skipAnimation` (switched on by reduced motion) makes
 * a loop finish each lap in 0 ms and start the next in the same tick: the page
 * hangs. `while (alive) { await spring.start(…) }` loops must stop on it too.
 *
 * The media query is read on the **first** render: `useReducedMotion()` alone
 * reports `false` until its effect runs, by which time the loop has started.
 * The flag doesn't touch the DOM, so reading it during render can't mismatch.
 */
export const useMotionOff = (): boolean => {
  const [reducedFirst] = useState(reducedAtStart);
  const reduced = Boolean(useReducedMotion());
  return reducedFirst || reduced;
};
