import { Eyebrow } from "@/components/ui/Eyebrow";
import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    heading: "Empresa",
    links: [
      { label: "Sobre Nosotros", href: "/about" },
      { label: "Pedidos al Mayoreo", href: "/mayoreo" },
      { label: "Información de Envío", href: "/about#shipping" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Términos de Servicio", href: "/terms" },
      { label: "Política de Privacidad", href: "/privacidad" },
    ],
  },
];

/**
 * Editorial footer: brand column over a hairline grid, closing with the
 * copyright bar.
 */
export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-line bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col items-start gap-4">
            <Image
              src="/logo-text.webp"
              alt="Licorería Sureño"
              width={160}
              height={48}
              className="h-24 w-auto"
            />
            <span aria-hidden="true" className="h-px w-16 bg-line-strong" />
            <Eyebrow>Quito, Ecuador</Eyebrow>
          </div>

          {columns.map((column) => (
            <div key={column.heading} className="flex flex-col gap-5">
              <Eyebrow>{column.heading}</Eyebrow>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-on-surface-variant transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:text-secondary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-5">
            <Eyebrow>Soporte</Eyebrow>
            <ul className="space-y-3">
              <li className="text-sm text-on-surface-variant">
                Quito, Ecuador
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-sm text-secondary underline decoration-line-strong underline-offset-4 transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:decoration-secondary"
                >
                  Contactar Soporte
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-on-surface-variant">
            © 2026 Licorería Sureño. Todos los derechos reservados.
          </p>
          <span className="index-numeral text-xs text-on-surface-variant/70">
            Desde 1998
          </span>
        </div>
      </div>
    </footer>
  );
}
