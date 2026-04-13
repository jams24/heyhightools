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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Orders</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["", "pending", "paid", "delivered", "expired", "failed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === s ? "bg-indigo-600 text-white" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[order.status] || "bg-gray-100"}`}>
                  {order.status}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{order.email}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{order.items.length} item(s)</p>
              </div>
            </div>

            {expandedId === order.id && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Order ID:</span>
                    <span className="ml-2 font-mono text-xs">{order.id}</span>
                  </div>
                  {order.whatsapp && (
                    <div>
                      <span className="text-gray-500">WhatsApp:</span>
                      <span className="ml-2">{order.whatsapp}</span>
                    </div>
                  )}
                  {order.paymentId && (
                    <div>
                      <span className="text-gray-500">Payment ID:</span>
                      <span className="ml-2 font-mono text-xs">{order.paymentId}</span>
                    </div>
                  )}
                </div>

                <table className="w-full text-sm mb-4">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Product</th>
                      <th className="text-left py-2">Plan</th>
                      <th className="text-right py-2">Price</th>
                      <th className="text-right py-2">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2">{item.productName}</td>
                        <td className="py-2">{item.planLabel}</td>
                        <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                        <td className="py-2 text-right">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex gap-2">
                  {order.status === "paid" && (
                    <button
                      onClick={() => updateStatus(order.id, "delivered")}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(order.id, "paid")}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700"
                      >
                        Mark Paid
                      </button>
                      <button
                        onClick={() => updateStatus(order.id, "failed")}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700"
                      >
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
          <div className="text-center py-8 text-gray-500">No orders found.</div>
        )}
      </div>
    </div>
  );
}
