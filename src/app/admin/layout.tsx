import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Bell, Search, Settings } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      {/* Main content area — offset by sidebar width */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-outline-variant flex items-center justify-between px-6">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="search"
              placeholder="Buscar órdenes, productos..."
              className="w-full h-10 pl-10 pr-4 rounded-md bg-surface-container-highest border border-outline-variant text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              aria-label="Configuración"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
