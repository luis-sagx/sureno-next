export const dynamic = "force-dynamic";

import { getOrderStats, getOrderList } from "@/lib/actions/admin";
import { serializeDecimal } from "@/lib/serialize";
import { formatPrice } from "@/lib/pricing";
import { StatsCard } from "@/components/ui/StatsCard";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  ClipboardList,
  ShoppingCart,
  TrendingUp,
  Download,
  Plus,
  Search,
  Filter,
  Package,
} from "lucide-react";
import Link from "next/link";

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const status = params.status || "Todos";
  const dateFrom = params.dateFrom || "";
  const dateTo = params.dateTo || "";
  const page = parseInt(params.page || "1", 10);

  const [stats, orderData] = serializeDecimal(
    await Promise.all([
      getOrderStats(),
      getOrderList({
        page,
        limit: 15,
        status: status !== "Todos" ? status : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      }),
    ])
  );

  const statusOptions = ["Todos", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

  const todayOrders = orderData.orders.filter((o) => {
    const today = new Date();
    return o.createdAt.toDateString() === today.toDateString();
  }).length;

  const avgTicket =
    orderData.orders.length > 0
      ? orderData.orders.reduce((sum, o) => sum + Number(o.total), 0) / orderData.orders.length
      : 0;

  const columns = [
    {
      key: "orderNumber",
      header: "ID Orden",
      render: (order: any) => (
        <span className="font-mono text-xs text-secondary font-semibold">
          {order.orderNumber}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Fecha",
      render: (order: any) => (
        <span className="text-sm text-on-surface-variant tabular-nums">
          {new Date(order.createdAt).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Cliente",
      render: (order: any) => (
        <div>
          <p className="text-sm text-on-surface font-medium">
            {order.user?.name || order.fullName}
          </p>
          {order.company && (
            <p className="text-xs text-on-surface-variant">{order.company}</p>
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      render: (order: any) => (
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase",
            order.type === "RETAIL"
              ? "bg-secondary/20 text-secondary"
              : "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300"
          )}
        >
          {order.type === "RETAIL" ? "Minorista" : "Mayorista"}
        </span>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (order: any) => (
        <span className="text-sm text-on-surface font-medium tabular-nums">
          {formatPrice(order.total)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (order: any) => <StatusBadge status={order.status} />,
    },
    {
      key: "actions",
      header: "Acciones",
      render: (order: any) => (
        <Link href={`/admin/orders/${order.id}`}>
          <Button variant="ghost" size="sm">
            Ver Detalle
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl text-on-surface">
            Gestión de Órdenes
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Administra y da seguimiento a las órdenes de tus clientes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button variant="primary" size="sm" disabled>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Orden
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={DollarSign}
          value={formatPrice(stats.totalRevenue)}
          label="Ingresos Totales"
          trend={{
            value: `${stats.revenueChange >= 0 ? "+" : ""}${stats.revenueChange}%`,
            positive: stats.revenueChange >= 0,
          }}
        />
        <StatsCard
          icon={ClipboardList}
          value={stats.activeOrders}
          label="Órdenes Activas"
        />
        <StatsCard
          icon={ShoppingCart}
          value={todayOrders}
          label="Órdenes Hoy"
        />
        <StatsCard
          icon={TrendingUp}
          value={formatPrice(avgTicket)}
          label="Ticket Promedio"
        />
      </div>

      {/* Filter bar */}
      <form className="flex flex-wrap items-end gap-3 bg-surface-container rounded-lg p-4">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-sm font-medium text-on-surface-variant mb-1">
            Estado
          </label>
          <select
            name="status"
            defaultValue={status}
            className="w-full h-11 px-3 rounded-md bg-surface-container-highest border border-outline-variant text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "Todos"
                  ? "Todos"
                  : opt === "PENDING"
                    ? "Pendientes"
                    : opt === "SHIPPED"
                      ? "Enviados"
                      : opt === "DELIVERED"
                        ? "Entregados"
                        : "Cancelados"}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[140px]">
          <label className="block text-sm font-medium text-on-surface-variant mb-1">
            Desde
          </label>
          <Input name="dateFrom" type="date" defaultValue={dateFrom} />
        </div>

        <div className="min-w-[140px]">
          <label className="block text-sm font-medium text-on-surface-variant mb-1">
            Hasta
          </label>
          <Input name="dateTo" type="date" defaultValue={dateTo} />
        </div>

        <Button type="submit" variant="secondary" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtrar
        </Button>

        {status !== "Todos" && (
          <a href="/admin/orders" className="inline-flex items-center h-11">
            <span className="text-sm text-secondary hover:text-secondary/80">
              Limpiar filtros
            </span>
          </a>
        )}
      </form>

      {/* Orders table */}
      {orderData.orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Sin órdenes"
          description="No se encontraron órdenes con los filtros actuales."
        />
      ) : (
        <DataTable
          columns={columns}
          data={orderData.orders as any}
          page={orderData.page}
          totalPages={orderData.totalPages}
          onPageChange={(newPage) => {
            // Client-side pagination via URL
            const url = new URL(window.location.href);
            url.searchParams.set("page", String(newPage));
            window.location.href = url.toString();
          }}
        />
      )}
    </div>
  );
}
