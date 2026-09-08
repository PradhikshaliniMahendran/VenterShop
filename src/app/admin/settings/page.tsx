'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Save, CheckCircle, Info } from 'lucide-react';

export default function AdminSettingsPage() {
  const [formValues, setFormValues] = useState({
    freeDeliveryThreshold: '75',
    primaryEmail: 'admin@ventershop.ca',
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setFormValues({
            freeDeliveryThreshold: data.settings.freeDeliveryThreshold.toString(),
            primaryEmail: data.settings.primaryEmail,
            maintenanceMode: data.settings.maintenanceMode,
          });
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormValues((prev) => ({ ...prev, [name]: val }));
    setSuccess(false);
    setErrorMsg(null);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to update settings');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to save settings.');
    } finally {
      setSubmitting(false);
    }
  };

  // Admin Password Change State & Handler
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingPassword(true);
    setPasswordSuccess(false);
    setPasswordError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      setSubmittingPassword(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      setSubmittingPassword(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess(true);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordError(data.error || 'Failed to update admin password.');
      }
    } catch (err) {
      setPasswordError('Network error updating password.');
    } finally {
      setSubmittingPassword(false);
    }
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
          <Settings className="w-5 h-5 text-[#E53935]" />
          Global Storefront Settings
        </h1>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-150 shadow-xs max-w-xl">
        {success && (
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-4 rounded-xl text-xs font-extrabold flex items-center gap-2 mb-6">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Store configurations updated successfully.</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-xl text-xs font-extrabold flex items-center gap-2 mb-6">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Free Shipping threshold */}
            <div className="space-y-1.5">
              <label className="text-[#101A2D] font-bold block mb-1">Free Delivery Threshold (LKR) *</label>
              <input
                type="number"
                name="freeDeliveryThreshold"
                required
                value={formValues.freeDeliveryThreshold}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
              />
              <span className="text-[10px] text-gray-400 font-bold block pt-0.5">Orders with subtotals exceeding this threshold qualify for free courier shipping.</span>
            </div>

            {/* Primary contact email */}
            <div className="space-y-1.5">
              <label className="text-[#101A2D] font-bold block mb-1">Primary Administrative Email *</label>
              <input
                type="email"
                name="primaryEmail"
                required
                value={formValues.primaryEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
              />
              <span className="text-[10px] text-gray-400 font-bold block pt-0.5">Primary notification email for transaction alerts and B2B submissions.</span>
            </div>

            {/* Maintenance mode */}
            <div className="p-4 border border-gray-150 rounded-lg bg-amber-50/20 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={formValues.maintenanceMode}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-[#E53935]"
                />
                <span className="text-[#101A2D] font-extrabold">Enable Storefront Maintenance Mode</span>
              </label>
              <p className="text-[10px] text-gray-400 font-semibold leading-normal">
                If active, the retail store is locked behind a maintenance message, blocking checkout and search features. Admins can still bypass.
              </p>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto py-2.5 px-8 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving Settings...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Admin Password Change Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-150 shadow-xs max-w-xl">
        <h2 className="text-sm font-black text-[#101A2D] uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>🔒</span>
          <span>Admin Account Security & Password</span>
        </h2>

          {passwordSuccess && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-4 rounded-xl text-xs font-extrabold flex items-center gap-2 mb-4">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Admin password updated successfully!</span>
            </div>
          )}

          {passwordError && (
            <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-xl text-xs font-extrabold flex items-center gap-2 mb-4">
              <span>⚠️</span>
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[#101A2D] font-bold block mb-1">Current Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Confirm password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={submittingPassword}
                className="w-full sm:w-auto py-2.5 px-6 bg-[#801414] hover:bg-[#600e0e] text-white rounded-lg font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{submittingPassword ? 'Updating Password...' : 'Update Admin Password'}</span>
              </button>
            </div>
          </form>
        </div>
    </div>
  );
}
