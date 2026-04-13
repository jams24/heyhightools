import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const where: Record<string, unknown> = {};
  if (params.category) where.categoryId = params.category;
  if (params.search) {
    where.name = { contains: params.search, mode: "insensitive" };
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true, plans: { orderBy: { price: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  const activeCategory = categories.find((c) => c.id === params.category);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-neutral-400 mb-1">
          {activeCategory ? activeCategory.name : "All Products"}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">Shop</h1>
      </div>

      {/* Mobile category pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 lg:hidden scrollbar-hide -mx-4 px-4">
        <Link
          href="/shop"
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
            !params.category ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200 text-neutral-600"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.id}`}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              params.category === cat.id ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200 text-neutral-600"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-52 shrink-0">
          <div className="sticky top-24 space-y-6">
            <form>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  name="search"
                  placeholder="Search..."
                  defaultValue={params.search}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition"
                />
              </div>
            </form>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-3 font-medium">Categories</p>
              <div className="space-y-0.5">
                <Link
                  href="/shop"
                  className={`block px-3 py-2 rounded-lg text-sm transition ${
                    !params.category ? "bg-neutral-900 text-white font-medium" : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  All
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.id}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition ${
                      params.category === cat.id ? "bg-neutral-900 text-white font-medium" : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <p className="text-neutral-400 text-sm">No products found.</p>
              <Link href="/shop" className="text-neutral-900 text-sm font-medium hover:underline mt-2 inline-block">
                Clear filters
              </Link>
            </div>
          ) : (
            <>
              <p className="text-[10px] sm:text-xs text-neutral-400 mb-3 sm:mb-4">{products.length} product{products.length !== 1 ? "s" : ""}</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {products.map((product, i) => (
                  <div key={product.id} className={`animate-slide-up stagger-${Math.min(i + 1, 8)}`}>
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      image={product.image}
                      category={product.category.name}
                      startingPrice={product.plans[0]?.price ?? 0}
                      startingPriceNgn={product.plans[0]?.priceNgn ?? 0}
                      inStock={product.inStock}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
