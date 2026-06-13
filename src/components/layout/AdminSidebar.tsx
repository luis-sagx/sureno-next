"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Panel",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Órdenes",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    label: "Inventario",
    href: "/admin/inventory",
    icon: Package,
  },
  {
    label: "Clientes",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Soporte",
    href: "/admin/support",
    icon: HelpCircle,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-surface-container border-r border-outline-variant flex flex-col">
      {/* Logo / Title */}
      <div className="h-16 flex items-center px-6 border-b border-outline-variant">
        <Link href="/admin" className="font-headline text-lg italic text-secondary">
          Sureño Admin
        </Link>
      </div>

      {/* User info area */}
      <div className="px-6 py-4 border-b border-outline-variant">
        <p className="text-sm text-on-surface">Administrador</p>
        <p className="text-xs text-on-surface-variant">admin@sureno.mx</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors relative",
                isActive
                  ? "bg-surface-container-high text-on-surface"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              {/* Active indicator — gold left border */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-secondary rounded-r-full" />
              )}
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-outline-variant">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors w-full">
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
