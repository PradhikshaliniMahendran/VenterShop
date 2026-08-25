'use client';

import React, { useEffect, useState } from 'react';
import { Layers, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formValues, setFormValues] = useState({
    name: '',
    slug: '',
    icon: 'Layers',
    displayOrder: '0',
    isActive: true,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error('Failed to load categories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormValues((prev) => ({ ...prev, [name]: val }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormValues((prev) => ({ ...prev, name, slug }));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    const payload = {
      categoryId: editingId,
      ...formValues,
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormOpen(false);
        resetForm();
        loadCategories();
      } else {
        const data = await res.json();
        setFormError(data.error || 'Failed to save category');
      }
    } catch (err) {
      setFormError('Network error. Failed to save category.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadCategories();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete category');
      }
    } catch (e) {
      alert('Error deleting category');
    }
  };

  const handleOpenEdit = (cat: ICategory) => {
    setEditingId(cat._id);
    setFormValues({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      displayOrder: cat.displayOrder.toString(),
      isActive: cat.isActive,
    });
    setFormOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormValues({
      name: '',
      slug: '',
      icon: 'Layers',
      displayOrder: '0',
      isActive: true,
    });
    setFormError(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/4" />
        <div className="h-48 bg-white rounded-xl border border-gray-150 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-xs font-semibold">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-150 pb-4">
        <h1 className="text-xl font-black text-[#101A2D] tracking-tight uppercase flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#E53935]" />
          Categories Catalog Administration
        </h1>
        
        {!formOpen && (
          <button
            onClick={() => {
              resetForm();
              setFormOpen(true);
            }}
            className="flex items-center gap-1.5 py-1.5 px-4 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* Form overlay */}
      {formOpen && (
        <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs max-w-xl space-y-6">
          <h3 className="font-extrabold text-sm text-[#101A2D] uppercase border-b border-gray-100 pb-2">
            {editingId ? 'Edit Category Details' : 'Create New Category'}
          </h3>

          {formError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 text-xs font-bold">
              ⚠️ {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            {/* Name */}
            <div className="space-y-1.5">
              <label>Category Name *</label>
              <input
                type="text"
                required
                value={formValues.name}
                onChange={handleNameChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-lg outline-none"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label>Slug URL *</label>
              <input
                type="text"
                required
                value={formValues.slug}
                onChange={handleInputChange}
                name="slug"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-255 rounded-lg outline-none"
              />
            </div>

            {/* Icon */}
            <div className="space-y-1.5">
              <label>Icon Identifier Code</label>
              <input
                type="text"
                value={formValues.icon}
                onChange={handleInputChange}
                name="icon"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-255 rounded-lg outline-none"
              />
              <span className="text-[10px] text-gray-400 block pt-0.5">Use identifiers such as Home, Groceries, DailyNeeds, Books, Electronics.</span>
            </div>

            {/* Display Order */}
            <div className="space-y-1.5">
              <label>Display Sorting Order</label>
              <input
                type="number"
                value={formValues.displayOrder}
                onChange={handleInputChange}
                name="displayOrder"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-255 rounded-lg outline-none"
              />
            </div>

            {/* Status check */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isActive"
                checked={formValues.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 accent-[#1A2A4A]"
              />
              <span>Active Category Listing</span>
            </label>

            {/* Form Actions */}
            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
                className="py-2 px-5 border border-gray-200 hover:bg-gray-50 rounded-lg font-bold text-gray-600"
                disabled={formSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-5 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg font-bold shadow-xs transition-colors"
                disabled={formSubmitting}
              >
                {formSubmitting ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid list Table */}
      {!formOpen && (
        <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-gray-100 text-gray-500 uppercase font-bold border-b border-gray-150">
                <th className="p-4">Category Name</th>
                <th className="p-4">Slug Code</th>
                <th className="p-4">Icon Identifier</th>
                <th className="p-4">Sort Order</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-[#101A2D]">{cat.name}</td>
                  <td className="p-4 text-gray-500 font-mono">{cat.slug}</td>
                  <td className="p-4 text-gray-400">{cat.icon}</td>
                  <td className="p-4 text-gray-500">{cat.displayOrder}</td>
                  <td className="p-4">
                    {cat.isActive ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-sm font-extrabold flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Active
                      </span>
                    ) : (
                      <span className="bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-sm font-extrabold flex items-center gap-1 w-fit">
                        <XCircle className="w-3.5 h-3.5" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-gray-400 hover:text-black rounded-md hover:bg-gray-100 transition-colors inline-flex items-center"
                      title="Edit Category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="p-1.5 text-gray-400 hover:text-red-650 rounded-md hover:bg-red-50 transition-colors inline-flex items-center"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
