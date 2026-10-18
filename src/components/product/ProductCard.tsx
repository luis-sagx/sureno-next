'use client'

import { Hover } from '@/components/animation/springs'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { SPRING } from '@/lib/springs/presets'
import { CAJA_SIZE, formatPrice, getBestWholesalePrice } from '@/lib/pricing'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import type { Product, Variant, WholesaleTier } from '../../generated/prisma/client'
import { ArrowRight, ShoppingCart } from 'lucide-react'
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
  density?: 'default' | 'compact'
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

/**
 * Shelf card: a crafted frame with a photography stage on top — stage light,
 * sheen sweep on hover, badge anchored to the corner — and an editorial body
 * underneath (category eyebrow, serif name, tabular price, hairline rule).
 * The commerce controls sit in one row so nothing overflows at four columns.
 */
export function ProductCard({
  product,
  viewMode = 'retail',
  density = 'default',
  className,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(viewMode === 'wholesale' ? CAJA_SIZE : 1)
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

  const detailHref =
    viewMode === 'wholesale'
      ? `/product/${product.slug}?mode=wholesale`
      : `/product/${product.slug}`

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
    <Hover
      tag="article"
      from={{ y: 0 }}
      to={{ y: -6 }}
      config={SPRING.snappy}
      className={cn('craft group flex h-full flex-col overflow-hidden rounded', className)}
    >
      {/* ── Photography stage ─────────────────────────────── */}
      <Link
        href={detailHref}
        aria-label={product.name}
        className={cn(
          'relative block overflow-hidden border-b border-line bg-surface-container-high/30',
          density === 'compact' ? 'aspect-square' : 'aspect-[4/5]',
        )}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_8%,var(--theme-stage-top),transparent_62%)]"
        />

        {variantImageUrl && !imageFailed ? (
          <img
            src={variantImageUrl}
            alt={product.name}
            className={cn(
              'relative h-full w-full object-contain transition-transform duration-[var(--theme-duration-normal)] ease-entrance group-hover:scale-[1.04]',
              density === 'compact' ? 'p-6' : 'p-8',
            )}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="relative grid h-full w-full place-items-center font-headline text-6xl italic text-on-surface-variant/25 select-none">
            {product.name.charAt(0)}
          </span>
        )}

        {/* Sheen sweep — a single pass of light across the glass on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -translate-x-[140%] rotate-[8deg] bg-[linear-gradient(90deg,transparent,var(--theme-inner-light),transparent)] transition-transform duration-[1100ms] ease-entrance group-hover:translate-x-[460%]"
        />

        {product.badge && (
          <span className="absolute left-3 top-3">
            <Badge
              variant={badgeVariantMap[product.badge] || 'bestseller'}
              discount={product.badge === 'SAVE_15' ? '15%' : undefined}
            />
          </span>
        )}
      </Link>

      {/* ── Editorial body ────────────────────────────────── */}
      <div
        className={cn(
          'flex flex-1 flex-col',
          density === 'compact' ? 'gap-2 p-4' : 'gap-3 p-5',
        )}
      >
        <span className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
          {product.category?.name || product.type}
        </span>

        <Link href={detailHref} className="group/title">
          <h3
            className={cn(
              'font-headline leading-snug text-on-surface transition-colors duration-[var(--theme-duration-fast)] ease-entrance group-hover/title:text-secondary line-clamp-2',
              density === 'compact' ? 'text-lg' : 'text-xl',
            )}
          >
            {product.name}
          </h3>
        </Link>

        {viewMode === 'retail' && !appliesWholesaleInRetail && (
          <span className="flex items-baseline gap-2">
            <span
              className={cn(
                'font-headline font-semibold leading-none tracking-tight text-on-surface tnum',
                density === 'compact' ? 'text-xl' : 'text-2xl',
              )}
            >
              {formatPrice(retailPrice)}
            </span>
            <span className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
              c/u
            </span>
          </span>
        )}

        {viewMode === 'retail' && appliesWholesaleInRetail && (
          <span className="flex flex-col gap-1">
            <span className="text-sm text-on-surface-variant line-through tnum">
              {formatPrice(retailPrice)}
            </span>
            <span
              className={cn(
                'font-headline font-semibold leading-none text-on-surface tnum',
                density === 'compact' ? 'text-xl' : 'text-2xl',
              )}
            >
              {formatPrice(bestWholesale!)}
            </span>
            <span className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-secondary">
              Precio mayorista aplicado
            </span>
          </span>
        )}

        {viewMode === 'wholesale' && (
          <span className="flex flex-col gap-1">
            {bestWholesale != null && bestWholesale < retailPrice ? (
              <>
                <span className="text-sm text-on-surface-variant line-through tnum">
                  {formatPrice(retailPrice * CAJA_SIZE)}
                </span>
                <span
                  className={cn(
                    'font-headline font-semibold leading-none text-on-surface tnum',
                    density === 'compact' ? 'text-xl' : 'text-2xl',
                  )}
                >
                  {formatPrice(bestWholesale * CAJA_SIZE)}
                </span>
                <span className="text-xs text-on-surface-variant tnum">
                  caja de {CAJA_SIZE} · {formatPrice(bestWholesale)} c/u
                </span>
                <span className="font-label text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-secondary tnum">
                  Ahorras {formatPrice((retailPrice - bestWholesale) * CAJA_SIZE)}
                </span>
              </>
            ) : (
              <>
                <span
                  className={cn(
                    'font-headline font-semibold leading-none text-on-surface tnum',
                    density === 'compact' ? 'text-xl' : 'text-2xl',
                  )}
                >
                  {formatPrice(retailPrice * CAJA_SIZE)}
                </span>
                <span className="text-xs text-on-surface-variant tnum">
                  caja de {CAJA_SIZE} · {formatPrice(retailPrice)} c/u
                </span>
              </>
            )}
          </span>
        )}

        <span
          aria-hidden="true"
          className="h-px w-10 bg-line-strong transition-all duration-[var(--theme-duration-normal)] ease-entrance group-hover:w-20 group-hover:bg-secondary"
        />

        <div
          className={cn(
            'mt-auto flex flex-col',
            density === 'compact' ? 'gap-2 pt-0' : 'gap-3 pt-1',
          )}
        >
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={viewMode === 'wholesale' ? CAJA_SIZE : 1}
            max={viewMode === 'wholesale' ? CAJA_SIZE * 20 : 99}
            step={viewMode === 'wholesale' ? CAJA_SIZE : 1}
            className="self-start"
          />
          <Button
            variant="primary"
            size="md"
            onClick={handleAddToCart}
            aria-label="Agregar al carrito"
            className="w-full"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            Agregar
          </Button>
        </div>

        <Link
          href={detailHref}
          className="group/link inline-flex items-center gap-1.5 self-start font-label text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant transition-colors duration-[var(--theme-duration-fast)] ease-entrance hover:text-secondary"
        >
          Ver ficha completa
          <ArrowRight
            className="h-3 w-3 transition-transform duration-[var(--theme-duration-normal)] ease-entrance group-hover/link:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </Hover>
  )
}
