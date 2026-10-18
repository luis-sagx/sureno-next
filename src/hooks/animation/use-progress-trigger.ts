"use client";

/**
 * Scroll-triggered progress tracking.
 *
 * Measures the target element against the viewport every frame (via the shared
 * ticker, only while in view) and reports a normalized 0–1 progress between
 * `start` and `end` trigger positions. Progress is also mirrored into a spring
 * value so consumers can drive spring-interpolated motion from it.
 *
 * @returns `.progress` — ref holding the raw 0–1 value (read `.current`);
 *          `.interpolatedProgress` — spring-animated 0–1 value.
 */

import { RefObject, useEffect, useMemo, useRef } from "react";
import { SpringConfig, useSpring } from "@react-spring/web";
import { useWindowWidth } from "@/hooks/use-window-size";
import { isMobileDisabled, springsConfig } from "@/lib/springs/config";
import { useLoopInView } from "./use-loop-in-view";
import type { TriggerPos } from "@/components/animation/springs/progress-trigger";

interface UseProgressTriggerProps {
  enabled?: boolean;
  trigger?: RefObject<HTMLElement> | undefined;
  start?: TriggerPos;
  end?: TriggerPos;
  onChange?: (state: {
    progress: number;
    interpolatedProgress: number;
  }) => void;
  disableOnMobile?: boolean;
  config?: SpringConfig;
  frameInterval?: number;
  elementRef: RefObject<HTMLElement | null>;
}

export function useProgressTrigger({
  start = "top bottom",
  end = "bottom top",
  trigger,
  onChange,
  enabled = true,
  disableOnMobile = false,
  frameInterval = 10,
  config: springConfig,
  elementRef,
}: UseProgressTriggerProps) {
  const width = useWindowWidth();
  const savedProgress = useRef(-1);
  const activeRef = useRef(false);

  const [{ interpolatedProgress }, springApi] = useSpring(() => ({
    interpolatedProgress: 0,
    config: springConfig,
  }));

  const active = useMemo(() => {
    if (
      isMobileDisabled(
        springsConfig.disableOnMobile.springtrigger || disableOnMobile,
        width,
      )
    ) {
      return false;
    }
    if (!enabled) {
      return false;
    }
    return true;
  }, [enabled, disableOnMobile, width]);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useLoopInView(
    trigger || elementRef,
    () => {
      if (typeof window === "undefined") return;
      const _ref = trigger || elementRef;
      if (!activeRef.current || !_ref.current) return;

      const bb = _ref.current.getBoundingClientRect();
      const clientHeight = window.innerHeight;

      const poses = {
        top_top: bb.top,
        center_top: bb.top + bb.height / 2,
        bottom_top: bb.bottom,
        top_bottom: bb.top - clientHeight,
        center_bottom: bb.top + bb.height / 2 - clientHeight,
        bottom_bottom: bb.bottom - clientHeight,
        top_center: bb.top - clientHeight / 2,
        center_center: bb.top + bb.height / 2 - clientHeight / 2,
        bottom_center: bb.bottom - clientHeight / 2,
      };

      const scrollStart =
        poses[start.split(" ").join("_") as keyof typeof poses];
      const scrollEnd = poses[end.split(" ").join("_") as keyof typeof poses];
      const length = Math.abs(scrollStart - scrollEnd);
      const progress = Math.min(
        Math.max(0, 1 - (scrollStart + length) / length),
        1,
      );

      if (progress !== savedProgress.current) {
        savedProgress.current = progress;
        springApi.start({ interpolatedProgress: progress });
        onChange?.({
          progress,
          interpolatedProgress: interpolatedProgress.get(),
        });
      }
    },
    { framerate: frameInterval },
  );

  return {
    interpolatedProgress,
    // The ref itself — not `.current` — so reading it isn't a render-time ref
    // access. Consumers read `progress.current` for the live 0-1 value.
    progress: savedProgress,
  };
}
