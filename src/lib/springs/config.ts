/**
 * Global configuration for the spring animation components.
 *
 * disableOnMobile: controls which spring animations are disabled on phones
 * - hover: hover animations (default: true — there is no hover on mobile)
 * - inview: in-view reveals
 * - spring: basic spring animations
 * - springtrigger: scroll-triggered animations
 */

interface SpringsConfig {
  mobileWidth: number;
  disableOnMobile: {
    hover: boolean;
    inview: boolean;
    spring: boolean;
    springtrigger: boolean;
  };
}

export const springsConfig: SpringsConfig = {
  mobileWidth: 768,
  disableOnMobile: {
    hover: true,
    inview: false,
    spring: false,
    springtrigger: false,
  },
} as const;

/**
 * @param value - whether the animation opts into mobile-disabling
 * @param viewportWidth - optional explicit width (px); pass a React-tracked
 *   value here so callers re-evaluate on resize. Omitted (event handlers) →
 *   `window.innerWidth`.
 *
 * A tracked width of **0** means "not measured yet": `useWindowWidth()`
 * returns its server snapshot (0) during hydration. That must answer like the
 * server (`false`), never fall back to `window.innerWidth` — a fallback made a
 * client render disagree with the server HTML (React #418).
 */
export const isMobileDisabled = (value: boolean, viewportWidth?: number) => {
  if (typeof window === "undefined") return false;
  if (!value) return false;
  if (viewportWidth === 0) return false;
  const width = viewportWidth ?? window.innerWidth;
  return width <= springsConfig.mobileWidth;
};
