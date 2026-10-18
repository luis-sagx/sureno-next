"use client";

/**
 * Runs a callback on the shared animation ticker with a configurable framerate.
 *
 * Subscribes to `src/lib/animation/ticker.ts` — a single app-wide
 * `requestAnimationFrame` loop — instead of starting its own rAF.
 *
 * `onRender` and `framerate` are read live through refs, so prop changes take
 * effect without re-subscribing (and without the stale-closure bug a captured
 * callback would cause).
 *
 * @param onRender - Callback executed on each render frame
 * @param props - Optional configuration:
 *   - framerate: minimum time (ms) between renders (default: 100ms)
 *   - onMount / onUnMount: lifecycle handlers of the subscription
 */

import { useEffect, useRef } from "react";

import { subscribeToTicker } from "@/lib/animation/ticker";

export interface LoopProps {
  onMount?: () => void;
  onUnMount?: () => void;
  framerate?: number;
}

const DEFAULT_FRAMERATE = 100;

export const useLoop = (
  onRender: (time: number) => void,
  props: LoopProps = {},
) => {
  const onRenderRef = useRef(onRender);
  const propsRef = useRef(props);

  // Keep the live values reachable from the mount-only subscription below.
  useEffect(() => {
    onRenderRef.current = onRender;
    propsRef.current = props;
  });

  useEffect(() => {
    propsRef.current.onMount?.();

    const unsubscribe = subscribeToTicker(
      (time) => onRenderRef.current(time),
      () => propsRef.current.framerate ?? DEFAULT_FRAMERATE,
    );

    return () => {
      unsubscribe();
      propsRef.current.onUnMount?.();
    };
    // Mount-only: live values are read through refs above.
  }, []);
};
