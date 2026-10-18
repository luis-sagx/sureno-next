"use client";

/**
 * Scroll-driven spring animation.
 *
 * Modes:
 * - "scrub":  the spring values interpolate continuously with scroll progress
 * - "toggle": the spring snaps between `from` and `to` at the trigger point
 */

import { animated, easings, type SpringConfig } from "@react-spring/web";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import type { Tags } from "@/types/springs";
import { useSpringTrigger } from "@/hooks/animation/use-spring-trigger";
import type { TriggerPos } from "./progress-trigger";
import { AnimatedVarTextTag } from "./animated-var-text-tag";

type SpringTriggerProps = {
  children?: React.ReactNode;
  enabled?: boolean;
  trigger?: React.RefObject<HTMLElement> | undefined;
  start?: TriggerPos;
  end?: TriggerPos;
  onChange?: (state: {
    progress: number;
    interpolatedProgress: number;
  }) => void;
  from?: { [x: string]: string | number };
  to?: { [x: string]: string | number };
  disableOnMobile?: boolean;
  config?: SpringConfig;
  frameInterval?: number;
  innerTag?: Tags;
  innerClassName?: string;
  mode?: "toggle" | "scrub";
} & Omit<React.HTMLAttributes<HTMLElement>, "onChange">;

const StaticTag = forwardRef<
  HTMLElement,
  { tag?: Tags; children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLElement>
>(({ tag = "span", children, className, ...props }, outerRef) => {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(outerRef, () => ref.current as HTMLElement);
  const Tag = tag as unknown as React.ComponentType<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  >;
  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
});
StaticTag.displayName = "StaticTag";

export const SpringTrigger = memo(
  forwardRef<HTMLElement, SpringTriggerProps & { tag?: Tags }>(
    (
      {
        tag: Tag = "div",
        children,
        start = "top bottom",
        end = "bottom top",
        trigger,
        from = {},
        to = {},
        onChange,
        enabled = true,
        disableOnMobile = false,
        frameInterval = 10,
        innerTag = "div",
        innerClassName,
        config: springConfig = { duration: 1, easing: easings.linear },
        mode = "scrub",
        ...props
      },
      ref,
    ) => {
      const innerRef = useRef<HTMLElement>(null);
      useImperativeHandle(ref, () => innerRef.current as HTMLElement);

      const { springs } = useSpringTrigger({
        start,
        end,
        trigger,
        from,
        to,
        onChange,
        enabled,
        disableOnMobile,
        frameInterval,
        config: springConfig,
        mode,
        elementRef: innerRef,
      });

      if (trigger && Tag === undefined) {
        return <>{children}</>;
      }

      return (
        <StaticTag tag={Tag} ref={innerRef} {...props}>
          <AnimatedVarTextTag
            tag={innerTag}
            style={springs as unknown as React.CSSProperties}
            className={innerClassName}
          >
            {children}
          </AnimatedVarTextTag>
        </StaticTag>
      );
    },
  ),
);

SpringTrigger.displayName = "SpringTrigger";

// `animated` is referenced for parity with the engine's animated style output.
void animated;
