"use client";

import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  image?: string | null;
  category: string;
  startingPrice: number;
  startingPriceNgn: number;
  inStock: boolean;
}

export default function ProductCard({
  id,
  name,
  image,
  category,
  startingPrice,
  startingPriceNgn,
  inStock,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/shop/${id}`}>
      <div className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all duration-500 ease-out">
        <div className="aspect-[4/3] bg-neutral-50 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
          {image && !imgError ? (
            <img
              src={image}
              alt={name}
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain product-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="text-4xl sm:text-5xl font-bold text-neutral-200 select-none">
              {name.charAt(0)}
            </div>
          )}

          {!inStock && (
            <div className="absolute top-2.5 left-2.5 bg-neutral-900 text-white text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full font-medium">
              Sold out
            </div>
          )}

          <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/[0.02] transition-colors duration-500" />
        </div>
        <div className="p-3 sm:p-4 space-y-1">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-neutral-400 font-medium">{category}</p>
          <h3 className="font-semibold text-neutral-900 text-sm leading-snug">{name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-neutral-900 font-semibold text-sm">${startingPrice.toFixed(2)}</p>
            <span className="text-neutral-300">|</span>
            <p className="text-neutral-500 font-medium text-sm">{"\u20A6"}{startingPriceNgn.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
