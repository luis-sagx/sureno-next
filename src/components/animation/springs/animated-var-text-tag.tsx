"use client";

import { animated } from "@react-spring/web";
import {
  CSSProperties,
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import type { Tags } from "@/types/springs";

/** Props every animated element accepts from the engine. */
export type AnimatedTagProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
};

export interface AnimatedVarTextTagProps {
  tag?: Tags;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Renders the semantically correct HTML element as a react-spring `animated`
 * component, forwarding its node to the engine via a ref. This is the shared
 * primitive every spring component in this folder builds on.
 */
export const AnimatedVarTextTag = forwardRef<HTMLElement, AnimatedVarTextTagProps>(
  ({ tag = "span", children, className, style, ...props }, outerRef) => {
    const ref = useRef<HTMLElement | null>(null);
    useImperativeHandle(outerRef, () => ref.current as HTMLElement);
    const Tag = animated[tag] as React.ComponentType<AnimatedTagProps>;

    return (
      <Tag ref={ref} className={className} style={style} {...props}>
        {children}
      </Tag>
    );
  },
);

AnimatedVarTextTag.displayName = "AnimatedVarTextTag";
