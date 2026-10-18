"use client";

/**
 * Smooth enter/exit when its children swap.
 *
 * Caches the previous children, springs out to `from`, swaps, then springs in
 * to `to`. Use it for content that changes in place (hero panels, tab bodies,
 * cart lines that update in place).
 */

import { memo, useEffect, useRef, useState } from "react";
import { useSpring, config as _config, type SpringConfig } from "@react-spring/web";
import { AnimatedVarTextTag } from "./animated-var-text-tag";
import type { SpringStyle, Tags } from "@/types/springs";

interface HandleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  from?: SpringStyle;
  to?: SpringStyle;
  delayIn?: number;
  delayOut?: number;
  config?: SpringConfig;
  enabled?: boolean;
  tag?: Tags;
}

export const Handle = memo(
  ({
    children,
    from = { opacity: 0 },
    to = { opacity: 1 },
    delayIn = 0,
    delayOut = 0,
    config = _config.gentle,
    enabled = true,
    tag = "div",
    ...props
  }: HandleProps) => {
    const [cachedChildren, setCachedChildren] =
      useState<React.ReactNode>(children);
    const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );
    const [rerender, setRerender] = useState(0);
    const isHidden = useRef(false);
    const childrenRef = useRef<React.ReactNode>(children);
    useEffect(() => {
      childrenRef.current = children;
    }, [children]);

    const [springs, api] = useSpring(() => ({
      ...to,
      config,
    }));

    // Keep the latest animation inputs reachable from the effects below, so
    // their dependency arrays can stay narrow.
    const dataRef = useRef({ from, to, config, delayIn, delayOut });
    const cachedChildrenRef = useRef<React.ReactNode>(cachedChildren);
    useEffect(() => {
      dataRef.current = { from, to, config, delayIn, delayOut };
      cachedChildrenRef.current = cachedChildren;
    });

    useEffect(() => {
      if (!enabled) {
        api.start({
          ...dataRef.current.from,
          config: dataRef.current.config,
          onRest: () => {
            setCachedChildren(childrenRef.current);
            isHidden.current = true;
            setRerender((state) => state + 1);
          },
        });
      }
    }, [enabled, api]);

    useEffect(() => {
      if (!enabled) return;
      // Don't animate if children haven't changed
      if (children === cachedChildrenRef.current && !isHidden.current) return;

      // Clear any pending animations
      if (isHidden.current) {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
        animateIn();
        return;
      }

      // Start fade out animation
      isHidden.current = false;
      api.start({
        ...dataRef.current.from,
        delay: dataRef.current.delayOut,
        config: dataRef.current.config,
        onRest: () => animateIn(),
      });

      function animateIn() {
        setCachedChildren(childrenRef.current);
        isHidden.current = true;
        // Start fade in animation
        animationTimeoutRef.current = setTimeout(() => {
          isHidden.current = false;
          api.start({
            ...dataRef.current.to,
            config: dataRef.current.config,
            onRest: () => setRerender((state) => state + 1),
          });
        }, dataRef.current.delayIn);
      }
    }, [children, enabled, rerender, api]);

    // Cleanup timeouts
    useEffect(() => {
      return () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
      };
    }, []);

    return (
      <AnimatedVarTextTag tag={tag} style={{ ...springs }} {...props}>
        {cachedChildren}
      </AnimatedVarTextTag>
    );
  },
);

Handle.displayName = "Handle";
