import { ProductDetailView } from "@/components/product/ProductDetailView";
import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/serialize";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = serializeDecimal(
    await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: {
          select: {
            retailImageUrl: true,
            wholesaleImageUrl: true,
          },
          take: 1,
        },
      },
    }),
  );

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  const metadataImage = product.variants[0]?.retailImageUrl || product.imageUrl || undefined;

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: metadataImage ? [metadataImage] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = serializeDecimal(
    await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        variants: {
          include: { wholesaleTiers: true },
          orderBy: { price: "asc" },
        },
      },
    }),
  );

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
