"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  productId: string;
  productName: string;
  productImage?: string;
  planId: string;
  planLabel: string;
  price: number;
  priceNgn: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (planId: string) => void;
  updateQuantity: (planId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  totalNgn: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("lizzstore-cart");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("lizzstore-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.planId === item.planId);
      if (existing) {
        return prev.map((i) =>
          i.planId === item.planId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (planId: string) => {
    setItems((prev) => prev.filter((i) => i.planId !== planId));
  };

  const updateQuantity = (planId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(planId);
    setItems((prev) =>
      prev.map((i) => (i.planId === planId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalNgn = items.reduce((sum, i) => sum + i.priceNgn * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, totalNgn, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
