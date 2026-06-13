import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container mt-auto">
      <div className="mx-auto max-w-[1280px] px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Empresa */}
          <div>
            <h3 className="font-headline text-lg text-on-surface mb-4">
              Empresa
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?mode=wholesale"
                  className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Pedidos al Mayoreo
                </Link>
              </li>
              <li>
                <Link
                  href="/about#shipping"
                  className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Información de Envío
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-headline text-lg text-on-surface mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="font-headline text-lg text-on-surface mb-4">
              Soporte
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-on-surface-variant">
                Av. Principal 123, Col. Centro
                <br />
                Ciudad de México, CDMX
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-sm text-secondary hover:underline transition-colors"
                >
                  Contactar Soporte
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-outline-variant text-center">
          <p className="text-xs text-on-surface-variant">
            © 2026 Licorería Sureño. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
