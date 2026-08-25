'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Briefcase, CheckCircle, Clock, AlertCircle, Info, Sparkles, Send } from 'lucide-react';

interface IApplicationData {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessAddress: string;
  city: string;
  province: string;
  postalCode: string;
  expectedOrderVolume: string;
  wholesaleCategory?: string;
  additionalNotes?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
}

export default function DashboardWholesalePage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [application, setApplication] = useState<IApplicationData | null>(null);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [formValues, setFormValues] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessAddress: '',
    city: '',
    province: '',
    postalCode: '',
    expectedOrderVolume: '',
    wholesaleCategory: '',
    additionalNotes: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch application details
  useEffect(() => {
    async function fetchApp() {
      try {
        const res = await fetch('/api/wholesale/apply');
        if (res.ok) {
          const data = await res.json();
          setApplication(data.application);
          if (data.application) {
            setFormValues({
              businessName: data.application.businessName,
              contactPerson: data.application.contactPerson,
              email: data.application.email,
              phone: data.application.phone,
              businessAddress: data.application.businessAddress,
              city: data.application.city,
              province: data.application.province,
              postalCode: data.application.postalCode,
              expectedOrderVolume: data.application.expectedOrderVolume,
              wholesaleCategory: data.application.wholesaleCategory || '',
              additionalNotes: data.application.additionalNotes || '',
            });
          } else if (user) {
            // Auto fill profile values
            setFormValues((prev) => ({
              ...prev,
              contactPerson: `${user.firstName} ${user.lastName}`,
              email: user.email,
              phone: user.phone || '',
            }));
          }
        }
      } catch (e) {
        console.error('Failed to load B2B application:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchApp();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Submit application
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    if (
      !formValues.businessName ||
      !formValues.contactPerson ||
      !formValues.email ||
      !formValues.phone ||
      !formValues.businessAddress ||
      !formValues.city ||
      !formValues.province ||
      !formValues.postalCode ||
      !formValues.expectedOrderVolume
    ) {
      setFormError('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/wholesale/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();
      if (res.ok) {
        setApplication(data.application);
      } else {
        setFormError(data.error || 'Failed to submit B2B application.');
      }
    } catch (err) {
      setFormError('Network error. Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/4" />
        <div className="h-64 bg-white rounded-xl border border-gray-150 animate-pulse" />
      </div>
    );
  }

  const isB2BActive = user.customerType === 'WHOLESALE';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <h1 className="text-xl font-black text-[#101A2D] tracking-tight uppercase border-b border-gray-150 pb-4 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-[#E53935]" />
        {t('dashWholesale')}
      </h1>

      {/* CASE 1: B2B TIER IS ACTIVE */}
      {isB2BActive && (
        <div className="space-y-6">
          {/* Active Banner */}
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-250 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
            <CheckCircle className="w-10 h-10 text-emerald-600 shrink-0" />
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-extrabold text-base">Wholesale B2B Account Active!</h3>
              <p className="text-xs text-emerald-700 leading-relaxed font-semibold">
                Your profile has wholesale pricing enabled across eligible catalog categories. Bulk discount structures and minimum orders are activated.
              </p>
            </div>
          </div>

          {/* Wholesale Perks Grid */}
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#101A2D] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Your B2B Benefits & Privileges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-550 leading-relaxed font-semibold">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-150">
                <span className="text-[#101A2D] font-extrabold block mb-1">Wholesale Base Pricing</span>
                Shop products at bulk-dealer base rates, automatically calculated inside the shop page.
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-150">
                <span className="text-[#101A2D] font-extrabold block mb-1">Bulk Pricing Matrices</span>
                Tiered discounts apply dynamically at checkout based on quantities (e.g. Save 12% on 20+ units).
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-150">
                <span className="text-[#101A2D] font-extrabold block mb-1">Wholesale Inventory Listings</span>
                Unlock access to restricted items only available for business-level purchases.
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-150">
                <span className="text-[#101A2D] font-extrabold block mb-1">B2B Order Confirmations</span>
                Your orders bypass standard delivery cues and enter priority business packaging queues.
              </div>
            </div>
          </div>

          {/* Business details summary */}
          {application && (
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-[#101A2D] uppercase tracking-wider border-b border-gray-100 pb-2">
                Registered Corporate Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs font-semibold">
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-gray-400">Business Name:</span>
                  <span className="text-[#101A2D]">{application.businessName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-gray-400">Authorized Contact:</span>
                  <span className="text-[#101A2D]">{application.contactPerson}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-gray-400">Registered Email:</span>
                  <span className="text-[#101A2D]">{application.email}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-gray-400">Contact Phone:</span>
                  <span className="text-[#101A2D]">{application.phone}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5 sm:col-span-2">
                  <span className="text-gray-400">Business Address:</span>
                  <span className="text-[#101A2D]">{application.businessAddress}, {application.city}, {application.province} {application.postalCode}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CASE 2: B2B APPLICATION IS SUBMITTED & PENDING */}
      {!isB2BActive && application && application.status === 'PENDING' && (
        <div className="space-y-6">
          <div className="bg-amber-50 text-amber-800 border border-amber-250 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
            <Clock className="w-10 h-10 text-amber-600 shrink-0" />
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-extrabold text-base">Application Under Review</h3>
              <p className="text-xs text-amber-700 leading-relaxed font-semibold">
                We have received your wholesale application. An administrator is verifying your business details and credentials. You will receive an email confirmation once approved.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#101A2D] uppercase tracking-wider border-b border-gray-100 pb-2">
              Submitted Business Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs font-semibold">
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-400">Business Name:</span>
                <span className="text-[#101A2D]">{application.businessName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-400">Contact Person:</span>
                <span className="text-[#101A2D]">{application.contactPerson}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-400">Email Address:</span>
                <span className="text-[#101A2D]">{application.email}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-400">Phone Number:</span>
                <span className="text-[#101A2D]">{application.phone}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5 sm:col-span-2">
                <span className="text-gray-400">Shipping Address:</span>
                <span className="text-[#101A2D]">{application.businessAddress}, {application.city}, {application.province} {application.postalCode}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CASE 3: NO APPLICATION EXISTS (OR REJECTED), RENDER SUBMISSION FORM */}
      {!isB2BActive && (!application || application.status === 'REJECTED') && (
        <div className="space-y-6">
          {application && application.status === 'REJECTED' && (
            <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded-xl text-xs font-bold leading-normal">
              ⚠️ Previous application was rejected. Please review your credentials and business details before reapplying.
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-start gap-3">
            <Info className="w-5 h-5 text-[#1A2A4A] shrink-0 mt-0.5" />
            <p className="text-xs text-gray-550 leading-relaxed font-semibold">
              Applying for a B2B Wholesale account will unlock bulk pricing, volume discounts, and custom payment options once verified by store administrators. Please fill out the form below.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs">
            {formError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 text-xs font-bold mb-4">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              
              {/* Business Name */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Registered Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  required
                  placeholder="e.g. Canada Retailers Ltd."
                  value={formValues.businessName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                />
              </div>

              {/* Contact Person */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  name="contactPerson"
                  required
                  value={formValues.contactPerson}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                />
              </div>

              {/* Business Email */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formValues.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formValues.phone}
                  onChange={(e) => setFormValues({ ...formValues, phone: e.target.value.replace(/[^0-9+\s()-]/g, '') })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                />
              </div>

              {/* Address Line 1 */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[#101A2D] font-bold block mb-1">Business Address *</label>
                <input
                  type="text"
                  name="businessAddress"
                  required
                  placeholder="Address Line 1"
                  value={formValues.businessAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formValues.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                />
              </div>

              {/* Province */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Province *</label>
                <select
                  name="province"
                  required
                  value={formValues.province}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] cursor-pointer text-gray-900 font-bold"
                >
                  <option value="">Select Province</option>
                  <option value="Alberta">Alberta</option>
                  <option value="British Columbia">British Columbia</option>
                  <option value="Ontario">Ontario</option>
                  <option value="Quebec">Quebec</option>
                  {/* ... */}
                </select>
              </div>

              {/* Postal Code */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formValues.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                />
              </div>

              {/* Expected Order Volume */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Expected Monthly Order Volume *</label>
                <select
                  name="expectedOrderVolume"
                  required
                  value={formValues.expectedOrderVolume}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] cursor-pointer text-gray-900 font-bold"
                >
                  <option value="">Select Expected Volume</option>
                  <option value="<$1000/mo">Less than $1,000 / month</option>
                  <option value="$1000-$5000/mo">$1,000 - $5,000 / month</option>
                  <option value="$5000+/mo">More than $5,000 / month</option>
                </select>
              </div>

              {/* Wholesale Category */}
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Wholesale Category (Type of Business)</label>
                <select
                  name="wholesaleCategory"
                  value={formValues.wholesaleCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] cursor-pointer text-gray-900 font-bold"
                >
                  <option value="">Select Business Type</option>
                  <option value="Retailer">Retailer / Convenience Store</option>
                  <option value="Restaurant">Restaurant / Catering</option>
                  <option value="Distributor">Distributor / Bulk Broker</option>
                  <option value="Other">Other Business</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[#101A2D] font-bold block mb-1">Additional Notes or Requests</label>
                <textarea
                  name="additionalNotes"
                  rows={4}
                  value={formValues.additionalNotes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] resize-none text-gray-900 font-bold"
                  placeholder="Tell us details about your B2B requirements..."
                />
              </div>

              {/* Submit button */}
              <div className="sm:col-span-2 pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto py-2.5 px-8 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Submit B2B Application'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
