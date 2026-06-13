"use client";

import { PricingToggle } from "@/components/catalog/PricingToggle";
import { useState } from "react";

export function FeaturedViewMode() {
  const [viewMode, setViewMode] = useState<"retail" | "wholesale">("retail");

  return (
    <PricingToggle
      value={viewMode}
      onChange={setViewMode}
    />
  );
}
