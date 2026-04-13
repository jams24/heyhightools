import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const categoryIcons: Record<string, string> = {
  "AI Assistants": "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z",
  "Creative Tools": "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
  "Productivity": "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  "Streaming": "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z",
};

export default async function HomePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true, plans: { orderBy: { price: "asc" } } },
    take: 8,
  });

  const allProducts = featuredProducts.length > 0
    ? featuredProducts
    : await prisma.product.findMany({
        include: { category: true, plans: { orderBy: { price: "asc" } } },
        take: 8,
        orderBy: { createdAt: "desc" },
      });

  return (
    <div>
      {/* Hero */}
      <section className="bg-neutral-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 lg:py-28 sm:px-6 relative">
          <div className="max-w-xl">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-neutral-400 mb-3 animate-fade-in">Premium Digital Subscriptions</p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4 sm:mb-6 animate-slide-up">
              Tools that power<br />your workflow.
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 mb-8 animate-slide-up stagger-2 max-w-md leading-relaxed">
              Access top-tier AI, creative, and productivity tools. Pay securely with cryptocurrency.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 animate-slide-up stagger-3">
              <Link
                href="/shop"
                className="bg-white text-neutral-900 px-6 py-3 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-all btn-press text-center"
              >
                Browse Shop
              </Link>
              <Link
                href="/shop"
                className="border border-neutral-700 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/5 transition-all btn-press text-center"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12 sm:py-20 sm:px-6">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2">Browse by</p>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-6 sm:mb-8">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className={`group bg-white border border-neutral-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-neutral-300 hover:shadow-md transition-all duration-300 animate-slide-up stagger-${i + 1}`}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neutral-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-neutral-900 group-hover:text-white transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcons[cat.name] || "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"} />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-900 text-xs sm:text-sm">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      {allProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-12 sm:pb-20 sm:px-6">
          <div className="flex justify-between items-end mb-6 sm:mb-8">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2">
                {featuredProducts.length > 0 ? "Handpicked" : "Latest"}
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                {featuredProducts.length > 0 ? "Featured" : "Products"}
              </h2>
            </div>
            <Link href="/shop" className="text-xs sm:text-sm text-neutral-500 hover:text-neutral-900 transition font-medium">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {allProducts.map((product, i) => (
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
        </section>
      )}

      {/* Trust bar */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", title: "Instant Delivery", desc: "Get access within minutes" },
              { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", title: "Secure Payments", desc: "Encrypted crypto transactions" },
              { icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155", title: "WhatsApp Support", desc: "Direct support channel" },
            ].map((item) => (
              <div key={item.title} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-0">
                <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center shrink-0 sm:mx-auto sm:mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
