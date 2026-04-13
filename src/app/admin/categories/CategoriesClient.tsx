"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  image: string | null;
  _count: { products: number };
}

export default function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const load = () => fetch("/api/categories").then((r) => r.json()).then(setCategories);
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    setName("");
    load();
  };

  const handleUpdate = async (id: string) => {
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    setEditingId(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to delete");
      return;
    }
    load();
  };

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Categories</h1>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category..."
          className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
        />
        <button type="submit" className="bg-amber-600 text-white px-4 py-2.5 rounded-lg hover:bg-amber-700 transition text-sm font-medium shrink-0">
          Add
        </button>
      </form>

      {/* Category cards */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            {editingId === cat.id ? (
              <div className="flex gap-2">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-amber-500"
                  autoFocus
                />
                <button onClick={() => handleUpdate(cat.id)} className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium">Save</button>
                <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-xs font-medium">Cancel</button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{cat._count.products} product{cat._count.products !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                    className="text-amber-600 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-500 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No categories yet.</div>
        )}
      </div>
    </div>
  );
}
