"use client";

/**
 * Unconditional spring animation, driven by `enabled` / mount.
 *
 * Modes:
 * - "once":    plays once per mount, stays at `to`
 * - "always":  follows `enabled` back and forth
 * - "forward": plays once on downward scroll
 */

import { useSpring, type SpringConfig } from "@react-spring/web";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { isMobileDisabled, springsConfig } from "@/lib/springs/config";
import { useWindowWidth } from "@/hooks/use-window-size";
import type { SpringStyle, Tags } from "@/types/springs";
import { AnimatedVarTextTag } from "./animated-var-text-tag";

type SpringProps = {
  children?: React.ReactNode;
  enabled?: boolean;
  from?: SpringStyle;
  to?: SpringStyle;
  mode?: "always" | "once" | "forward";
  style?: React.CSSProperties;
  config?: SpringConfig;
  delayIn?: number;
  delayOut?: number;
  disableOnMobile?: boolean;
  immediateOut?: boolean;
} & React.HTMLAttributes<HTMLElement>;

export const Spring = forwardRef<HTMLElement, SpringProps & { tag?: Tags }>(
  (
    {
      tag: Tag = "div",
      children,
      from = {},
      to = {},
      mode = "always",
      style,
      config = {},
      delayIn = 0,
      delayOut = 0,
      enabled = true,
      disableOnMobile = false,
      immediateOut = false,
      ...props
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLElement>(null);
    const isAnimated = useRef(false);
    const scrolledDown = useRef(false);
    const width = useWindowWidth();

    useImperativeHandle(ref, () => innerRef.current as HTMLElement);

    useEffect(() => {
      if (
        isMobileDisabled(
          springsConfig.disableOnMobile.spring || disableOnMobile,
          width,
        )
      ) {
        return;
      }
      if (mode === "forward") {
        const handleScroll = () => {
          if (innerRef.current) {
            const rect = innerRef.current.getBoundingClientRect();
            if (rect.top > 0) {
              scrolledDown.current = false;
            } else {
              scrolledDown.current = true;
            }
          }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
      }
    }, [mode, disableOnMobile, width]);

    const active = useMemo(() => {
      if (
        isMobileDisabled(
          springsConfig.disableOnMobile.spring || disableOnMobile,
          width,
        )
      ) {
        return false;
      }

      if (!enabled) {
        return false;
      }

      if (mode === "once" && isAnimated.current) {
        return true;
      }

      if (mode === "forward" && scrolledDown.current) {
        return true;
      }

      isAnimated.current = true;
      return true;
    }, [mode, enabled, disableOnMobile, width]);

    // Declarative spring: `useSpring` diffs values each render, so animating to
    // `to` (when active) vs `from` happens automatically, and a parent
    // re-render with the same target is a no-op — no re-animation, no reset.
    const springs = useSpring({
      from,
      to: active ? to : from,
      config,
      delay: active ? delayIn : delayOut,
      immediate: !active && immediateOut,
    });

    return (
      <AnimatedVarTextTag
        tag={Tag}
        ref={innerRef}
        style={{ ...springs, ...style }}
        {...props}
      >
        {children}
      </AnimatedVarTextTag>
    );
  },
);

Spring.displayName = "Spring";
