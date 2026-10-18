"use client";

/**
 * Spring-based hover animation.
 *
 * Attaches to its own node, or to an external `trigger` element, and springs
 * between `from` and `to` while hovered. Disabled on touch/mobile by default
 * (there is no hover there).
 */

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSpring, type SpringConfig } from "@react-spring/web";
import type { SpringStyle, Tags, TriggerRef } from "@/types/springs";
import { isMobileDisabled, springsConfig } from "@/lib/springs/config";
import { useWindowWidth } from "@/hooks/use-window-size";
import { AnimatedVarTextTag } from "./animated-var-text-tag";

type HoverProps = {
  children?: React.ReactNode;
  enabled?: boolean;
  from?: SpringStyle;
  to?: SpringStyle;
  style?: React.CSSProperties;
  config?: SpringConfig;
  delayIn?: number;
  delayOut?: number;
  trigger?: TriggerRef;
  disableOnMobile?: boolean;
  immediateOut?: boolean;
} & React.HTMLAttributes<HTMLElement>;

export const Hover = forwardRef<HTMLElement, HoverProps & { tag?: Tags }>(
  (
    {
      tag: Tag = "div",
      children,
      from = {},
      to = {},
      style,
      config = {},
      delayIn = 0,
      delayOut = 0,
      enabled = true,
      trigger,
      disableOnMobile = true,
      immediateOut = false,
      ...props
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLElement>(null);
    const [hovered, setHovered] = useState(false);
    const width = useWindowWidth();

    useImperativeHandle(ref, () => innerRef.current as HTMLElement);

    useEffect(() => {
      if (
        isMobileDisabled(
          springsConfig.disableOnMobile.hover || disableOnMobile,
          width,
        )
      ) {
        return;
      }

      // Snapshot the node so the cleanup detaches from the same element the
      // effect attached to, even if `trigger.current` changes later.
      const node = trigger?.current;
      if (!node) {
        return;
      }
      const handleMouseEnter = () => {
        setHovered(true);
      };
      const handleMouseLeave = () => {
        setHovered(false);
      };
      node.addEventListener("mouseenter", handleMouseEnter);
      node.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        node.removeEventListener("mouseenter", handleMouseEnter);
        node.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, [trigger, disableOnMobile, width]);

    const handleMouseEnter = () => {
      if (
        isMobileDisabled(springsConfig.disableOnMobile.hover || disableOnMobile)
      ) {
        return;
      }
      if (trigger?.current) {
        return;
      }
      setHovered(true);
    };

    const handleMouseLeave = () => {
      if (
        isMobileDisabled(springsConfig.disableOnMobile.hover || disableOnMobile)
      ) {
        return;
      }
      if (trigger?.current) {
        return;
      }
      setHovered(false);
    };

    const active = useMemo(() => {
      if (
        isMobileDisabled(
          springsConfig.disableOnMobile.hover || disableOnMobile,
          width,
        )
      ) {
        return false;
      }
      if (!enabled) {
        return false;
      }

      return hovered;
    }, [enabled, hovered, disableOnMobile, width]);

    // Declarative spring — `useSpring` diffs values each render, so it
    // reliably animates to `to` while hovered and back to `from` otherwise.
    const springs = useSpring({
      from,
      to: active ? to : from,
      config,
      delay: active ? delayIn : delayOut,
      immediate: !active && immediateOut,
    });

    return (
      <AnimatedVarTextTag
        ref={innerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        tag={Tag}
        style={{ ...springs, ...style }}
        {...props}
      >
        {children}
      </AnimatedVarTextTag>
    );
  },
);

Hover.displayName = "Hover";
