export const dynamic = "force-dynamic";

import { getProducts, updateProduct } from "@/lib/actions/admin";
import { serializeDecimal } from "@/lib/serialize";
import { formatPrice } from "@/lib/pricing";
import { StatsCard } from "@/components/ui/StatsCard";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { Package, AlertTriangle, XCircle, Plus, Search } from "lucide-react";

export default async function InventoryPage() {
  const products = serializeDecimal(await getProducts());

  const totalProducts = products.length;
  const lowStock = products.filter(
    (p) => p.stockStatus === "LOW" || p.stockStatus === "OUT"
  );
  const outOfStock = products.filter((p) => p.stockStatus === "OUT");

  // Compute total stock across all variants
  const getTotalStock = (product: any) =>
    product.variants.reduce((sum: number, v: any) => sum + v.stock, 0);

  const stockStatusLabel: Record<string, { label: string; className: string }> =
    {
      HIGH: {
        label: "Stock Alto",
        className:
          "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300",
      },
      MEDIUM: {
        label: "Stock Medio",
        className:
          "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300",
      },
      LOW: {
        label: "Stock Bajo",
        className:
          "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300",
      },
      OUT: {
        label: "Sin Stock",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      },
    };

  const columns = [
    {
      key: "image",
      header: "Imagen",
      render: (product: any) => (
        <div className="w-10 h-10 rounded-md bg-surface-container flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-headline text-lg text-on-surface-variant/30 italic">
              {product.name.charAt(0)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Nombre",
      sortable: true,
      render: (product: any) => (
        <div>
          <p className="text-sm text-on-surface font-medium">{product.name}</p>
          {product.brand && (
            <p className="text-xs text-on-surface-variant">{product.brand.name}</p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Categoría",
      render: (product: any) => (
        <span className="text-sm text-on-surface-variant">
          {product.category?.name || "—"}
        </span>
      ),
    },
    {
      key: "retailPrice",
      header: "Precio Retail",
      sortable: true,
      render: (product: any) => (
        <span className="text-sm text-on-surface font-medium tabular-nums">
          {formatPrice(product.retailPrice)}
        </span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (product: any) => (
        <span className="text-sm text-on-surface tabular-nums font-medium">
          {getTotalStock(product)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (product: any) => {
        const config = stockStatusLabel[product.stockStatus] || stockStatusLabel["MEDIUM"];
        return (
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
              config.className
            )}
          >
            {config.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl text-on-surface">
            Inventario de Productos
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Gestiona el catálogo de productos y niveles de stock
          </p>
        </div>
        <Button variant="primary" size="sm" disabled>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          icon={Package}
          value={totalProducts}
          label="Total Productos"
        />
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

      {/* Search bar */}
      <div className="flex items-center gap-3 bg-surface-container rounded-lg p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Products table */}
      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Sin productos"
          description="No hay productos en el inventario todavía."
        />
      ) : (
        <DataTable
          columns={columns}
          data={products as any}
        />
      )}
    </div>
  );
}
