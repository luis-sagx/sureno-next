'use client'

import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatPrice } from '@/lib/pricing'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type OrderStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

interface OrderRow extends Record<string, unknown> {
  id: string
  orderNumber: string
  createdAt: Date | string
  user: { name: string | null } | null
  fullName: string | null
  company: string | null
  type: 'RETAIL' | 'WHOLESALE'
  total: number | string
  status: OrderStatus
}

interface OrdersTableProps {
  orders: OrderRow[]
  page: number
  totalPages: number
}

export function OrdersTable({ orders, page, totalPages }: OrdersTableProps) {
  const columns = [
    {
      key: 'orderNumber',
      header: 'ID Orden',
      render: (order: OrderRow) => (
        <span className="font-mono text-xs text-secondary font-semibold">
          {order.orderNumber}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      render: (order: OrderRow) => (
        <span className="text-sm text-on-surface-variant tabular-nums">
          {new Date(order.createdAt).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      key: 'customer',
      header: 'Cliente',
      render: (order: OrderRow) => (
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
      key: 'type',
      header: 'Tipo',
      render: (order: OrderRow) => (
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase',
            order.type === 'RETAIL'
              ? 'bg-secondary/20 text-secondary'
              : 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300',
          )}
        >
          {order.type === 'RETAIL' ? 'Minorista' : 'Mayorista'}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (order: OrderRow) => (
        <span className="text-sm text-on-surface font-medium tabular-nums">
          {formatPrice(Number(order.total))}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (order: OrderRow) => <StatusBadge status={order.status} />,
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (order: OrderRow) => (
        <Link href={`/admin/orders/${order.id}`}>
          <Button variant="ghost" size="sm">
            Ver más
          </Button>
        </Link>
      ),
    },
  ]

  function handlePageChange(newPage: number) {
    const url = new URL(window.location.href)
    url.searchParams.set('page', String(newPage))
    window.location.href = url.toString()
  }

  return (
    <DataTable
      columns={columns}
      data={orders}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  )
}
