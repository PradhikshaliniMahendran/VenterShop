'use client';

import React, { useEffect, useState } from 'react';
import { Ticket, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface ICategory {
  _id: string;
  name: string;
}

interface IProduct {
  _id: string;
  name: string;
}

interface ICommunity {
  _id: string;
  name: string;
}

interface IVoucherCampaign {
  _id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minimumOrderValue: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  perCustomerLimit: number;
  customerTypes: string[];
  categoryIds: ICategory[];
  productIds: IProduct[];
  communityIds: ICommunity[];
  isActive: boolean;
}

interface IOfferCampaign {
  _id: string;
  name: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  startDate: string;
  endDate: string;
  customerTypes: string[];
  categoryIds: ICategory[];
  productIds: IProduct[];
  communityIds: ICommunity[];
  isActive: boolean;
}

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<IVoucherCampaign[]>([]);
  const [offers, setOffers] = useState<IOfferCampaign[]>([]);
  
  // Scopes Lists
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [communities, setCommunities] = useState<ICommunity[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs: 'vouchers' | 'offers'
  const [activeTab, setActiveTab] = useState<'vouchers' | 'offers'>('vouchers');

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formValues, setFormValues] = useState({
    code: '', // voucher only
    name: '', // offer only
    description: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: '',
    minimumOrderValue: '0', // voucher only
    startDate: '',
    endDate: '',
    usageLimit: '', // voucher only
    perCustomerLimit: '1', // voucher only
    isActive: true,
  });

  // Audience Targeting checklist states
  const [targetCustomerTypes, setTargetCustomerTypes] = useState<string[]>(['NORMAL', 'COMMUNITY', 'WHOLESALE']);
  const [targetCategories, setTargetCategories] = useState<string[]>([]);
  const [targetProducts, setTargetProducts] = useState<string[]>([]);
  const [targetCommunities, setTargetCommunities] = useState<string[]>([]);

  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const campRes = await fetch('/api/admin/vouchers');
      const catRes = await fetch('/api/categories');
      const prodRes = await fetch('/api/admin/products');
      const custRes = await fetch('/api/admin/customers');

      if (campRes.ok && catRes.ok && prodRes.ok && custRes.ok) {
        const campData = await campRes.json();
        const catData = await catRes.json();
        const prodData = await prodRes.json();
        const custData = await custRes.json();

        setVouchers(campData.vouchers || []);
        setOffers(campData.offers || []);
        setCategories(catData.categories || []);
        setProducts(prodData.products || []);
        setCommunities(custData.communities || []);
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

  // Checkbox checklists toggles
  const handleToggleCustomerType = (type: string) => {
    if (targetCustomerTypes.includes(type)) {
      setTargetCustomerTypes(targetCustomerTypes.filter((t) => t !== type));
    } else {
      setTargetCustomerTypes([...targetCustomerTypes, type]);
    }
  };

  const handleToggleCategory = (catId: string) => {
    if (targetCategories.includes(catId)) {
      setTargetCategories(targetCategories.filter((id) => id !== catId));
    } else {
      setTargetCategories([...targetCategories, catId]);
    }
  };

  const handleToggleCommunity = (commId: string) => {
    if (targetCommunities.includes(commId)) {
      setTargetCommunities(targetCommunities.filter((id) => id !== commId));
    } else {
      setTargetCommunities([...targetCommunities, commId]);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    const payload = {
      type: activeTab === 'vouchers' ? 'VOUCHER' : 'OFFER',
      campaignId: editingId,
      ...formValues,
      customerTypes: targetCustomerTypes,
      categoryIds: targetCategories,
      productIds: targetProducts,
      communityIds: targetCommunities,
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/vouchers', {
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
        setFormError(data.error || 'Failed to save campaign');
      }
    } catch (err) {
      setFormError('Network error. Failed to save campaign details.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Campaign
  const handleDeleteCampaign = async (id: string, type: 'VOUCHER' | 'OFFER') => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const res = await fetch(`/api/admin/vouchers?id=${id}&type=${type}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      } else {
        alert('Failed to delete campaign');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenEditVoucher = (v: IVoucherCampaign) => {
    setEditingId(v._id);
    setFormValues({
      code: v.code,
      name: '',
      description: v.description,
      discountType: v.discountType,
      discountValue: v.discountValue.toString(),
      minimumOrderValue: v.minimumOrderValue.toString(),
      startDate: v.startDate.split('T')[0],
      endDate: v.endDate.split('T')[0],
      usageLimit: v.usageLimit ? v.usageLimit.toString() : '',
      perCustomerLimit: v.perCustomerLimit.toString(),
      isActive: v.isActive,
    });
    setTargetCustomerTypes(v.customerTypes || []);
    setTargetCategories(v.categoryIds.map((c) => c._id) || []);
    setTargetProducts(v.productIds.map((p) => p._id) || []);
    setTargetCommunities(v.communityIds.map((c) => c._id) || []);
    setFormOpen(true);
  };

  const handleOpenEditOffer = (o: IOfferCampaign) => {
    setEditingId(o._id);
    setFormValues({
      code: '',
      name: o.name,
      description: o.description,
      discountType: o.discountType,
      discountValue: o.discountValue.toString(),
      minimumOrderValue: '0',
      startDate: o.startDate.split('T')[0],
      endDate: o.endDate.split('T')[0],
      usageLimit: '',
      perCustomerLimit: '1',
      isActive: o.isActive,
    });
    setTargetCustomerTypes(o.customerTypes || []);
    setTargetCategories(o.categoryIds.map((c) => c._id) || []);
    setTargetProducts(o.productIds.map((p) => p._id) || []);
    setTargetCommunities(o.communityIds.map((c) => c._id) || []);
    setFormOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormValues({
      code: '',
      name: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minimumOrderValue: '0',
      startDate: '',
      endDate: '',
      usageLimit: '',
      perCustomerLimit: '1',
      isActive: true,
    });
    setTargetCustomerTypes(['NORMAL', 'COMMUNITY', 'WHOLESALE']);
    setTargetCategories([]);
    setTargetProducts([]);
    setTargetCommunities([]);
    setFormError(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
          <Ticket className="w-5 h-5 text-[#E53935]" />
          Discounts, Offers & Vouchers Wizard
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
            <span>{activeTab === 'vouchers' ? 'Add Voucher' : 'Add Offer'}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-150 bg-gray-50/50 rounded-lg p-1 gap-1 max-w-sm">
        <button
          onClick={() => {
            setActiveTab('vouchers');
            resetForm();
            setFormOpen(false);
          }}
          className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
            activeTab === 'vouchers'
              ? 'bg-[#1A2A4A] text-white shadow-xs'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          Coupon Vouchers
        </button>
        <button
          onClick={() => {
            setActiveTab('offers');
            resetForm();
            setFormOpen(false);
          }}
          className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
            activeTab === 'offers'
              ? 'bg-[#1A2A4A] text-white shadow-xs'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          Storefront Offers
        </button>
      </div>

      {/* FORM WIZARD OVERLAY */}
      {formOpen && (
        <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="font-extrabold text-sm text-[#101A2D] uppercase border-b border-gray-100 pb-2">
            {editingId ? 'Edit Campaign Details' : `Create New ${activeTab === 'vouchers' ? 'Voucher Coupon' : 'Storefront Offer'}`}
          </h3>

          {formError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 text-xs font-bold">
              ⚠️ {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Left: Campaign details */}
            <div className="space-y-4 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Voucher Code / Offer Name */}
              {activeTab === 'vouchers' ? (
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[#101A2D] font-bold block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    name="code"
                    required
                    placeholder="e.g. GROCERY10"
                    value={formValues.code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-lg outline-none uppercase font-mono text-gray-900 font-bold"
                  />
                </div>
              ) : (
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[#101A2D] font-bold block mb-1">Offer Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Eid Festival Sale"
                    value={formValues.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-lg outline-none text-gray-900 font-bold"
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[#101A2D] font-bold block mb-1">Campaign Terms / Description *</label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="e.g. Save 10% on groceries with minimum order value of $30.00"
                  value={formValues.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-lg outline-none text-gray-900 font-bold"
                />
              </div>

              {/* Discount Type */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Discount Type *</label>
                <select
                  name="discountType"
                  required
                  value={formValues.discountType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-255 rounded-lg outline-none cursor-pointer text-gray-900 font-bold"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount ($CAD)</option>
                </select>
              </div>

              {/* Discount Value */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Discount Value *</label>
                <input
                  type="number"
                  name="discountValue"
                  required
                  value={formValues.discountValue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-255 rounded-lg outline-none text-gray-900 font-bold"
                />
              </div>

              {/* Expirations dates */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  required
                  value={formValues.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-255 rounded-lg outline-none text-gray-900 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  required
                  value={formValues.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-255 rounded-lg outline-none text-gray-900 font-bold"
                />
              </div>

              {/* Vouchers special parameters */}
              {activeTab === 'vouchers' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[#101A2D] font-bold block mb-1">Minimum Order Threshold ($CAD)</label>
                    <input
                      type="number"
                      name="minimumOrderValue"
                      value={formValues.minimumOrderValue}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-255 rounded-lg outline-none text-gray-900 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[#101A2D] font-bold block mb-1">Global Usage Cap (Optional)</label>
                    <input
                      type="number"
                      name="usageLimit"
                      placeholder="Unlimited if empty"
                      value={formValues.usageLimit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-255 rounded-lg outline-none text-gray-900 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[#101A2D] font-bold block mb-1">Per Customer Usage Limit *</label>
                    <input
                      type="number"
                      name="perCustomerLimit"
                      required
                      value={formValues.perCustomerLimit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-255 rounded-lg outline-none text-gray-900 font-bold"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Right: Target Audience parameters checkboxes */}
            <div className="space-y-4 p-4 border border-gray-150 rounded-xl bg-gray-50/20 max-h-[450px] overflow-y-auto">
              <h4 className="font-extrabold text-[#1A2A4A] border-b border-gray-150 pb-1 uppercase tracking-wider">Targeting Rules</h4>
              
              {/* Customer tier targets */}
              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Customer Pricing Tiers</label>
                <div className="space-y-1">
                  {['NORMAL', 'COMMUNITY', 'WHOLESALE'].map((tier) => (
                    <label key={tier} className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={targetCustomerTypes.includes(tier)}
                        onChange={() => handleToggleCustomerType(tier)}
                        className="w-4 h-4 accent-[#1A2A4A]"
                      />
                      <span>{tier}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Community scope targets */}
              {communities.length > 0 && (
                <div className="space-y-1.5 border-t border-gray-150 pt-3">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Target Community Groups</label>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {communities.map((c) => (
                      <label key={c._id} className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          checked={targetCommunities.includes(c._id)}
                          onChange={() => handleToggleCommunity(c._id)}
                          className="w-4 h-4 accent-[#1A2A4A]"
                        />
                        <span>{c.name}</span>
                      </label>
                    ))}
                  </div>
                  <span className="text-[9px] text-gray-400 font-semibold block pt-0.5 leading-normal">Leaving all communities unchecked targets everyone outside B2C loops.</span>
                </div>
              )}

              {/* Category targets */}
              {categories.length > 0 && (
                <div className="space-y-1.5 border-t border-gray-150 pt-3">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Eligible Catalog Categories</label>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          checked={targetCategories.includes(cat._id)}
                          onChange={() => handleToggleCategory(cat._id)}
                          className="w-4 h-4 accent-[#1A2A4A]"
                        />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                  <span className="text-[9px] text-gray-400 font-semibold block pt-0.5 leading-normal">If unchecked, applies to all storefront categories.</span>
                </div>
              )}

              {/* Active flag status */}
              <div className="pt-3 border-t border-gray-150">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formValues.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[#1A2A4A]"
                  />
                  <span>Active Campaign Listing</span>
                </label>
              </div>
            </div>

            {/* Bottom buttons */}
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
                {formSubmitting ? 'Saving details...' : 'Save Campaign details'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. CAMPAIGNS LIST TABLES */}
      {!formOpen && activeTab === 'vouchers' && (
        <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-100 text-gray-500 uppercase font-bold border-b border-gray-150">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4">Min Spend</th>
                <th className="p-4">Customer Scope</th>
                <th className="p-4">Expiring On</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
              {vouchers.map((v) => (
                <tr key={v._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-extrabold text-[#1A2A4A] font-mono">{v.code}</p>
                    <span className="text-[10px] text-gray-400 font-semibold line-clamp-1 truncate max-w-[200px] block">{v.description}</span>
                  </td>
                  <td className="p-4 text-[#101A2D]">
                    {v.discountType === 'PERCENTAGE' ? `${v.discountValue}% Off` : `$${v.discountValue} Off`}
                  </td>
                  <td className="p-4 text-gray-500">${v.minimumOrderValue.toFixed(2)}</td>
                  
                  <td className="p-4 text-gray-500 font-semibold truncate max-w-[120px]">
                    {v.customerTypes.join(', ')}
                  </td>

                  <td className="p-4 text-gray-450">{formatDate(v.endDate)}</td>

                  <td className="p-4">
                    {v.isActive ? (
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
                      onClick={() => handleOpenEditVoucher(v)}
                      className="p-1.5 text-gray-400 hover:text-black rounded-md hover:bg-gray-100 transition-colors inline-flex items-center"
                      title="Edit Voucher"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCampaign(v._id, 'VOUCHER')}
                      className="p-1.5 text-gray-400 hover:text-red-650 rounded-md hover:bg-red-50 transition-colors inline-flex items-center"
                      title="Delete Voucher"
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

      {!formOpen && activeTab === 'offers' && (
        <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-100 text-gray-500 uppercase font-bold border-b border-gray-150">
                <th className="p-4">Offer Name</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4">Target Scope</th>
                <th className="p-4">Customer Scope</th>
                <th className="p-4">Expiring On</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
              {offers.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-bold text-[#101A2D]">{o.name}</p>
                    <span className="text-[10px] text-gray-400 font-semibold line-clamp-1 truncate max-w-[200px] block">{o.description}</span>
                  </td>
                  <td className="p-4 text-[#101A2D]">
                    {o.discountType === 'PERCENTAGE' ? `${o.discountValue}% Off` : `$${o.discountValue} Off`}
                  </td>
                  
                  <td className="p-4 text-gray-500 truncate max-w-[120px]">
                    {o.categoryIds.length > 0
                      ? `Categories: ${o.categoryIds.map((c) => c.name).join(', ')}`
                      : 'All categories'}
                  </td>

                  <td className="p-4 text-gray-500 font-semibold truncate max-w-[120px]">
                    {o.customerTypes.join(', ')}
                  </td>

                  <td className="p-4 text-gray-455">{formatDate(o.endDate)}</td>

                  <td className="p-4">
                    {o.isActive ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-sm font-extrabold flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Active
                      </span>
                    ) : (
                      <span className="bg-gray-50 text-gray-500 border border-gray-205 px-2 py-0.5 rounded-sm font-extrabold flex items-center gap-1 w-fit">
                        <XCircle className="w-3.5 h-3.5" />
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditOffer(o)}
                      className="p-1.5 text-gray-400 hover:text-black rounded-md hover:bg-gray-100 transition-colors inline-flex items-center"
                      title="Edit Offer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCampaign(o._id, 'OFFER')}
                      className="p-1.5 text-gray-400 hover:text-red-650 rounded-md hover:bg-red-50 transition-colors inline-flex items-center"
                      title="Delete Offer"
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
