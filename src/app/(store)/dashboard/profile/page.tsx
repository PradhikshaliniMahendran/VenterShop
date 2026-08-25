'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { User, Mail, Phone, Globe, Save, CheckCircle } from 'lucide-react';

export default function DashboardProfilePage() {
  const { user, refreshSession } = useAuth();
  const { t, language, setLanguage } = useTranslation();

  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    preferredLanguage: 'en' as 'en' | 'ta',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize form values from active user session
  useEffect(() => {
    if (user) {
      setFormValues({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        preferredLanguage: user.preferredLanguage || 'en',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrorMsg(null);
    setSuccess(false);
  };

  // Submit changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setErrorMsg(null);

    if (!formValues.firstName || !formValues.lastName) {
      setErrorMsg('First name and last name are required.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });

      if (res.ok) {
        setSuccess(true);
        // Update language state globally in translation context
        setLanguage(formValues.preferredLanguage);
        // Refresh session JWT
        await refreshSession();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <h1 className="text-xl font-black text-[#101A2D] tracking-tight uppercase border-b border-gray-150 pb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-[#E53935]" />
        {t('dashProfile')}
      </h1>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-150 shadow-xs max-w-2xl">
        {success && (
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-4 rounded-xl text-xs font-extrabold flex items-center gap-2 mb-6">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{t('profileSaved')}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-xl text-xs font-extrabold flex items-center gap-2 mb-6">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email (Readonly) */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-gray-400 uppercase tracking-wide flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {t('profileEmail')}
              </label>
              <input
                type="text"
                disabled
                value={user.email}
                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed outline-none"
              />
              <span className="text-[10px] text-gray-400 font-bold block pt-0.5">Email address is locked and cannot be changed.</span>
            </div>

            {/* First Name */}
            <div className="space-y-1.5">
              <label className="text-[#101A2D] font-bold block mb-1">{t('profileFirstName')} *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formValues.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label className="text-[#101A2D] font-bold block mb-1">{t('profileLastName')} *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formValues.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[#101A2D] font-bold block mb-1 uppercase tracking-wide flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {t('profilePhone')}
              </label>
              <input
                type="text"
                name="phone"
                value={formValues.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
              />
            </div>

            {/* Preferred Language */}
            <div className="space-y-1.5">
              <label className="text-[#101A2D] font-bold block mb-1 uppercase tracking-wide flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                {t('dashPreferredLang')}
              </label>
              <select
                name="preferredLanguage"
                value={formValues.preferredLanguage}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] cursor-pointer text-gray-900 font-bold"
              >
                <option value="en">English (default)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto py-2.5 px-8 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? t('profileSaving') : t('profileSave')}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
