import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, plans: { orderBy: { price: "asc" } } },
  });

  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 sm:px-6">
      <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neutral-500 hover:text-neutral-900 transition mb-6 sm:mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back
      </Link>

      <ProductDetailClient product={{
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        inStock: product.inStock,
        categoryName: product.category.name,
        plans: product.plans.map((p) => ({ id: p.id, label: p.label, price: p.price, priceNgn: p.priceNgn })),
      }} />
    </div>
  );
}
