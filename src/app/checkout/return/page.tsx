"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentReturnPage() {
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("lizzstore-order");
    if (stored) {
      const { orderId, items } = JSON.parse(stored);
      sessionStorage.removeItem("lizzstore-order");
      router.replace(`/checkout/success?orderId=${orderId}&items=${items}`);
    } else {
      router.replace("/checkout/success");
    }
  }, [router]);

  return (
    <div className="text-center py-20 text-sm text-neutral-400">
      Redirecting...
    </div>
  );
}
