"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { usePathname } from "next/navigation";

export default function MobileCartBar() {
  const { itemCount, total, totalNgn } = useCart();
  const pathname = usePathname();

  if (itemCount === 0) return null;
  if (pathname.startsWith("/cart")) return null;
  if (pathname.startsWith("/checkout")) return null;
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden animate-slide-up">
      <div className="bg-neutral-900 mx-3 mb-3 rounded-2xl shadow-2xl">
        <Link
          href="/cart"
          className="flex items-center justify-between px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <span className="bg-white text-neutral-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
            <span className="text-white text-sm font-semibold">View Cart</span>
          </div>
          <div className="text-right">
            <span className="text-white text-sm font-bold">${total.toFixed(2)}</span>
            <span className="text-neutral-400 text-xs ml-1.5">{"\u20A6"}{totalNgn.toLocaleString()}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
