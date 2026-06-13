"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CartIcon } from "@/components/cart/CartIcon";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { cn } from "@/lib/utils";
import {
  CircleUser,
  Menu,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Mayoreo", href: "/catalog?view=wholesale" },
  { label: "Retail", href: "/catalog?view=retail" },
  { label: "Marcas", href: "/catalog" },
  { label: "Ofertas", href: "/catalog?category=ofertas-relampago" },
  { label: "Quiénes Somos", href: "/about" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-outline-variant">
      <div className="mx-auto max-w-[1280px] px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="font-headline text-xl italic text-secondary">
            Licorería Sureño
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-md transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart */}
          <CartIcon />

          {/* Account */}
          <Link
            href="/auth/login"
            className="w-9 h-9 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label="Cuenta"
          >
            <CircleUser className="w-5 h-5" />
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-outline-variant bg-background">
          <nav className="flex flex-col px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />
    </header>
  );
}
