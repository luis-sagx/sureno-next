'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { CAJA_SIZE, formatPrice, getBestWholesalePrice } from '@/lib/pricing'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import type { Product, Variant, WholesaleTier } from '@prisma/client'
import { Eye, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type ProductWithVariants = Product & {
  category?: { name: string } | null
  brand?: { name: string } | null
  variants: (Variant & { wholesaleTiers: WholesaleTier[] })[]
}

interface ProductCardProps {
  product: ProductWithVariants
  viewMode?: 'retail' | 'wholesale'
  className?: string
}

const badgeVariantMap: Record<
  string,
  'save' | 'bestseller' | 'limited' | 'premium'
> = {
  SAVE_15: 'save',
  BEST_SELLER: 'bestseller',
  LIMITED_STOCK: 'limited',
  PREMIUM_RESERVE: 'premium',
}

export function ProductCard({
  product,
  viewMode = 'retail',
  className,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [imageFailed, setImageFailed] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const retailPrice = Number(product.retailPrice)
  const firstVariant = product.variants[0]
  const bestWholesale = firstVariant
    ? getBestWholesalePrice(firstVariant, quantity)
    : null
  const appliesWholesaleInRetail =
    viewMode === 'retail' && bestWholesale !== null && quantity >= CAJA_SIZE

  const variantImageUrl =
    viewMode === 'wholesale'
      ? firstVariant?.wholesaleImageUrl ||
        firstVariant?.retailImageUrl ||
        product.imageUrl ||
        null
      : firstVariant?.retailImageUrl ||
        firstVariant?.wholesaleImageUrl ||
        product.imageUrl ||
        null

  const handleAddToCart = () => {
    if (!firstVariant) return

    const effectivePrice =
      (viewMode === 'wholesale' || appliesWholesaleInRetail) && bestWholesale
        ? bestWholesale
        : retailPrice

    addItem({
      variantId: firstVariant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantLabel: firstVariant.label,
      unitPrice: effectivePrice,
      type:
        viewMode === 'wholesale' || appliesWholesaleInRetail
          ? 'WHOLESALE'
          : 'RETAIL',
      imageUrl: variantImageUrl,
      quantity,
    })
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-lg bg-surface-container hover:bg-surface-container-high transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 hover:border-secondary/40 border border-transparent overflow-hidden',
        className,
      )}
    >
      <div className="relative aspect-square bg-surface-container-highest flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-[1.04]">
        {variantImageUrl && !imageFailed ? (
          <img
            src={variantImageUrl}
            alt={product.name}
            className="object-contain w-full h-full"
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
              variant={badgeVariantMap[product.badge] || 'bestseller'}
              discount={product.badge === 'SAVE_15' ? '15%' : undefined}
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

        {viewMode === 'retail' && !appliesWholesaleInRetail ? (
          <PriceDisplay retailPrice={retailPrice} size="md" />
        ) : viewMode === 'retail' && appliesWholesaleInRetail ? (
          <div className="space-y-1">
            <span className="text-sm text-on-surface-variant line-through">
              {formatPrice(retailPrice)}
            </span>
            <span className="font-headline font-semibold text-xl text-on-surface block">
              {formatPrice(bestWholesale!)}
            </span>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium block">
              PRECIO MAYORISTA APLICADO
            </span>
          </div>
        ) : (
          <div className="space-y-1">
            <span className="text-sm text-on-surface-variant line-through">
              {formatPrice(retailPrice)}
            </span>
            <span className="font-headline font-semibold text-xl text-on-surface block">
              {bestWholesale
                ? formatPrice(bestWholesale)
                : formatPrice(retailPrice)}
            </span>
            {bestWholesale && (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium block">
                AHORRAS {formatPrice(retailPrice - bestWholesale)}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={99}
          />
          <div className="flex items-center gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-label font-semibold uppercase tracking-wider rounded border-2 border-secondary text-secondary bg-transparent hover:bg-secondary/10 transition-all duration-200"
            >
              <Eye className="h-3.5 w-3.5" />
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
  )
}
