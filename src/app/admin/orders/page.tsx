export const dynamic = 'force-dynamic'

import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { StatsCard } from '@/components/ui/StatsCard'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { getOrderList, getOrderStats } from '@/lib/actions/admin'
import { formatPrice } from '@/lib/pricing'
import { serializeDecimal } from '@/lib/serialize'
import Link from 'next/link'
import {
  ClipboardList,
  DollarSign,
  Download,
  Filter,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string
    dateFrom?: string
    dateTo?: string
    page?: string
  }>
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams
  const status = params.status || 'Todos'
  const dateFrom = params.dateFrom || ''
  const dateTo = params.dateTo || ''
  const page = parseInt(params.page || '1', 10)

  const [stats, orderData] = serializeDecimal(
    await Promise.all([
      getOrderStats(),
      getOrderList({
        page,
        limit: 15,
        status: status !== 'Todos' ? status : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      }),
    ]),
  )

  const statusOptions = [
    'Todos',
    'PENDING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ]

  const todayOrders = orderData.orders.filter((o) => {
    const today = new Date()
    return o.createdAt.toDateString() === today.toDateString()
  }).length

  const avgTicket =
    orderData.orders.length > 0
      ? orderData.orders.reduce((sum, o) => sum + Number(o.total), 0) /
        orderData.orders.length
      : 0

  const tableOrders = orderData.orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt.toISOString(),
    user: order.user ? { name: order.user.name } : null,
    fullName: order.fullName,
    company: order.company,
    type: order.type,
    total: Number(order.total),
    status: order.status,
  }))

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
            value: `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange}%`,
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
                {opt === 'Todos'
                  ? 'Todos'
                  : opt === 'PENDING'
                    ? 'Pendientes'
                    : opt === 'SHIPPED'
                      ? 'Enviados'
                      : opt === 'DELIVERED'
                        ? 'Entregados'
                        : 'Cancelados'}
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

        {status !== 'Todos' && (
          <Link href="/admin/orders" className="inline-flex items-center h-11">
            <span className="text-sm text-secondary hover:text-secondary/80">
              Limpiar filtros
            </span>
          </Link>
        )}
      </form>

      {/* Orders table */}
      {orderData.orders.length === 0 ? (
        <EmptyState
          icon={<Package className="w-16 h-16 text-on-surface-variant/30" />}
          title="Sin órdenes"
          description="No se encontraron órdenes con los filtros actuales."
        />
      ) : (
        <OrdersTable
          orders={tableOrders}
          page={orderData.page}
          totalPages={orderData.totalPages}
        />
      )}
    </div>
  )
}
