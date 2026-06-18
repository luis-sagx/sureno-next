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
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-headline text-on-surface mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-on-surface-variant max-w-sm mb-6">
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
