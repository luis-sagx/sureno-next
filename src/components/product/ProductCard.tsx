"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { formatPrice, getBestWholesalePrice } from "@/lib/pricing";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import type { Product, Variant, WholesaleTier } from "@prisma/client";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ProductWithVariants = Product & {
  category?: { name: string } | null;
  brand?: { name: string } | null;
  variants: (Variant & { wholesaleTiers: WholesaleTier[] })[];
};

interface ProductCardProps {
  product: ProductWithVariants;
  viewMode?: "retail" | "wholesale";
  className?: string;
}

const badgeVariantMap: Record<string, "save" | "bestseller" | "limited" | "premium"> = {
  SAVE_15: "save",
  BEST_SELLER: "bestseller",
  LIMITED_STOCK: "limited",
  PREMIUM_RESERVE: "premium",
};

export function ProductCard({
  product,
  viewMode = "retail",
  className,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageFailed, setImageFailed] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const retailPrice = Number(product.retailPrice);
  const firstVariant = product.variants[0];
  const bestWholesale = firstVariant
    ? getBestWholesalePrice(firstVariant, quantity)
    : null;

  const variantImageUrl =
    viewMode === "wholesale"
      ? firstVariant?.wholesaleImageUrl || firstVariant?.retailImageUrl || product.imageUrl || null
      : firstVariant?.retailImageUrl || firstVariant?.wholesaleImageUrl || product.imageUrl || null;

  const handleAddToCart = () => {
    if (!firstVariant) return;

    addItem({
      variantId: firstVariant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantLabel: firstVariant.label,
      unitPrice: viewMode === "wholesale" && bestWholesale ? bestWholesale : retailPrice,
      type: viewMode === "wholesale" ? "WHOLESALE" : "RETAIL",
      imageUrl: variantImageUrl,
      quantity,
    });
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-lg bg-surface-container hover:bg-surface-container-high transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 hover:border-secondary/40 border border-transparent overflow-hidden",
        className,
      )}
    >
      <div className="relative aspect-square bg-surface-container-highest flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-[1.04]">
        {variantImageUrl && !imageFailed ? (
          <img
            src={variantImageUrl}
            alt={product.name}
            className="object-cover w-full h-full"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="font-headline text-4xl text-on-surface-variant/20 italic select-none">
            {product.name.charAt(0)}
          </span>
        )}

        {product.badge && (
          <div className="absolute top-2 right-2">
            <Badge
              variant={badgeVariantMap[product.badge] || "bestseller"}
              discount={product.badge === "SAVE_15" ? "15%" : undefined}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 space-y-3">
        <span className="text-xs text-on-surface-variant uppercase tracking-wider">
          {product.category?.name || product.type}
        </span>

        <Link href={`/product/${product.slug}`} className="group/title">
          <h3 className="font-headline text-lg leading-tight text-on-surface line-clamp-2 transition-colors group-hover/title:text-secondary">
            {product.name}
          </h3>
        </Link>

        {viewMode === "retail" ? (
          <PriceDisplay retailPrice={retailPrice} size="md" />
        ) : (
          <div className="space-y-1">
            <span className="text-sm text-on-surface-variant line-through">
              {formatPrice(retailPrice)}
            </span>
            <span className="font-headline font-semibold text-xl text-on-surface block">
              {bestWholesale ? formatPrice(bestWholesale) : formatPrice(retailPrice)}
            </span>
            {bestWholesale && (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium block">
                AHORRAS {formatPrice(retailPrice - bestWholesale)}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={99} />
          <div className="flex items-center gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="text-sm font-medium text-secondary underline-offset-4 hover:underline"
            >
              Ver detalle
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              aria-label="Agregar al carrito"
            >
              <ShoppingCart className="mr-1.5 h-4 w-4" />
              Agregar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
