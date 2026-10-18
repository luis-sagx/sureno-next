"use client";

import { Spring } from "@/components/animation/springs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SPRING, imageSettle } from "@/lib/springs/presets";
import { cn } from "@/lib/utils";
import { Package2, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface ImageGalleryProps {
  imageUrl?: string | null;
  productName: string;
  channel?: "retail" | "wholesale";
  className?: string;
}

/**
 * The product stage: a hairline frame with stage light from the top edge, the
 * bottle centred on it, and the channel called out under a short rule. Images
 * settle in with a spring whenever the channel or presentation changes.
 */
export function ImageGallery({
  imageUrl,
  productName,
  channel = "retail",
  className,
}: ImageGalleryProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = Boolean(imageUrl) && failedUrl !== imageUrl;

  const ChannelIcon = channel === "retail" ? ShoppingBag : Package2;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="craft relative aspect-square overflow-hidden rounded">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_85%_at_50%_0%,var(--theme-stage-top),transparent_62%)]"
        />

        <Spring
          key={imageUrl ?? "empty"}
          from={imageSettle.from}
          to={imageSettle.to}
          mode="once"
          config={SPRING.entrance}
          className="absolute inset-0 flex items-center justify-center p-10"
        >
          {showImage ? (
            <img
              src={imageUrl ?? undefined}
              alt={productName}
              className="h-full w-full object-contain"
              onError={() => setFailedUrl(imageUrl ?? null)}
            />
          ) : (
            <span className="flex flex-col items-center gap-4 text-center">
              <span className="font-headline text-7xl italic leading-none text-on-surface-variant/20 select-none">
                {productName.charAt(0)}
              </span>
              <span className="max-w-[24ch] font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant/60">
                {productName}
              </span>
            </span>
          )}
        </Spring>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line pt-4">
        <Eyebrow rule>
          <span className="inline-flex items-center gap-2">
            <ChannelIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {channel === "retail" ? "Vista minorista" : "Vista mayorista"}
          </span>
        </Eyebrow>
        <span className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
          {productName}
        </span>
      </div>
    </div>
  );
}
