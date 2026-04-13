"use client";

import { useCart } from "@/components/CartProvider";
import { useState } from "react";
import Link from "next/link";

const WHATSAPP_NUMBER = "2347067830318";

export default function CheckoutPage() {
  const { items, total, totalNgn, clearCart } = useCart();
  const [step, setStep] = useState<"method" | "form">("method");
  const [paymentMethod, setPaymentMethod] = useState<"crypto" | "naira" | null>(null);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold mb-3">No items in cart</h1>
        <Link href="/shop" className="text-sm text-neutral-500 hover:text-neutral-900 transition">Go Shopping</Link>
      </div>
    );
  }

  const handleNairaCheckout = () => {
    let message = "Hello, I want to pay in Naira for the following:\n\n";
    items.forEach((item) => {
      message += `Product: ${item.productName}\n`;
      message += `Plan: ${item.planLabel}\n`;
      message += `Price: \u20A6${(item.priceNgn * item.quantity).toLocaleString()}`;
      if (item.quantity > 1) message += ` (x${item.quantity})`;
      message += "\n\n";
    });
    message += `Total: \u20A6${totalNgn.toLocaleString()}\n\n`;
    if (email) message += `Email: ${email}\n`;
    if (whatsapp) message += `WhatsApp: ${whatsapp}\n`;
    message += "\nI agree to the terms and conditions.";

    const url = `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    clearCart();
    window.location.href = url;
  };

  const handleCryptoCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, whatsapp, items, paymentMethod: "crypto" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      const itemsSummary = encodeURIComponent(JSON.stringify(
        items.map((i) => ({ name: i.productName, plan: i.planLabel, price: i.price, qty: i.quantity }))
      ));

      clearCart();

      if (data.invoiceUrl) {
        sessionStorage.setItem("lizzstore-order", JSON.stringify({
          orderId: data.orderId,
          items: itemsSummary,
        }));
        window.location.href = data.invoiceUrl;
      } else {
        window.location.href = `/checkout/success?orderId=${data.orderId}&items=${itemsSummary}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  // Step 1: Choose payment method
  if (step === "method") {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2">Step 1</p>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">How would you like to pay?</h1>
        </div>

        {/* Order Summary */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 mb-8">
          <p className="text-xs uppercase tracking-[0.15em] text-neutral-400 mb-3">Order Summary</p>
          {items.map((item) => (
            <div key={item.planId} className="flex justify-between py-2 border-b border-neutral-200 last:border-0 text-sm">
              <span className="text-neutral-900">{item.productName} <span className="text-neutral-400">({item.planLabel})</span>{item.quantity > 1 ? ` x${item.quantity}` : ""}</span>
            </div>
          ))}
        </div>

        {/* Payment Options */}
        <div className="space-y-3">
          <button
            onClick={() => { setPaymentMethod("crypto"); setStep("form"); }}
            className="w-full bg-white border-2 border-neutral-200 hover:border-neutral-900 rounded-2xl p-5 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76m11.928 9.869A9 9 0 008.965 3.525m11.928 9.868A9 9 0 118.965 3.525" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900">Pay with Crypto</h3>
                <p className="text-xs text-neutral-400 mt-0.5">BTC, ETH, USDT, SOL & more via InventPay</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-neutral-900">${total.toFixed(2)}</p>
                <p className="text-[10px] text-neutral-400">USD</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => { setPaymentMethod("naira"); setStep("form"); }}
            className="w-full bg-white border-2 border-neutral-200 hover:border-green-600 rounded-2xl p-5 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white text-xl font-bold">{"\u20A6"}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900">Pay in Naira</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Bank transfer via WhatsApp</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-neutral-900">{"\u20A6"}{totalNgn.toLocaleString()}</p>
                <p className="text-[10px] text-neutral-400">NGN</p>
              </div>
            </div>
          </button>
        </div>

        <Link href="/cart" className="block text-center text-sm text-neutral-400 hover:text-neutral-900 transition mt-6">
          &larr; Back to Cart
        </Link>
      </div>
    );
  }

  // Step 2: Contact info + pay
  return (
    <div className="max-w-lg mx-auto px-4 py-10 sm:px-6">
      <div className="mb-8">
        <button onClick={() => setStep("method")} className="text-xs text-neutral-400 hover:text-neutral-900 transition mb-3 inline-flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Change payment method
        </button>
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2">Step 2</p>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
          {paymentMethod === "crypto" ? "Crypto Payment" : "Naira Payment"}
        </h1>
      </div>

      {/* Summary */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-neutral-400">{items.length} item{items.length !== 1 ? "s" : ""}</p>
            <p className="font-bold text-neutral-900 text-lg mt-0.5">
              {paymentMethod === "crypto"
                ? `$${total.toFixed(2)} USD`
                : `\u20A6${totalNgn.toLocaleString()} NGN`
              }
            </p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            paymentMethod === "crypto" ? "bg-neutral-900" : "bg-green-600"
          }`}>
            {paymentMethod === "crypto" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76m11.928 9.869A9 9 0 008.965 3.525m11.928 9.868A9 9 0 118.965 3.525" />
              </svg>
            ) : (
              <span className="text-white font-bold">{"\u20A6"}</span>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={paymentMethod === "crypto" ? handleCryptoCheckout : (e) => { e.preventDefault(); handleNairaCheckout(); }} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-[0.15em] text-neutral-400 mb-2 font-medium">
            Email Address {paymentMethod === "crypto" ? "*" : "(optional)"}
          </label>
          <input
            type="email"
            id="email"
            required={paymentMethod === "crypto"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-sm bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-xs uppercase tracking-[0.15em] text-neutral-400 mb-2 font-medium">
            WhatsApp Number {paymentMethod === "naira" ? "*" : "(optional)"}
          </label>
          <input
            type="tel"
            id="whatsapp"
            required={paymentMethod === "naira"}
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full px-4 py-3 text-sm bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition"
            placeholder="+234..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
            paymentMethod === "crypto"
              ? "bg-neutral-900 text-white hover:bg-neutral-800"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </>
          ) : paymentMethod === "crypto" ? (
            `Pay $${total.toFixed(2)} with Crypto`
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Pay {"\u20A6"}{totalNgn.toLocaleString()} via WhatsApp
            </>
          )}
        </button>

        <p className="text-center text-xs text-neutral-400">
          {paymentMethod === "crypto"
            ? "Secure payment via InventPay \u00B7 BTC, ETH, USDT, SOL & more"
            : "You'll be redirected to WhatsApp to complete your order"
          }
        </p>
      </form>
    </div>
  );
}
