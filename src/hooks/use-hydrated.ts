"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * True only after hydration (server snapshot is always false).
 *
 * The canonical escape hatch for flags that are read from browser APIs during
 * render but must not change the server HTML — e.g. reduced motion, where the
 * first client render has to match the server before the DOM can switch.
 */
export const useHydrated = (): boolean =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
