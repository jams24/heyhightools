"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  categoryId: string;
  inStock: boolean;
  featured: boolean;
  plans: { id: string; label: string; price: number; priceNgn: number }[];
}

export default function EditProductClient() {
  const params = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    categoryId: "",
    inStock: true,
    featured: false,
    plans: [{ label: "", price: 0, priceNgn: 0 }] as { label: string; price: number; priceNgn: number }[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${params.id}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([product, cats]: [Product, { id: string; name: string }[]]) => {
      setForm({
        name: product.name,
        description: product.description || "",
        image: product.image || "",
        categoryId: product.categoryId,
        inStock: product.inStock,
        featured: product.featured,
        plans: product.plans.length > 0
          ? product.plans.map((p) => ({ label: p.label, price: p.price, priceNgn: p.priceNgn }))
          : [{ label: "", price: 0, priceNgn: 0 }],
      });
      setCategories(cats);
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validPlans = form.plans.filter((p) => p.label && p.price > 0);
    await fetch(`/api/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, plans: validPlans }),
    });
    router.push("/admin/products");
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Product</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm max-w-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
            <span className="text-sm">In Stock</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            <span className="text-sm">Featured</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Plans</label>
          {form.plans.map((plan, i) => (
            <div key={i} className="flex gap-2 mb-2 flex-wrap sm:flex-nowrap">
              <input
                placeholder="Label"
                value={plan.label}
                onChange={(e) => { const plans = [...form.plans]; plans[i] = { ...plans[i], label: e.target.value }; setForm({ ...form, plans }); }}
                className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg outline-none"
              />
              <input
                type="number" step="0.01" placeholder="USD"
                value={plan.price || ""}
                onChange={(e) => { const plans = [...form.plans]; plans[i] = { ...plans[i], price: parseFloat(e.target.value) || 0 }; setForm({ ...form, plans }); }}
                className="w-28 px-3 py-2 border border-gray-300 rounded-lg outline-none"
              />
              <input
                type="number" step="1" placeholder="NGN"
                value={plan.priceNgn || ""}
                onChange={(e) => { const plans = [...form.plans]; plans[i] = { ...plans[i], priceNgn: parseFloat(e.target.value) || 0 }; setForm({ ...form, plans }); }}
                className="w-28 px-3 py-2 border border-gray-300 rounded-lg outline-none"
              />
              {form.plans.length > 1 && (
                <button type="button" onClick={() => setForm({ ...form, plans: form.plans.filter((_, j) => j !== i) })} className="text-red-500 px-2">×</button>
              )}
            </div>
          ))}
          <p className="text-xs text-gray-400 mb-2">Set both USD and NGN (₦) prices for each plan</p>
          <button type="button" onClick={() => setForm({ ...form, plans: [...form.plans, { label: "", price: 0, priceNgn: 0 }] })} className="text-sm text-indigo-600">+ Add Plan</button>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Save Changes</button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}
