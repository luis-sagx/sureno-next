export const dynamic = "force-dynamic";

import { getCategories, getProducts } from "@/lib/actions/admin";
import { serializeDecimal } from "@/lib/serialize";
import { StatsCard } from "@/components/ui/StatsCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { InventoryClient } from "./InventoryClient";
import { Package, AlertTriangle, XCircle } from "lucide-react";

export default async function InventoryPage() {
  const [products, categories] = serializeDecimal(
    await Promise.all([getProducts(), getCategories()])
  );

  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stockStatus === "LOW" || p.stockStatus === "OUT");
  const outOfStock = products.filter((p) => p.stockStatus === "OUT");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl text-on-surface">Inventario de Productos</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Gestiona el catálogo de productos y niveles de stock
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard icon={Package} value={totalProducts} label="Total Productos" />
        <StatsCard
          icon={AlertTriangle}
          value={lowStock.length}
          label="Stock Bajo"
          className="border border-amber-200 dark:border-amber-900"
        />
        <StatsCard
          icon={XCircle}
          value={outOfStock.length}
          label="Sin Stock"
          className="border border-red-200 dark:border-red-900"
        />
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={<Package className="w-16 h-16 text-on-surface-variant/30" />}
          title="Sin productos"
          description="No hay productos en el inventario todavía."
        />
      ) : (
        <InventoryClient products={products as any} categories={categories as any} />
      )}
    </div>
  );
}
