"use client";

import dynamic from "next/dynamic";

const StoreMap = dynamic(
  () => import("./StoreMap").then((m) => m.StoreMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] animate-pulse bg-surface-container" />
    ),
  }
);

export function MapLoader() {
  return <StoreMap />;
}
