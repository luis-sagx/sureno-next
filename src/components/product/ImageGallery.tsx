"use client";

import { cn } from "@/lib/utils";
import { Package2, Play, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface ImageGalleryProps {
  imageUrl?: string | null;
  productName: string;
  channel?: "retail" | "wholesale";
  className?: string;
}

export function ImageGallery({
  imageUrl,
  productName,
  channel = "retail",
  className,
}: ImageGalleryProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative aspect-square rounded-lg overflow-hidden bg-surface-container-highest flex items-center justify-center",
          className,
        )}
      >
        {showImage ? (
          <img
            src={imageUrl ?? undefined}
            alt={productName}
            className="object-contain w-full h-full p-4"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <span className="font-headline text-7xl text-on-surface-variant/15 italic select-none">
              {productName.charAt(0)}
            </span>
            <span className="mt-4 text-sm text-on-surface-variant/50">{productName}</span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-4 h-4 text-on-surface" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-on-surface-variant">
        {channel === "retail" ? <ShoppingBag className="w-4 h-4" /> : <Package2 className="w-4 h-4" />}
        <span>{channel === "retail" ? "Vista minorista" : "Vista mayorista"}</span>
      </div>
    </div>
  );
}
