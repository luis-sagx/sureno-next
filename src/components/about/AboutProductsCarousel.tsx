'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface AboutProduct {
  src: string
  label: string
}

interface AboutProductsCarouselProps {
  products: AboutProduct[]
}

export function AboutProductsCarousel({ products }: AboutProductsCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEdges = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    setAtStart(track.scrollLeft <= 1)
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    updateEdges()
    track.addEventListener('scroll', updateEdges, { passive: true })
    const resizeObserver = new ResizeObserver(updateEdges)
    resizeObserver.observe(track)

    return () => {
      track.removeEventListener('scroll', updateEdges)
      resizeObserver.disconnect()
    }
  }, [updateEdges])

  const move = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return

    const firstCard = track.firstElementChild as HTMLElement | null
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
    const distance = firstCard
      ? firstCard.getBoundingClientRect().width + gap
      : track.clientWidth * 0.8
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    track.scrollBy({
      left: direction * distance,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      move(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      move(1)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          aria-label="Ver productos anteriores"
          onClick={() => move(-1)}
          disabled={atStart}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-on-surface transition-colors hover:border-secondary hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary disabled:pointer-events-none disabled:opacity-35"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Ver más productos"
          onClick={() => move(1)}
          disabled={atEnd}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-on-surface transition-colors hover:border-secondary hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary disabled:pointer-events-none disabled:opacity-35"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label="Productos de Sureño"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
      >
        <ul
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden motion-reduce:scroll-auto"
        >
          {products.map((product) => (
            <li
              key={product.src}
              className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[27%] xl:w-[22%]"
            >
              <figure className="group flex flex-col items-center gap-4">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={product.src}
                    alt={product.label}
                    fill
                    sizes="(max-width: 640px) 72vw, (max-width: 1024px) 42vw, 27vw"
                    className="object-contain p-3 transition-transform duration-[var(--theme-duration-slow)] ease-entrance group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                </div>
                <figcaption className="text-center font-label text-[0.6875rem] uppercase tracking-[0.18em] text-on-surface-variant">
                  {product.label}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
