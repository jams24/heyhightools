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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-amber-700 transition text-sm font-medium"
        >
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm">
                <option value="">Select</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="https://..." />
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Plans</label>
            {form.plans.map((plan, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  placeholder="e.g. 1 Month"
                  value={plan.label}
                  onChange={(e) => { const plans = [...form.plans]; plans[i] = { ...plans[i], label: e.target.value }; setForm({ ...form, plans }); }}
                  className="col-span-3 sm:col-span-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                />
                <input
                  type="number" step="0.01" placeholder="USD"
                  value={plan.price || ""}
                  onChange={(e) => { const plans = [...form.plans]; plans[i] = { ...plans[i], price: parseFloat(e.target.value) || 0 }; setForm({ ...form, plans }); }}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="number" step="1" placeholder="NGN"
                    value={plan.priceNgn || ""}
                    onChange={(e) => { const plans = [...form.plans]; plans[i] = { ...plans[i], priceNgn: parseFloat(e.target.value) || 0 }; setForm({ ...form, plans }); }}
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  />
                  {form.plans.length > 1 && (
                    <button type="button" onClick={() => setForm({ ...form, plans: form.plans.filter((_, j) => j !== i) })} className="text-red-500 px-2 text-lg">×</button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setForm({ ...form, plans: [...form.plans, { label: "", price: 0, priceNgn: 0 }] })} className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              + Add Plan
            </button>
          </div>

          <button type="submit" className="w-full sm:w-auto bg-amber-600 text-white px-6 py-2.5 rounded-lg hover:bg-amber-700 transition text-sm font-medium">
            Create Product
          </button>
        </form>
      )}

      {/* Product cards (mobile) / table (desktop) */}
      <div className="space-y-3 lg:hidden">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.category.name}</p>
              </div>
              <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {product.inStock ? "In Stock" : "Out"}
              </span>
            </div>
            {product.plans.length > 0 && (
              <div className="text-xs text-gray-500 mb-3">
                ${product.plans[0].price.toFixed(2)} / ₦{product.plans[0].priceNgn.toLocaleString()}
                {product.featured && <span className="ml-2 text-amber-600 font-medium">Featured</span>}
              </div>
            )}
            <div className="flex gap-3 border-t border-gray-100 pt-3">
              <Link href={`/admin/products/${product.id}`} className="text-amber-600 text-sm font-medium">Edit</Link>
              <button onClick={() => handleDelete(product.id)} className="text-red-500 text-sm font-medium">Delete</button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">No products yet.</div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
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
                  <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                  {product.featured && <span className="text-xs text-amber-600">Featured</span>}
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{product.category.name}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {product.plans.length > 0 ? `$${product.plans[0].price.toFixed(2)}${product.plans.length > 1 ? ` - $${product.plans[product.plans.length - 1].price.toFixed(2)}` : ""}` : "—"}
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {product.plans.length > 0 ? `₦${product.plans[0].priceNgn.toLocaleString()}${product.plans.length > 1 ? ` - ₦${product.plans[product.plans.length - 1].priceNgn.toLocaleString()}` : ""}` : "—"}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/admin/products/${product.id}`} className="text-amber-600 hover:text-amber-700 text-sm">Edit</Link>
                  <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
