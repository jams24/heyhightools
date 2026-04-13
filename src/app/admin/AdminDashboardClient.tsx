"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ]).then(([products, orders]) => {
      const paidOrders = orders.filter?.((o: { status: string }) => o.status === "paid") ?? [];
      const pendingOrders = orders.filter?.((o: { status: string }) => o.status === "pending") ?? [];
      setStats({
        totalProducts: products.length ?? 0,
        totalOrders: orders.length ?? 0,
        totalRevenue: paidOrders.reduce((sum: number, o: { total: number }) => sum + o.total, 0),
        pendingOrders: pendingOrders.length,
      });
    }).catch(() => {
      setStats({ totalProducts: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
    });
  }, []);

  const statCards = [
    { label: "Products", value: stats?.totalProducts ?? "...", color: "bg-blue-500", icon: "📦" },
    { label: "Orders", value: stats?.totalOrders ?? "...", color: "bg-green-500", icon: "📋" },
    { label: "Revenue", value: stats ? `$${stats.totalRevenue.toFixed(2)}` : "...", color: "bg-purple-500", icon: "💰" },
    { label: "Pending", value: stats?.pendingOrders ?? "...", color: "bg-orange-500", icon: "⏳" },
  ];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
