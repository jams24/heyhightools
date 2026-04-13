"use client";

import { useCart } from "@/components/CartProvider";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, totalNgn, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-neutral-900 mb-2">Your cart is empty</h1>
        <p className="text-sm text-neutral-500 mb-8">Browse our products to get started.</p>
        <Link href="/shop" className="bg-neutral-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2">Review</p>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Cart</h1>
        </div>
        <button onClick={clearCart} className="text-xs text-neutral-400 hover:text-red-500 transition">
          Clear all
        </button>
      </div>

      <div className="space-y-3 mb-8">
        {items.map((item, i) => (
          <div key={item.planId} className={`flex items-center gap-4 bg-white border border-neutral-200 rounded-xl p-4 animate-slide-up stagger-${Math.min(i + 1, 8)}`}>
            <div className="w-14 h-14 bg-neutral-50 rounded-xl flex items-center justify-center shrink-0 border border-neutral-100">
              {item.productImage ? (
                <img src={item.productImage} alt={item.productName} className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-lg font-bold text-neutral-200">{item.productName.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 text-sm truncate">{item.productName}</h3>
              <p className="text-xs text-neutral-400">{item.planLabel}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateQuantity(item.planId, item.quantity - 1)}
                className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition text-xs"
              >
                -
              </button>
              <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.planId, item.quantity + 1)}
                className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition text-xs"
              >
                +
              </button>
            </div>
            <div className="text-right w-24">
              <p className="font-semibold text-neutral-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
              <p className="text-xs text-neutral-400">{"\u20A6"}{(item.priceNgn * item.quantity).toLocaleString()}</p>
              <button
                onClick={() => removeItem(item.planId)}
                className="text-[11px] text-neutral-400 hover:text-red-500 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-neutral-500">Total</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-neutral-900">${total.toFixed(2)}</span>
            <p className="text-sm text-neutral-400">{"\u20A6"}{totalNgn.toLocaleString()}</p>
          </div>
        </div>
        <Link
          href="/checkout"
          className="block w-full bg-neutral-900 text-white text-center py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
