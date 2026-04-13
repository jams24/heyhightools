"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  productName: string;
  planLabel: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  email: string;
  whatsapp: string | null;
  total: number;
  status: string;
  paymentId: string | null;
  items: OrderItem[];
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-700",
  failed: "bg-red-100 text-red-700",
  delivered: "bg-blue-100 text-blue-700",
};

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = () => {
    const url = filter ? `/api/orders?status=${filter}` : "/api/orders";
    fetch(url).then((r) => r.json()).then(setOrders).catch(() => setOrders([]));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {/* Filters — scrollable on mobile */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {["", "pending", "paid", "delivered", "expired", "failed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filter === s ? "bg-amber-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`shrink-0 px-2 py-0.5 text-[10px] rounded-full font-medium ${statusColors[order.status] || "bg-gray-100"}`}>
                  {order.status}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{order.email}</p>
                  <p className="text-[11px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="font-bold text-gray-900 text-sm">${order.total.toFixed(2)}</p>
                <p className="text-[11px] text-gray-400">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
              </div>
            </div>

            {expandedId === order.id && (
              <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-3">
                {/* Order details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Order: </span>
                    <span className="font-mono text-[10px] text-gray-600 break-all">{order.id}</span>
                  </div>
                  {order.whatsapp && (
                    <div>
                      <span className="text-gray-400">WhatsApp: </span>
                      <span className="text-gray-600">{order.whatsapp}</span>
                    </div>
                  )}
                  {order.paymentId && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-400">Payment: </span>
                      <span className="font-mono text-[10px] text-gray-600 break-all">{order.paymentId}</span>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-1.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs bg-white rounded-lg px-3 py-2">
                      <div>
                        <span className="text-gray-900 font-medium">{item.productName}</span>
                        <span className="text-gray-400 ml-1">({item.planLabel})</span>
                      </div>
                      <span className="text-gray-600 shrink-0">${item.price.toFixed(2)} {item.quantity > 1 ? `x${item.quantity}` : ""}</span>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {order.status === "paid" && (
                    <button onClick={() => updateStatus(order.id, "delivered")} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700">
                      Mark Delivered
                    </button>
                  )}
                  {order.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(order.id, "paid")} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700">
                        Mark Paid
                      </button>
                      <button onClick={() => updateStatus(order.id, "failed")} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700">
                        Mark Failed
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No orders found.</div>
        )}
      </div>
    </div>
  );
}
