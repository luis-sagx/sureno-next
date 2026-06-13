export const dynamic = "force-dynamic";

import { getOrderList } from "@/lib/actions/admin";
import { updateOrderStatus } from "@/lib/actions/admin";
import { formatPrice } from "@/lib/pricing";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getOrderDetail(orderId: string) {
  const order = serializeDecimal(
    await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: { name: true, slug: true },
                },
              },
            },
          },
        },
        user: {
          select: { name: true, email: true, company: true },
        },
      },
    })
  );

  if (!order) return null;

  return {
    ...order,
    retailSubtotal: Number(order.retailSubtotal),
    wholesaleSubtotal: order.wholesaleSubtotal
      ? Number(order.wholesaleSubtotal)
      : null,
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
    })),
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderDetail(id);

  if (!order) {
    notFound();
  }

  const nextStatuses: Record<string, string> = {
    PENDING: "SHIPPED",
    SHIPPED: "DELIVERED",
    DELIVERED: "",
    CANCELLED: "",
  };

  const nextStatus = nextStatuses[order.status];
  const statusLabel: Record<string, string> = {
    PENDING: "Marcar como Enviado",
    SHIPPED: "Marcar como Entregado",
  };

  const retailItems = order.items.filter((item) => item.type === "RETAIL");
  const wholesaleItems = order.items.filter((item) => item.type === "WHOLESALE");

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back link */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-secondary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Órdenes
      </Link>

      {/* Order header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-headline text-3xl text-on-surface">
            Orden {order.orderNumber}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={order.status} />
            <span
              className={cn(
                "text-xs font-semibold uppercase px-2 py-0.5 rounded",
                order.type === "RETAIL"
                  ? "bg-secondary/20 text-secondary"
                  : "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300"
              )}
            >
              {order.type === "RETAIL" ? "Minorista" : "Mayorista"}
            </span>
            <span className="text-sm text-on-surface-variant">
              {new Date(order.createdAt).toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {nextStatus && (
          <form
            action={async () => {
              "use server";
              await updateOrderStatus(id, nextStatus);
              redirect(`/admin/orders/${id}`);
            }}
          >
            <Button variant="secondary" size="md" type="submit">
              {statusLabel[order.status] || "Actualizar Estado"}
            </Button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer & Order Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer info */}
          <div className="bg-surface-container rounded-lg p-5 space-y-3">
            <h3 className="font-headline text-lg text-on-surface">
              Datos del Cliente
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-on-surface-variant">Nombre:</span>
                <p className="text-on-surface font-medium">{order.fullName}</p>
              </div>
              {order.user?.name && order.user.name !== order.fullName && (
                <div>
                  <span className="text-on-surface-variant">Cuenta:</span>
                  <p className="text-on-surface font-medium">{order.user.name}</p>
                </div>
              )}
              {order.company && (
                <div>
                  <span className="text-on-surface-variant">Empresa:</span>
                  <p className="text-on-surface font-medium">{order.company}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping info */}
          <div className="bg-surface-container rounded-lg p-5 space-y-3">
            <h3 className="font-headline text-lg text-on-surface">Envío</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-on-surface-variant">Dirección:</span>
                <p className="text-on-surface font-medium">{order.street}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-on-surface-variant">Ciudad:</span>
                  <p className="text-on-surface font-medium">{order.city}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant">C.P.:</span>
                  <p className="text-on-surface font-medium">{order.zipCode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-surface-container rounded-lg p-5 space-y-3">
            <h3 className="font-headline text-lg text-on-surface">Pago</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-on-surface-variant">Método:</span>
                <p className="text-on-surface font-medium">
                  {order.paymentMethod === "DIRECT_PAYMENT"
                    ? "Pago Directo"
                    : "Cotización Mayorista"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order items & totals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Retail items */}
          {retailItems.length > 0 && (
            <div className="bg-surface-container rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-outline-variant">
                <h3 className="font-headline text-lg text-on-surface flex items-center gap-2">
                  <Package className="w-4 h-4 text-secondary" />
                  Productos Retail
                </h3>
              </div>
              <table className="w-full">
                <thead className="bg-surface-container-high">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Producto
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Variante
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Cant.
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Precio
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {retailItems.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-high transition-colors">
                      <td className="px-4 py-3 text-sm text-on-surface">
                        {item.variant?.product?.name || `Producto #${item.variantId}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">
                        {item.variant?.label || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface text-right tabular-nums">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface text-right tabular-nums">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface font-medium text-right tabular-nums">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Wholesale items */}
          {wholesaleItems.length > 0 && (
            <div className="bg-surface-container rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-outline-variant">
                <h3 className="font-headline text-lg text-on-surface flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-500" />
                  Productos Mayoristas
                </h3>
              </div>
              <table className="w-full">
                <thead className="bg-surface-container-high">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Producto
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Variante
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Cant.
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Precio
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {wholesaleItems.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-high transition-colors">
                      <td className="px-4 py-3 text-sm text-on-surface">
                        {item.variant?.product?.name || `Producto #${item.variantId}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">
                        {item.variant?.label || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface text-right tabular-nums">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface text-right tabular-nums">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface font-medium text-right tabular-nums">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Totals */}
          <div className="bg-surface-container rounded-lg p-5 space-y-2">
            {order.retailSubtotal > 0 && (
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Subtotal Retail</span>
                <span className="tabular-nums">
                  {formatPrice(order.retailSubtotal)}
                </span>
              </div>
            )}
            {order.wholesaleSubtotal && order.wholesaleSubtotal > 0 && (
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Subtotal Mayorista</span>
                <span className="tabular-nums">
                  {formatPrice(order.wholesaleSubtotal)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Envío</span>
              <span className="tabular-nums">
                {formatPrice(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between font-headline text-lg text-on-surface pt-2 border-t border-outline-variant">
              <span>Total</span>
              <span className="tabular-nums text-secondary">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
