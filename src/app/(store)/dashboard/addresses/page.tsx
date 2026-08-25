'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, HelpCircle, Check } from 'lucide-react';

interface IAddressData {
  _id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  addressType: 'Home' | 'Business' | 'Other';
  isDefault: boolean;
}

export default function DashboardAddressesPage() {
  const { t, language } = useTranslation();

  const [addresses, setAddresses] = useState<IAddressData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    addressType: 'Home' as 'Home' | 'Business' | 'Other',
    isDefault: false,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // 1. Fetch addresses
  const loadAddresses = async () => {
    try {
      const res = await fetch('/api/customer/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (e) {
      console.error('Failed to load addresses:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormValues((prev) => ({ ...prev, [name]: val }));
  };

  // 2. Add / Edit Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    if (!formValues.fullName || !formValues.addressLine1 || !formValues.city || !formValues.province || !formValues.postalCode || !formValues.phone) {
      setFormError('Please complete all required fields.');
      setFormSubmitting(false);
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const bodyPayload = editingId ? { addressId: editingId, ...formValues } : formValues;

      const res = await fetch('/api/customer/addresses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
        setFormOpen(false);
        resetForm();
      } else {
        const data = await res.json();
        setFormError(data.error || 'Failed to save address');
      }
    } catch (err) {
      setFormError('Network error. Failed to save address.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // 3. Delete address
  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await fetch(`/api/customer/addresses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch (e) {
      console.error('Failed to delete address:', e);
    }
  };

  // 4. Set Default address
  const handleSetDefault = async (addr: IAddressData) => {
    try {
      const res = await fetch('/api/customer/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: addr._id,
          isDefault: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch (e) {
      console.error('Failed to set default address:', e);
    }
  };

  const handleOpenEdit = (addr: IAddressData) => {
    setEditingId(addr._id);
    setFormValues({
      fullName: addr.fullName,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      province: addr.province,
      postalCode: addr.postalCode,
      phone: addr.phone,
      addressType: addr.addressType,
      isDefault: addr.isDefault,
    });
    setFormOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormValues({
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      province: '',
      postalCode: '',
      phone: '',
      addressType: 'Home',
      isDefault: false,
    });
    setFormError(null);
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'Home':
        return <Home className="w-4 h-4 text-gray-500" />;
      case 'Business':
        return <Briefcase className="w-4 h-4 text-gray-500" />;
      default:
        return <HelpCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-40 border border-gray-100 p-6 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-gray-150 pb-4">
        <h1 className="text-xl font-black text-[#101A2D] tracking-tight uppercase">
          {t('dashAddresses')}
        </h1>
        
        {!formOpen && (
          <button
            onClick={() => {
              resetForm();
              setFormOpen(true);
            }}
            className="flex items-center gap-1.5 py-1.5 px-4 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Address</span>
          </button>
        )}
      </div>

      {/* Address Form Drawer/Overlay */}
      {formOpen && (
        <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="font-extrabold text-sm text-[#101A2D] uppercase border-b border-gray-100 pb-2">
            {editingId ? 'Edit Address Details' : t('addressAddNew')}
          </h3>

          {formError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 text-xs font-bold">
              ⚠️ {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            {/* Full Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[#101A2D] font-bold block mb-1">{t('checkoutFullName')} *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formValues.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#1A2A4A] outline-none text-gray-900 font-bold"
              />
            </div>

            {/* Address Line 1 */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[#101A2D] font-bold block mb-1">{t('checkoutAddress1')} *</label>
              <input
                type="text"
                name="addressLine1"
                required
                value={formValues.addressLine1}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#1A2A4A] outline-none text-gray-900 font-bold"
              />
            </div>

            {/* Address Line 2 */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[#101A2D] font-bold block mb-1">{t('checkoutAddress2')}</label>
              <input
                type="text"
                name="addressLine2"
                value={formValues.addressLine2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#1A2A4A] outline-none text-gray-900 font-bold"
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-[#101A2D] font-bold block mb-1">{t('checkoutCity')} *</label>
              <input
                type="text"
                name="city"
                required
                value={formValues.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#1A2A4A] outline-none text-gray-900 font-bold"
              />
            </div>

            {/* Province */}
            <div className="space-y-1.5">
              <label className="text-[#101A2D] font-bold block mb-1">{t('checkoutProvince')} *</label>
              <select
                name="province"
                required
                value={formValues.province}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#1A2A4A] outline-none cursor-pointer text-gray-900 font-bold"
              >
                <option value="">Select Province</option>
                <option value="Alberta">Alberta</option>
                <option value="British Columbia">British Columbia</option>
                <option value="Manitoba">Manitoba</option>
                <option value="New Brunswick">New Brunswick</option>
                <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                <option value="Nova Scotia">Nova Scotia</option>
                <option value="Ontario">Ontario</option>
                <option value="Prince Edward Island">Prince Edward Island</option>
                <option value="Quebec">Quebec</option>
                <option value="Saskatchewan">Saskatchewan</option>
                <option value="Northwest Territories">Northwest Territories</option>
                <option value="Nunavut">Nunavut</option>
                <option value="Yukon">Yukon</option>
              </select>
            </div>

            {/* Postal Code */}
            <div className="space-y-1.5">
              <label className="text-[#101A2D] font-bold block mb-1">{t('checkoutPostalCode')} *</label>
              <input
                type="text"
                name="postalCode"
                required
                value={formValues.postalCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#1A2A4A] outline-none text-gray-900 font-bold"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[#101A2D] font-bold block mb-1">{t('checkoutPhone')} *</label>
              <input
                type="text"
                name="phone"
                required
                value={formValues.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#1A2A4A] outline-none text-gray-900 font-bold"
              />
            </div>

            {/* Address Type */}
            <div className="space-y-1.5">
              <label className="text-[#101A2D] font-bold block mb-1">Address Label</label>
              <select
                name="addressType"
                value={formValues.addressType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#1A2A4A] outline-none cursor-pointer text-gray-900 font-bold"
              >
                <option value="Home">{t('addressTypeHome')}</option>
                <option value="Business">{t('addressTypeBusiness')}</option>
                <option value="Other">{t('addressTypeOther')}</option>
              </select>
            </div>

            {/* Set default checkbox */}
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formValues.isDefault}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-[#1A2A4A]"
                />
                <span>Set as default shipping destination</span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="sm:col-span-2 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
                className="py-2 px-5 border border-gray-200 hover:bg-gray-50 text-[#333333] rounded-lg font-bold"
                disabled={formSubmitting}
              >
                {t('addressCancel')}
              </button>
              <button
                type="submit"
                className="py-2 px-5 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg font-bold shadow-xs transition-colors"
                disabled={formSubmitting}
              >
                {formSubmitting ? t('addressSaving') : t('profileSave')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address Cards Grid */}
      {!formOpen && addresses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-150 p-12 text-center text-xs text-gray-500 font-semibold max-w-md mx-auto">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          You don't have any saved shipping addresses yet. Click "Add Address" above to save one.
        </div>
      ) : !formOpen ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`bg-white p-5 rounded-xl border flex flex-col justify-between gap-4 transition-all duration-150 ${
                addr.isDefault
                  ? 'border-[#1A2A4A] shadow-xs'
                  : 'border-gray-150 hover:border-gray-250 shadow-2xs'
              }`}
            >
              {/* Card Title */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                <div className="flex items-center gap-1.5 text-[#101A2D] font-bold">
                  {getAddressIcon(addr.addressType)}
                  <span className="text-xs uppercase tracking-wider">{addr.addressType}</span>
                </div>
                
                {addr.isDefault && (
                  <span className="bg-red-50 text-[#E53935] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-sm border border-red-100 tracking-wider inline-flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" />
                    Default
                  </span>
                )}
              </div>

              {/* Address details */}
              <div className="text-xs text-gray-600 space-y-1 flex-grow">
                <p className="font-extrabold text-[#101A2D] text-sm">{addr.fullName}</p>
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.province} {addr.postalCode}</p>
                <p>Phone: {addr.phone}</p>
              </div>

              {/* Actions strip */}
              <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-xs">
                <div>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className="text-gray-400 hover:text-[#1A2A4A] font-bold hover:underline transition-colors"
                    >
                      {t('addressSetDefault')}
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEdit(addr)}
                    className="p-1.5 text-gray-400 hover:text-black rounded-md hover:bg-gray-100 transition-colors"
                    title="Edit Address"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="p-1.5 text-gray-400 hover:text-red-650 rounded-md hover:bg-red-50 transition-colors"
                    title="Delete Address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
