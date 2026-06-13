"use client";

import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface ImageGalleryProps {
  imageUrl?: string | null;
  productName: string;
  className?: string;
}

export function ImageGallery({
  imageUrl,
  productName,
  className,
}: ImageGalleryProps) {
  return (
    <div
      className={cn(
        "relative aspect-square rounded-lg overflow-hidden bg-surface-container-highest flex items-center justify-center",
        className
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={productName}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <span className="font-headline text-7xl text-on-surface-variant/15 italic select-none">
            {productName.charAt(0)}
          </span>
          <span className="mt-4 text-sm text-on-surface-variant/50">
            {productName}
          </span>
        </div>
      )}

      {/* Decorative play button overlay */}
      <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Play className="w-4 h-4 text-on-surface" />
      </div>
    </div>
  );
}
