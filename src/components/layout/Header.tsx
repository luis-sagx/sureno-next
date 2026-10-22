'use client'

import { CartDrawer } from '@/components/cart/CartDrawer'
import { CartIcon } from '@/components/cart/CartIcon'
import { Spring } from '@/components/animation/springs'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { SPRING } from '@/lib/springs/presets'
import { cn } from '@/lib/utils'
import { ArrowUpRight, CircleUser, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Quiénes somos', href: '/about' },
  { label: 'Mayoreo', href: '/mayoreo' },
  { label: 'Minorista', href: '/minorista' },
]

export function Header() {
  // The drawer is open for the path it was opened on; any navigation changes
  // the pathname and closes it, no effect needed.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const pathname = usePathname();
  const mobileOpen = openPath === pathname;

  // Lock the page behind the open drawer.
  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileOpen])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-line bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="Licorería Sureño — inicio">
            <Image
              src="/logo-text.webp"
              alt="Licorería Sureño"
              width={140}
              height={40}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {navLinks.map((link) => {
              const active =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative px-3 py-2 font-label text-xs font-semibold uppercase tracking-[0.18em]',
                    'after:absolute after:inset-x-3 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-secondary after:transition-transform after:duration-[var(--theme-duration-normal)] after:ease-entrance',
                    'transition-colors duration-[var(--theme-duration-fast)] ease-entrance',
                    active
                      ? 'text-secondary after:scale-x-100'
                      : 'text-on-surface-variant hover:text-on-surface hover:after:scale-x-100',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <CartIcon />

            <Link
              href="/auth/login"
              className="hidden h-9 w-9 items-center justify-center rounded text-on-surface-variant transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:bg-surface-container hover:text-secondary md:flex"
              aria-label="Cuenta"
            >
              <CircleUser className="h-5 w-5" />
            </Link>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setOpenPath(mobileOpen ? null : pathname)}
              className="flex h-9 w-9 items-center justify-center rounded text-on-surface-variant transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:bg-surface-container hover:text-on-surface md:hidden"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — mounted so the spring can run both ways */}
      <Spring
        id="mobile-nav"
        tag="div"
        enabled={mobileOpen}
        from={{ y: '-100%' }}
        to={{ y: '0%' }}
        config={SPRING.gentle}
        inert={!mobileOpen}
        className={cn(
          'fixed inset-x-0 top-20 z-40 h-[calc(100dvh-5rem)] border-t border-line bg-background md:hidden',
          !mobileOpen && 'pointer-events-none',
        )}
      >
        <nav
          className="flex h-full flex-col overflow-y-auto px-6 pt-4 pb-[max(2rem,env(safe-area-inset-bottom))]"
          aria-label="Móvil"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpenPath(null)}
              className="group flex items-center justify-between border-b border-line py-5 font-headline text-2xl text-on-surface transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:text-secondary"
            >
              {link.label}
              <ArrowUpRight
                className="h-5 w-5 text-secondary opacity-0 transition-opacity duration-[var(--theme-duration-normal)] ease-entrance group-hover:opacity-100"
                aria-hidden="true"
              />
            </Link>
          ))}

          <Link
            href="/auth/login"
            onClick={() => setOpenPath(null)}
            className="mt-8 flex items-center gap-3 font-label text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:text-secondary"
          >
            <CircleUser className="h-4 w-4" />
            Cuenta
          </Link>
        </nav>
      </Spring>

      {/* Cart Drawer — rendered outside <header> so its `fixed` positioning
        resolves against the viewport, not the backdrop-blurred header
        (backdrop-filter creates a containing block for fixed descendants). */}
      <CartDrawer />
    </>
  )
}
