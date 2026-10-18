import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { StatsCard } from "@/components/ui/StatsCard";
import { getAdminDashboardData } from "@/lib/admin-dashboard";
import { formatPrice } from "@/lib/pricing";
import {
  ArrowRight,
  ClipboardList,
  DollarSign,
  PackageCheck,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export default async function AdminPage() {
  const data = await getAdminDashboardData();
  const period = `${new Date(data.periodStart).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  })} – ${new Date(data.periodEnd).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Resumen de operaciones
          </p>
          <h1 className="mt-2 font-headline text-3xl text-on-surface">Panel</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Actividad del {period}
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex h-10 items-center gap-2 rounded border border-secondary/50 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-secondary transition-colors hover:bg-secondary/10"
        >
          Ver órdenes <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <section aria-label="Indicadores de los últimos 30 días">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            icon={DollarSign}
            value={formatPrice(data.revenue)}
            label="Ingresos · 30 días"
          />
          <StatsCard
            icon={ShoppingBag}
            value={data.totalOrders}
            label="Órdenes · 30 días"
          />
          <StatsCard
            icon={PackageCheck}
            value={data.activeOrders}
            label="Órdenes activas"
          />
          <StatsCard
            icon={TrendingUp}
            value={formatPrice(data.averageTicket)}
            label="Ticket promedio · 30 días"
          />
        </div>
      </section>

      <DashboardCharts data={data.chartData} hasOrders={data.totalOrders > 0} />

      <section className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
        <div className="flex items-center justify-between gap-4 border-b border-outline-variant px-5 py-4">
          <div>
            <h2 className="font-headline text-xl text-on-surface">Órdenes recientes</h2>
            <p className="mt-1 text-xs text-on-surface-variant">Las 5 más nuevas</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary hover:underline"
          >
            Todas
          </Link>
        </div>
        {data.recentOrders.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <ClipboardList className="mx-auto h-8 w-8 text-on-surface-variant/50" aria-hidden="true" />
            <p className="mt-3 font-headline text-lg text-on-surface">Aún no hay órdenes</p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Las órdenes nuevas aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead className="text-[0.65rem] uppercase tracking-[0.15em] text-on-surface-variant">
                <tr>
                  <th className="px-5 py-3 font-semibold">Orden</th>
                  <th className="px-5 py-3 font-semibold">Cliente</th>
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/70">
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="text-sm">
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono text-xs font-semibold text-secondary hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-on-surface">
                      {order.company || order.fullName}
                    </td>
                    <td className="px-5 py-3 text-on-surface-variant">
                      {new Date(order.createdAt).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-on-surface">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
