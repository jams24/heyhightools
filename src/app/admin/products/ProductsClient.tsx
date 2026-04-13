"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  inStock: boolean;
  featured: boolean;
  category: { name: string };
  plans: { label: string; price: number; priceNgn: number }[];
}

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    categoryId: "",
    inStock: true,
    featured: false,
    plans: [{ label: "", price: 0, priceNgn: 0 }],
  });

  const loadData = () => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validPlans = form.plans.filter((p) => p.label && p.price > 0);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, plans: validPlans }),
    });
    setForm({ name: "", description: "", image: "", categoryId: "", inStock: true, featured: false, plans: [{ label: "", price: 0, priceNgn: 0 }] });
    setShowForm(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="">Select category</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="rounded" />
              <span className="text-sm">In Stock</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
              <span className="text-sm">Featured</span>
            </label>
          </div>

          {/* Plans with dual pricing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Plans</label>
            {form.plans.map((plan, i) => (
              <div key={i} className="flex gap-2 mb-2 flex-wrap sm:flex-nowrap">
                <input
                  placeholder="e.g. 1 Month"
                  value={plan.label}
                  onChange={(e) => {
                    const plans = [...form.plans];
                    plans[i] = { ...plans[i], label: e.target.value };
                    setForm({ ...form, plans });
                  }}
                  className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="USD"
                  value={plan.price || ""}
                  onChange={(e) => {
                    const plans = [...form.plans];
                    plans[i] = { ...plans[i], price: parseFloat(e.target.value) || 0 };
                    setForm({ ...form, plans });
                  }}
                  className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <input
                  type="number"
                  step="1"
                  placeholder="NGN"
                  value={plan.priceNgn || ""}
                  onChange={(e) => {
                    const plans = [...form.plans];
                    plans[i] = { ...plans[i], priceNgn: parseFloat(e.target.value) || 0 };
                    setForm({ ...form, plans });
                  }}
                  className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {form.plans.length > 1 && (
                  <button type="button" onClick={() => setForm({ ...form, plans: form.plans.filter((_, j) => j !== i) })} className="text-red-500 hover:text-red-700 px-2">×</button>
                )}
              </div>
            ))}
            <p className="text-xs text-gray-400 mb-2">Set both USD and NGN (₦) prices for each plan</p>
            <button type="button" onClick={() => setForm({ ...form, plans: [...form.plans, { label: "", price: 0, priceNgn: 0 }] })} className="text-sm text-indigo-600 hover:text-indigo-700">
              + Add Plan
            </button>
          </div>

          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
            Create Product
          </button>
        </form>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price (USD)</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price (NGN)</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{product.name}</div>
                  {product.featured && <span className="text-xs text-indigo-600">Featured</span>}
                </td>
                <td className="px-6 py-4 text-gray-500">{product.category.name}</td>
                <td className="px-6 py-4 text-gray-500">
                  {product.plans.length > 0
                    ? `$${product.plans[0].price.toFixed(2)}${product.plans.length > 1 ? ` - $${product.plans[product.plans.length - 1].price.toFixed(2)}` : ""}`
                    : "—"}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {product.plans.length > 0
                    ? `₦${product.plans[0].priceNgn.toLocaleString()}${product.plans.length > 1 ? ` - ₦${product.plans[product.plans.length - 1].priceNgn.toLocaleString()}` : ""}`
                    : "—"}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/admin/products/${product.id}`} className="text-indigo-600 hover:text-indigo-700 text-sm">Edit</Link>
                  <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
