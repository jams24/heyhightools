"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/Toast";

interface Plan {
  id: string;
  label: string;
  price: number;
  priceNgn: number;
}

interface ProductProps {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  inStock: boolean;
  categoryName: string;
  plans: Plan[];
}

export default function ProductDetailClient({ product }: { product: ProductProps }) {
  const { addItem, itemCount } = useCart();
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(product.plans[0]);
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    if (!selectedPlan || !product.inStock) return;
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.image ?? undefined,
      planId: selectedPlan.id,
      planLabel: selectedPlan.label,
      price: selectedPlan.price,
      priceNgn: selectedPlan.priceNgn,
    });
    showToast(`${product.name} added to cart`);
    setJustAdded(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Image */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center justify-center p-12 sm:p-16 aspect-[4/3] lg:aspect-square">
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-6xl sm:text-7xl font-bold text-neutral-200 select-none">{product.name.charAt(0)}</div>
        )}
      </div>

      {/* Details */}
      <div>
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-neutral-400 mb-1.5">{product.categoryName}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mb-3 sm:mb-4">{product.name}</h1>

        {product.description && (
          <p className="text-neutral-500 text-sm leading-relaxed mb-6 sm:mb-8">{product.description}</p>
        )}

        {!product.inStock && (
          <div className="bg-neutral-100 text-neutral-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            Currently out of stock
          </div>
        )}

        {/* Plan Selection */}
        {product.plans.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-neutral-400 mb-3">Select Plan</p>
            <div className="space-y-2">
              {product.plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full flex justify-between items-center px-4 py-3 sm:px-5 sm:py-4 border-2 rounded-xl transition-all duration-200 ${
                    selectedPlan?.id === plan.id
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <span className="font-medium text-sm text-neutral-900">{plan.label}</span>
                  <div className="text-right">
                    <span className="font-bold text-sm text-neutral-900">${plan.price.toFixed(2)}</span>
                    <span className="text-neutral-400 text-xs ml-2">{"\u20A6"}{plan.priceNgn.toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart */}
        {selectedPlan && (
          <div className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900">${selectedPlan.price.toFixed(2)}</span>
              <span className="text-neutral-400 text-sm">{"\u20A6"}{selectedPlan.priceNgn.toLocaleString()}</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-3.5 sm:py-4 px-6 rounded-xl font-semibold text-sm transition-all ${
                product.inStock
                  ? "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>

            {justAdded && itemCount > 0 && (
              <Link
                href="/cart"
                className="w-full py-3.5 sm:py-4 px-6 rounded-xl font-semibold text-sm text-center border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all block animate-slide-up"
              >
                View Cart ({itemCount})
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
