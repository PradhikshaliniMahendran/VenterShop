'use client';

import React, { useEffect, useState } from 'react';
import { Package, Plus, Search, Edit, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

interface ICategory {
  _id: string;
  name: string;
}

interface IProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  images: string[];
  retailPrice: number;
  communityPrice: number;
  wholesalePrice: number;
  stock: number;
  lowStockThreshold: number;
  wholesaleMinQty?: number;
  categoryId: ICategory;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  bulkPricing?: { minQty: number; discountPercent: number }[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formValues, setFormValues] = useState({
    name: '',
    slug: '',
    sku: '',
    description: '',
    shortDescription: '',
    imagesStr: '', // comma separated values
    retailPrice: '',
    communityPrice: '',
    wholesalePrice: '',
    stock: '',
    lowStockThreshold: '5',
    wholesaleMinQty: '1',
    categoryId: '',
    isActive: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
  });

  // Bulk Pricing Tiers List
  const [bulkPricing, setBulkPricing] = useState<{ minQty: number; discountPercent: number }[]>([]);
  const [newTier, setNewTier] = useState({ minQty: '', discountPercent: '' });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // 1. Fetch products & categories list
  const loadData = async () => {
    try {
      const prodRes = await fetch('/api/admin/products');
      const catRes = await fetch('/api/categories');
      if (prodRes.ok && catRes.ok) {
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        setProducts(prodData.products || []);
        setCategories(catData.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormValues((prev) => ({ ...prev, [name]: val }));
  };

  // Generate slug dynamically from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormValues((prev) => ({ ...prev, name, slug }));
  };

  // 2. Add / Edit Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    const images = formValues.imagesStr
      .split(',')
      .map((img) => img.trim())
      .filter((img) => img.length > 0);

    const payload = {
      productId: editingId,
      ...formValues,
      images,
      bulkPricing,
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormOpen(false);
        resetForm();
        loadData();
      } else {
        const data = await res.json();
        setFormError(data.error || 'Failed to save product details');
      }
    } catch (err) {
      setFormError('Network error. Failed to save product.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // 3. Delete Product Handler
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      } else {
        alert('Failed to delete product');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenEdit = (prod: IProduct) => {
    setEditingId(prod._id);
    setFormValues({
      name: prod.name,
      slug: prod.slug,
      sku: prod.sku,
      description: prod.description,
      shortDescription: prod.shortDescription || '',
      imagesStr: prod.images.join(', '),
      retailPrice: prod.retailPrice.toString(),
      communityPrice: prod.communityPrice.toString(),
      wholesalePrice: prod.wholesalePrice.toString(),
      stock: prod.stock.toString(),
      lowStockThreshold: prod.lowStockThreshold.toString(),
      wholesaleMinQty: (prod.wholesaleMinQty ?? 1).toString(),
      categoryId: prod.categoryId._id,
      isActive: prod.isActive,
      isFeatured: prod.isFeatured,
      isBestSeller: prod.isBestSeller,
      isNewArrival: prod.isNewArrival,
    });
    setBulkPricing(prod.bulkPricing || []);
    setFormOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormValues({
      name: '',
      slug: '',
      sku: '',
      description: '',
      shortDescription: '',
      imagesStr: '',
      retailPrice: '',
      communityPrice: '',
      wholesalePrice: '',
      stock: '',
      lowStockThreshold: '5',
      wholesaleMinQty: '1',
      categoryId: categories[0]?._id || '',
      isActive: true,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
    });
    setBulkPricing([]);
    setNewTier({ minQty: '', discountPercent: '' });
    setFormError(null);
  };

  // Bulk Pricing helpers
  const handleAddTier = () => {
    const minQty = parseInt(newTier.minQty);
    const discountPercent = parseFloat(newTier.discountPercent);
    if (!minQty || isNaN(discountPercent)) return;
    
    setBulkPricing([...bulkPricing, { minQty, discountPercent }].sort((a, b) => a.minQty - b.minQty));
    setNewTier({ minQty: '', discountPercent: '' });
  };

  const handleRemoveTier = (idx: number) => {
    setBulkPricing(bulkPricing.filter((_, i) => i !== idx));
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Package className="w-5 h-5 text-[#E53935]" />
          Products Catalog Administration
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
            <span>Add Product</span>
          </button>
        )}
      </div>

      {/* 1. ADD / EDIT PRODUCT OVERLAY FORM */}
      {formOpen && (
        <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="font-extrabold text-sm text-[#101A2D] uppercase border-b border-gray-100 pb-2">
            {editingId ? 'Edit Product Details' : 'Create New Product'}
          </h3>

          {formError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 text-xs font-bold">
              ⚠️ {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Left Column: Core Fields */}
            <div className="space-y-4 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[#101A2D] font-bold block mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formValues.name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-lg outline-none text-gray-900 font-bold"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Slug URL *</label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formValues.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-lg outline-none text-gray-900 font-bold"
                />
              </div>

              {/* SKU */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">SKU Code *</label>
                <input
                  type="text"
                  name="sku"
                  required
                  placeholder="e.g. VS-GRO-RIC"
                  value={formValues.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-lg outline-none text-gray-900 font-bold"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Category *</label>
                <select
                  name="categoryId"
                  required
                  value={formValues.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-lg outline-none cursor-pointer text-gray-900 font-bold"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Device File Upload Picker */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-gray-700 font-bold block">Product Images (Upload from Device) *</label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer flex items-center gap-2 py-2.5 px-4 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg font-bold text-xs shadow-xs transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Choose Files from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach((file) => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (reader.result) {
                              const base64Str = reader.result as string;
                              setFormValues((prev) => {
                                const currentList = prev.imagesStr
                                  ? prev.imagesStr.split(',').map((s) => s.trim()).filter(Boolean)
                                  : [];
                                return {
                                  ...prev,
                                  imagesStr: [...currentList, base64Str].join(', '),
                                };
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-gray-400 font-bold">Select 1 or more photos from your computer</span>
                </div>

                {/* Previews Grid */}
                {formValues.imagesStr && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {formValues.imagesStr.split(',').map((imgUrl, idx) => {
                      const trimmed = imgUrl.trim();
                      if (!trimmed) return null;
                      return (
                        <div key={idx} className="relative w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden group shrink-0">
                          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${trimmed}')` }} />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formValues.imagesStr
                                .split(',')
                                .map((s) => s.trim())
                                .filter((_, i) => i !== idx)
                                .join(', ');
                              setFormValues({ ...formValues, imagesStr: updated });
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-80 hover:opacity-100 transition-opacity"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[#101A2D] font-bold block mb-1">Short Summary</label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formValues.shortDescription}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-lg outline-none text-gray-900 font-bold"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[#101A2D] font-bold block mb-1">Detailed Description *</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formValues.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-lg outline-none resize-none text-gray-900 font-bold"
                />
              </div>
            </div>

            {/* Right Column: Pricing & Limits */}
            <div className="space-y-4 p-4 border border-gray-150 rounded-xl bg-gray-50/20">
              <h4 className="font-extrabold text-[#1A2A4A] border-b border-gray-150 pb-1 uppercase tracking-wider">Prices & Inventory</h4>
              
              {/* Retail price */}
              <div className="space-y-1">
                <label className="text-[#101A2D] font-bold block mb-1">Retail Price ($CAD) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="retailPrice"
                  required
                  value={formValues.retailPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg outline-none text-gray-900 font-bold"
                />
              </div>

              {/* Community price */}
              <div className="space-y-1">
                <label className="text-[#101A2D] font-bold block mb-1">Community Price ($CAD)</label>
                <input
                  type="number"
                  step="0.01"
                  name="communityPrice"
                  value={formValues.communityPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg outline-none text-gray-900 font-bold"
                />
              </div>

              {/* Wholesale price */}
              <div className="space-y-1">
                <label className="text-[#101A2D] font-bold block mb-1">Wholesale B2B Price ($CAD)</label>
                <input
                  type="number"
                  step="0.01"
                  name="wholesalePrice"
                  value={formValues.wholesalePrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg outline-none text-gray-900 font-bold"
                />
              </div>

              {/* Stock */}
              <div className="space-y-1">
                <label className="text-[#101A2D] font-bold block mb-1">Inventory Stock Count *</label>
                <input
                  type="number"
                  name="stock"
                  required
                  value={formValues.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg outline-none text-gray-900 font-bold"
                />
              </div>

              {/* Low stock threshold */}
              <div className="space-y-1">
                <label className="text-[#101A2D] font-bold block mb-1">Low Stock Warning Trigger</label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={formValues.lowStockThreshold}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg outline-none text-gray-900 font-bold"
                />
              </div>

              {/* Wholesale min qty */}
              <div className="space-y-1">
                <label>B2B Minimum Order Qty</label>
                <input
                  type="number"
                  name="wholesaleMinQty"
                  value={formValues.wholesaleMinQty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-250 rounded-lg outline-none"
                />
              </div>

              {/* Flags checks */}
              <div className="pt-2 space-y-2 border-t border-gray-150">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formValues.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[#1A2A4A]"
                  />
                  <span>Active Catalog Listing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formValues.isFeatured}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[#1A2A4A]"
                  />
                  <span>Featured Product Banner</span>
                </label>
              </div>
            </div>

            {/* Bulk pricing tiers grid (Whole Row width) */}
            <div className="sm:col-span-3 border-t border-gray-150 pt-5 space-y-4">
              <h4 className="font-extrabold text-sm text-[#101A2D] uppercase border-b border-gray-100 pb-1">
                B2B Bulk Discount Tiers
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="space-y-1">
                  <label>Minimum Quantity Trigger</label>
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    value={newTier.minQty}
                    onChange={(e) => setNewTier({ ...newTier, minQty: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label>Discount Percentage (%)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    value={newTier.discountPercent}
                    onChange={(e) => setNewTier({ ...newTier, discountPercent: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-lg outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTier}
                  className="py-2 px-5 border border-[#1A2A4A] text-[#1A2A4A] hover:bg-gray-50 rounded-lg font-bold"
                >
                  Add Bulk Tier Row
                </button>
              </div>

              {/* Tiers List grid */}
              {bulkPricing.length > 0 && (
                <div className="border border-gray-150 rounded-lg overflow-hidden max-w-md">
                  <table className="w-full text-[11px] border-collapse text-left">
                    <thead>
                      <tr className="bg-gray-100 text-gray-500 font-bold border-b border-gray-150">
                        <th className="p-2.5">Min Qty</th>
                        <th className="p-2.5">Discount %</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                      {bulkPricing.map((tier, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-2.5">{tier.minQty}+ units</td>
                          <td className="p-2.5 text-emerald-700">{tier.discountPercent}% OFF</td>
                          <td className="p-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveTier(idx)}
                              className="text-red-650 hover:underline"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Bottom Form Actions */}
            <div className="sm:col-span-3 border-t border-gray-100 pt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
                className="py-2.5 px-6 border border-gray-200 hover:bg-gray-50 rounded-lg font-bold text-gray-600"
                disabled={formSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg font-bold shadow-xs transition-colors"
                disabled={formSubmitting}
              >
                {formSubmitting ? 'Saving Details...' : 'Save Product details'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. PRODUCTS GRID LIST TABLE */}
      {!formOpen && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-2xs flex justify-between items-center gap-4">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by Name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-255 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
              />
            </div>
            <div className="text-gray-400">
              {filteredProducts.length} items loaded
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-gray-100 text-gray-500 uppercase font-bold border-b border-gray-150">
                  <th className="p-4">Product Details</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Retail Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 font-semibold text-gray-700">
                {filteredProducts.map((prod) => {
                  const isLow = prod.stock <= prod.lowStockThreshold;

                  return (
                    <tr key={prod._id} className="hover:bg-gray-50">
                      {/* Image + Name */}
                      <td className="p-4 flex items-center gap-3">
                        <div
                          className="w-10 h-10 bg-cover bg-center rounded-lg border border-gray-200 shrink-0 bg-gray-50"
                          style={{ backgroundImage: `url('${prod.images[0] || '/images/hero_banner.png'}')` }}
                        />
                        <div>
                          <p className="text-[#101A2D] font-bold line-clamp-1">{prod.name}</p>
                          <span className="text-[10px] text-gray-400 uppercase">Slug: {prod.slug}</span>
                        </div>
                      </td>

                      <td className="p-4 font-bold text-[#1A2A4A]">{prod.sku}</td>
                      <td className="p-4 text-gray-500">{prod.categoryId?.name}</td>
                      <td className="p-4 font-bold text-[#101A2D]">${prod.retailPrice.toFixed(2)}</td>
                      
                      {/* Stock with Alert warnings */}
                      <td className="p-4">
                        {isLow ? (
                          <span className="bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-sm font-extrabold flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {prod.stock} left
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-sm font-extrabold flex items-center gap-1 w-fit">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            {prod.stock}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 text-gray-400 hover:text-black rounded-md hover:bg-gray-100 transition-colors inline-flex items-center"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="p-1.5 text-gray-400 hover:text-red-650 rounded-md hover:bg-red-55/10 transition-colors inline-flex items-center"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
