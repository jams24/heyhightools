"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { useState } from "react";

export default function Navbar() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen(!open);
  }

  function close() {
    setOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="text-xl font-bold tracking-tight text-neutral-900" onClick={close}>
            HeyHighToolz
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-all">
              Home
            </Link>
            <Link href="/shop" className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-all">
              Shop
            </Link>
            <Link href="/cart" className="relative ml-2 p-2.5 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-neutral-900 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={toggle}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg active:bg-neutral-100"
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="5" x2="17" y2="5" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="15" x2="17" y2="15" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu — inside nav, always in DOM, toggled with display */}
      <div className={`md:hidden ${open ? "block" : "hidden"}`}>
        <div className="border-t border-neutral-100 bg-white px-4 py-3 space-y-1">
          <Link href="/" onClick={close} className="block px-4 py-3 text-neutral-900 font-medium rounded-xl hover:bg-neutral-50 active:bg-neutral-100">
            Home
          </Link>
          <Link href="/shop" onClick={close} className="block px-4 py-3 text-neutral-900 font-medium rounded-xl hover:bg-neutral-50 active:bg-neutral-100">
            Shop
          </Link>
          <Link href="/cart" onClick={close} className="flex items-center justify-between px-4 py-3 text-neutral-900 font-medium rounded-xl hover:bg-neutral-50 active:bg-neutral-100">
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="bg-neutral-900 text-white text-xs min-w-[22px] h-[22px] rounded-full flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
