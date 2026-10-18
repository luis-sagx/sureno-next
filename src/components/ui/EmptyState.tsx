"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-16 text-center",
        className
      )}
    >
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-line text-secondary">
        <span
          aria-hidden="true"
          className="absolute inset-[-5px] rounded-full border border-line-strong/40"
        />
        {icon}
      </div>
      <h3 className="mb-2 font-headline text-xl text-on-surface">{title}</h3>
      {description && (
        <p className="mb-7 max-w-sm text-sm leading-relaxed text-on-surface-variant">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
