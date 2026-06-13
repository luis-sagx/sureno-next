"use client";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useEffect, useState } from "react";
import {
  X,
  Mail,
  Building2,
  MapPin,
  Hash,
  Clock,
  ShoppingBag,
  MessageSquare,
  Edit3,
  User,
} from "lucide-react";

interface UserDetail {
  id: string;
  email: string;
  name: string;
  role: string;
  type: string;
  company: string | null;
  taxId: string | null;
  address: string | null;
  createdAt: string | Date;
  totalSpent: number;
  orders: {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string | Date;
  }[];
  activities: {
    id: string;
    action: string;
    details: string | null;
    createdAt: string;
  }[];
}

interface UserDetailDrawerProps {
  userId: string;
  onClose: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "ahora";
  if (diffMins < 60) return `hace ${diffMins}m`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  if (diffDays < 30) return `hace ${diffDays}d`;
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function UserDetailDrawer({ userId, onClose }: UserDetailDrawerProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const { getUserDetail } = await import("@/lib/actions/admin");
        const data = await getUserDetail(userId);
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [userId]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        data-testid="user-drawer-backdrop"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-96 max-w-[100vw] bg-background shadow-2xl flex flex-col overflow-y-auto"
        )}
        role="dialog"
        aria-label="Detalle de usuario"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-background">
          <h2 className="font-headline text-xl text-on-surface">
            Perfil de Usuario
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label="Cerrar panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !user ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 space-y-4">
            <User className="w-16 h-16 text-on-surface-variant/30" />
            <p className="text-on-surface-variant text-center">
              No se pudo cargar el usuario
            </p>
          </div>
        ) : (
          <div className="flex-1 px-6 py-6 space-y-6">
            {/* User avatar + name */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="font-headline text-2xl text-secondary">
                  {getInitials(user.name)}
                </span>
              </div>
              <div>
                <h3 className="font-headline text-xl text-on-surface">
                  {user.name}
                </h3>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase mt-1",
                    user.type === "INDIVIDUAL"
                      ? "bg-secondary/20 text-secondary"
                      : "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300"
                  )}
                >
                  {user.type === "INDIVIDUAL" ? "Minorista" : "Mayorista"}
                </span>
              </div>
            </div>

            {/* Contact info */}
            <div className="bg-surface-container rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Mail className="w-4 h-4" />
                <span className="text-on-surface">{user.email}</span>
              </div>
              {user.company && (
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Building2 className="w-4 h-4" />
                  <span className="text-on-surface">{user.company}</span>
                </div>
              )}
              {user.address && (
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <MapPin className="w-4 h-4" />
                  <span className="text-on-surface">{user.address}</span>
                </div>
              )}
              {user.taxId && (
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Hash className="w-4 h-4" />
                  <span className="text-on-surface">RFC: {user.taxId}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container rounded-lg p-4 text-center">
                <p className="text-2xl font-headline text-secondary tabular-nums">
                  {formatPrice(user.totalSpent)}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  Valor de por Vida
                </p>
              </div>
              <div className="bg-surface-container rounded-lg p-4 text-center">
                <p
                  className={cn(
                    "text-sm font-semibold uppercase",
                    user.orders.length > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-on-surface-variant"
                  )}
                >
                  {user.orders.length > 0 ? "Activo" : "Inactivo"}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  Estado de Cuenta
                </p>
              </div>
            </div>

            {/* Recent orders */}
            {user.orders.length > 0 && (
              <div>
                <h4 className="font-headline text-base text-on-surface mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-secondary" />
                  Órdenes Recientes
                </h4>
                <div className="space-y-2">
                  {user.orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between bg-surface-container rounded-lg p-3"
                    >
                      <div>
                        <p className="text-sm text-on-surface font-medium">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {new Date(order.createdAt).toLocaleDateString("es-MX")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-on-surface font-medium tabular-nums">
                          {formatPrice(order.total)}
                        </p>
                        <StatusBadge status={order.status as any} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {user.activities.length > 0 && (
              <div>
                <h4 className="font-headline text-base text-on-surface mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  Actividad Reciente
                </h4>
                <div className="space-y-2">
                  {user.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 bg-surface-container rounded-lg p-3"
                    >
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-secondary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-on-surface">
                          {activity.action}
                          {activity.details && (
                            <span className="text-on-surface-variant">
                              {" "}
                              — {activity.details}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {timeAgo(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-outline-variant">
              <Button variant="secondary" className="w-full" disabled>
                <MessageSquare className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <Edit3 className="w-4 h-4 mr-2" />
                Editar Cuenta
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
