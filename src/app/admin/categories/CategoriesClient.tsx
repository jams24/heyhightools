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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Categories</h1>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="flex gap-3 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name..."
          className="flex-1 max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          Add Category
        </button>
      </form>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Products</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {editingId === cat.id ? (
                    <div className="flex gap-2">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 border rounded-lg outline-none"
                        autoFocus
                      />
                      <button onClick={() => handleUpdate(cat.id)} className="text-green-600 text-sm">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500 text-sm">Cancel</button>
                    </div>
                  ) : (
                    <span className="font-medium text-gray-900">{cat.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-500">{cat._count.products}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No categories yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
