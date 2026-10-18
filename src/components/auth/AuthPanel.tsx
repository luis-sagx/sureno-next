import { TextReveal } from "@/components/animation/text/TextReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthPanelProps {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  /** Fine print under the form (links to the other screen). */
  footer?: ReactNode;
}

/**
 * Shared shell for the auth screens: one crafted panel, the wordmark, and the
 * editorial heading. Focused enough to stand alone, dressed like the store.
 */
export function AuthPanel({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthPanelProps) {
  return (
    <div className="craft relative overflow-hidden rounded p-8">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(120%_80%_at_50%_-16%,var(--theme-stage-top),transparent_70%)]"
      />

      <div className="relative flex flex-col gap-7">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 self-start font-label text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-on-surface-variant transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:text-secondary"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform duration-[var(--theme-duration-normal)] ease-entrance group-hover:-translate-x-1"
            aria-hidden="true"
          />
          Volver a la tienda
        </Link>

        <Image
          src="/logo-text.webp"
          alt="Licorería Sureño"
          width={180}
          height={50}
          className="mx-auto h-24 w-auto"
          priority
        />

        <div className="flex flex-col items-center gap-4 text-center">
          <Eyebrow rule>{eyebrow}</Eyebrow>
          <TextReveal
            tag="h1"
            variant="lines"
            align="center"
            className="type-title text-on-surface"
          >
            {title}
          </TextReveal>
          {description && (
            <p className="max-w-prose text-sm leading-relaxed text-on-surface-variant">
              {description}
            </p>
          )}
        </div>

        {children}

        {footer && (
          <div className="border-t border-line pt-6 text-center text-sm text-on-surface-variant">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
