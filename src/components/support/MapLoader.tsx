"use client";

import dynamic from "next/dynamic";

const StoreMap = dynamic(
  () => import("./StoreMap").then((m) => m.StoreMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] rounded-xl bg-surface-container animate-pulse" />
    ),
  }
);

export function MapLoader() {
  return <StoreMap />;
}
