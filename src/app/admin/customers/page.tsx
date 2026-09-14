'use client';

import React, { useEffect, useState } from 'react';
import { Users, Briefcase, CheckCircle, XCircle, ShieldAlert, Edit2, Filter, Search } from 'lucide-react';

interface ICustomer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  customerType: 'BUYER' | 'V2CC_PMS_MEMBER' | 'WHOLESALE_BUYER' | 'SELLER_SUPPLIER' | 'PARTNER_STORE' | 'NORMAL' | 'COMMUNITY' | 'WHOLESALE';
  communityId?: { _id: string; name: string };
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

interface IWholesaleApp {
  _id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  expectedOrderVolume: string;
  wholesaleCategory?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  createdAt: string;
}

interface ICommunity {
  _id: string;
  name: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [applications, setApplications] = useState<IWholesaleApp[]>([]);
  const [communities, setCommunities] = useState<ICommunity[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs: 'customers' | 'wholesale'
  const [activeTab, setActiveTab] = useState<'customers' | 'wholesale'>('customers');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Customer Filters State
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
        setApplications(data.applications || []);
        setCommunities(data.communities || []);
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

  const getCountForType = (type: string) => {
    if (type === 'ALL') return customers.length;
    return customers.filter((c) => {
      if (type === 'BUYER') return c.customerType === 'BUYER' || c.customerType === 'NORMAL';
      if (type === 'V2CC_PMS_MEMBER') return c.customerType === 'V2CC_PMS_MEMBER' || c.customerType === 'COMMUNITY';
      if (type === 'WHOLESALE_BUYER') return c.customerType === 'WHOLESALE_BUYER' || c.customerType === 'WHOLESALE';
      if (type === 'SELLER_SUPPLIER') return c.customerType === 'SELLER_SUPPLIER';
      if (type === 'PARTNER_STORE') return c.customerType === 'PARTNER_STORE';
      return c.customerType === type;
    }).length;
  };

  // Suspend or Reactivate Customer
  const handleToggleSuspension = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (!confirm(`Are you sure you want to ${nextStatus.toLowerCase()} this customer account?`)) return;
    
    setUpdatingId(userId);
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_customer',
          userId,
          status: nextStatus,
        }),
      });

      if (res.ok) {
        loadData();
      } else {
        alert('Failed to update account status');
      }
    } catch (e) {
      alert('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Assign Community group
  const handleAssignCommunity = async (userId: string, commId: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_customer',
          userId,
          communityId: commId || null, // Clear if empty
        }),
      });

      if (res.ok) {
        loadData();
      } else {
        alert('Failed to assign community');
      }
    } catch (e) {
      alert('Error assigning community');
    } finally {
      setUpdatingId(null);
    }
  };

  // Review B2B applications (Approve / Reject)
  const handleReviewWholesale = async (appId: string, status: 'APPROVED' | 'REJECTED') => {
    if (!confirm(`Are you sure you want to mark this B2B application as ${status.toLowerCase()}?`)) return;
    
    setUpdatingId(appId);
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'review_wholesale',
          applicationId: appId,
          appStatus: status,
        }),
      });

      if (res.ok) {
        loadData();
      } else {
        alert('Failed to review application');
      }
    } catch (e) {
      alert('Error reviewing application');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // State for Customer Edit Modal
  const [editingCustomer, setEditingCustomer] = useState<ICustomer | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    customerType: 'BUYER' as any,
    communityId: '',
    status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const openEditModal = (cust: ICustomer) => {
    setEditingCustomer(cust);
    setEditForm({
      firstName: cust.firstName || '',
      lastName: cust.lastName || '',
      phone: cust.phone || '',
      customerType: cust.customerType || 'NORMAL',
      communityId: cust.communityId?._id || '',
      status: cust.status || 'ACTIVE',
    });
  };

  const handleSaveCustomerEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setSavingEdit(true);
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_customer',
          userId: editingCustomer._id,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          phone: editForm.phone,
          customerType: editForm.customerType,
          communityId: editForm.communityId || null,
          status: editForm.status,
        }),
      });

      if (res.ok) {
        setEditingCustomer(null);
        await loadData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update customer details');
      }
    } catch (err) {
      alert('Network error updating customer');
    } finally {
      setSavingEdit(false);
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
          <Users className="w-5 h-5 text-[#E53935]" />
          Customers Directory & Approvals
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-150 bg-gray-50/50 rounded-lg p-1 gap-1 max-w-sm">
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
            activeTab === 'customers'
              ? 'bg-[#1A2A4A] text-white shadow-xs'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          Registered Directory
        </button>
        <button
          onClick={() => setActiveTab('wholesale')}
          className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
            activeTab === 'wholesale'
              ? 'bg-[#1A2A4A] text-white shadow-xs'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          Wholesale Applications ({applications.filter((a) => a.status === 'PENDING').length})
        </button>
      </div>

      {/* DIRECTORY VIEW TAB */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          {/* Customer Type Quick Filter Pills & Search Bar */}
          <div className="bg-white rounded-xl border border-gray-150 p-4 shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black font-bold text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Customer Type Select Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-bold text-gray-600 uppercase">Customer Type:</span>
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-250 font-bold text-xs text-[#101A2D] rounded-lg py-1.5 px-3 outline-none cursor-pointer focus:border-[#1A2A4A]"
                >
                  <option value="ALL">All Types ({getCountForType('ALL')})</option>
                  <option value="BUYER">Buyer / Retail ({getCountForType('BUYER')})</option>
                  <option value="V2CC_PMS_MEMBER">V2CC-PMS Member ({getCountForType('V2CC_PMS_MEMBER')})</option>
                  <option value="WHOLESALE_BUYER">Wholesale Buyer ({getCountForType('WHOLESALE_BUYER')})</option>
                  <option value="SELLER_SUPPLIER">Seller / Supplier ({getCountForType('SELLER_SUPPLIER')})</option>
                  <option value="PARTNER_STORE">Partner Store ({getCountForType('PARTNER_STORE')})</option>
                </select>
              </div>
            </div>

            {/* Customer Type Quick Filter Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-100">
              {[
                { key: 'ALL', label: 'All Customers' },
                { key: 'BUYER', label: 'Buyers (Retail)' },
                { key: 'V2CC_PMS_MEMBER', label: 'V2CC-PMS Members' },
                { key: 'WHOLESALE_BUYER', label: 'Wholesale Buyers' },
                { key: 'SELLER_SUPPLIER', label: 'Sellers / Suppliers' },
                { key: 'PARTNER_STORE', label: 'Partner Stores' },
              ].map((btn) => {
                const isSelected = selectedTypeFilter === btn.key;
                const count = getCountForType(btn.key);
                return (
                  <button
                    key={btn.key}
                    onClick={() => setSelectedTypeFilter(btn.key)}
                    className={`py-1 px-3 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#1A2A4A] text-white border-[#1A2A4A] shadow-2xs'
                        : 'bg-gray-50 hover:bg-gray-150 text-gray-700 border-gray-200'
                    }`}
                  >
                    {btn.label} <span className="opacity-80">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Directory Table */}
          <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-x-auto">
            {(() => {
              const filteredCustomers = customers.filter((cust) => {
                if (selectedTypeFilter !== 'ALL') {
                  if (selectedTypeFilter === 'BUYER' && cust.customerType !== 'BUYER' && cust.customerType !== 'NORMAL') return false;
                  if (selectedTypeFilter === 'V2CC_PMS_MEMBER' && cust.customerType !== 'V2CC_PMS_MEMBER' && cust.customerType !== 'COMMUNITY') return false;
                  if (selectedTypeFilter === 'WHOLESALE_BUYER' && cust.customerType !== 'WHOLESALE_BUYER' && cust.customerType !== 'WHOLESALE') return false;
                  if (selectedTypeFilter === 'SELLER_SUPPLIER' && cust.customerType !== 'SELLER_SUPPLIER') return false;
                  if (selectedTypeFilter === 'PARTNER_STORE' && cust.customerType !== 'PARTNER_STORE') return false;
                }
                if (searchQuery.trim()) {
                  const q = searchQuery.toLowerCase().trim();
                  const fullName = `${cust.firstName} ${cust.lastName}`.toLowerCase();
                  const email = (cust.email || '').toLowerCase();
                  const phone = (cust.phone || '').toLowerCase();
                  if (!fullName.includes(q) && !email.includes(q) && !phone.includes(q)) {
                    return false;
                  }
                }
                return true;
              });

              if (filteredCustomers.length === 0) {
                return (
                  <div className="p-12 text-center text-xs text-gray-500 font-semibold space-y-2">
                    <Users className="w-8 h-8 text-gray-300 mx-auto" />
                    <p className="font-bold text-gray-700">No customers found</p>
                    <p className="text-[11px] text-gray-400">Try adjusting your search query or customer type filter.</p>
                  </div>
                );
              }

              return (
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-100 text-gray-500 uppercase font-bold border-b border-gray-150">
                      <th className="p-4">Client Name</th>
                      <th className="p-4">Email / Mobile</th>
                      <th className="p-4">Pricing Tier</th>
                      <th className="p-4">Community Scope</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 font-semibold text-gray-700">
                    {filteredCustomers.map((cust) => (
                      <tr key={cust._id} className="hover:bg-gray-50">
                        <td className="p-4 font-bold text-[#101A2D]">{cust.firstName} {cust.lastName}</td>
                        <td className="p-4 text-gray-500">
                          <p>{cust.email}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{cust.phone || 'No phone'}</p>
                        </td>
                        
                        {/* Pricing tier badges */}
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-0.5 border text-[9px] font-extrabold uppercase rounded-full ${
                            cust.customerType === 'WHOLESALE_BUYER' || cust.customerType === 'WHOLESALE'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                              : cust.customerType === 'V2CC_PMS_MEMBER' || cust.customerType === 'COMMUNITY'
                              ? 'text-red-700 bg-red-50 border-red-100'
                              : cust.customerType === 'SELLER_SUPPLIER'
                              ? 'text-purple-700 bg-purple-50 border-purple-100'
                              : cust.customerType === 'PARTNER_STORE'
                              ? 'text-blue-700 bg-blue-50 border-blue-100'
                              : 'text-gray-600 bg-gray-50 border-gray-250'
                          }`}>
                            {cust.customerType === 'V2CC_PMS_MEMBER'
                              ? 'V2CC-PMS Member'
                              : cust.customerType === 'WHOLESALE_BUYER'
                              ? 'Wholesale Buyer'
                              : cust.customerType === 'SELLER_SUPPLIER'
                              ? 'Seller / Supplier'
                              : cust.customerType === 'PARTNER_STORE'
                              ? 'Partner Store'
                              : cust.customerType === 'BUYER'
                              ? 'Buyer'
                              : cust.customerType}
                          </span>
                        </td>

                        {/* Community select picker */}
                        <td className="p-4">
                          <select
                            value={cust.communityId?._id || ''}
                            onChange={(e) => handleAssignCommunity(cust._id, e.target.value)}
                            disabled={cust.customerType === 'WHOLESALE' || updatingId === cust._id}
                            className="bg-gray-50 border border-gray-250 rounded-lg py-1 px-2.5 outline-none cursor-pointer text-xs"
                          >
                            <option value="">No Community</option>
                            {communities.map((c) => (
                              <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                          </select>
                        </td>

                        {/* Suspension status badge */}
                        <td className="p-4">
                          {cust.status === 'ACTIVE' ? (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-sm font-extrabold flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              Active
                            </span>
                          ) : (
                            <span className="bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-sm font-extrabold flex items-center gap-1 w-fit">
                              <XCircle className="w-3.5 h-3.5 text-red-650" />
                              Suspended
                            </span>
                          )}
                        </td>

                        {/* Actions: Edit Details & Suspend */}
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(cust)}
                            className="py-1 px-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 font-bold text-[10px] uppercase text-gray-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleToggleSuspension(cust._id, cust.status)}
                            disabled={updatingId === cust._id}
                            className={`py-1 px-2.5 rounded-lg border font-bold text-[10px] uppercase transition-colors cursor-pointer ${
                              cust.status === 'ACTIVE'
                                ? 'border-red-250 text-red-650 hover:bg-red-50'
                                : 'border-emerald-250 text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {cust.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>
      )}

      {/* EDIT CUSTOMER MODAL */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-gray-150">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-[#101A2D] uppercase tracking-wider flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#801414]" />
                Edit Customer Details
              </h3>
              <button
                onClick={() => setEditingCustomer(null)}
                className="text-gray-400 hover:text-black font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomerEdit} className="space-y-3 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-gray-500 font-bold">Email (Account Identifier)</label>
                <input
                  type="text"
                  disabled
                  value={editingCustomer.email}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-gray-700 font-bold">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-bold">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 font-bold">Mobile / Phone Number *</label>
                <input
                  type="tel"
                  placeholder="e.g. +1 (416) 555-0199"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-gray-700 font-bold">Account / Pricing Type</label>
                  <select
                    value={editForm.customerType}
                    onChange={(e) => setEditForm({ ...editForm, customerType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none cursor-pointer font-bold text-gray-900"
                  >
                    <option value="BUYER">Buyer (Retail Consumer)</option>
                    <option value="V2CC_PMS_MEMBER">V2CC-PMS Member (Community Pricing)</option>
                    <option value="WHOLESALE_BUYER">Wholesale Buyer (Bulk B2B Pricing)</option>
                    <option value="SELLER_SUPPLIER">Seller / Supplier (Merchant)</option>
                    <option value="PARTNER_STORE">Partner Store (Franchise/Retail)</option>
                    <option value="NORMAL">Normal Buyer (Legacy)</option>
                    <option value="COMMUNITY">Community Member (Legacy)</option>
                    <option value="WHOLESALE">Wholesale Buyer (Legacy)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-700 font-bold">Account Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none cursor-pointer font-bold text-gray-900"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 font-bold">Assigned Community</label>
                <select
                  value={editForm.communityId}
                  onChange={(e) => setEditForm({ ...editForm, communityId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none cursor-pointer font-bold text-gray-900"
                >
                  <option value="">None / Independent</option>
                  {communities.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="py-2 px-4 border border-gray-200 rounded-lg text-gray-600 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="py-2 px-5 bg-[#801414] hover:bg-[#600e0e] text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WHOLESALE B2B APPLICATIONS TAB */}
      {activeTab === 'wholesale' && (
        <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-gray-100 text-gray-500 uppercase font-bold border-b border-gray-150">
                <th className="p-4">Company Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Volume Expectation</th>
                <th className="p-4">Status</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4 text-right">Approvals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 font-semibold text-gray-700">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-[#101A2D]">
                    <p>{app.businessName}</p>
                    <span className="text-[10px] text-gray-400 font-semibold">{app.wholesaleCategory || 'Other'}</span>
                  </td>
                  <td className="p-4 text-gray-500">
                    <p>{app.contactPerson}</p>
                    <span className="text-[10px] text-gray-400 font-semibold">{app.email} • {app.phone}</span>
                  </td>
                  <td className="p-4 text-gray-500">{app.expectedOrderVolume}</td>
                  
                  <td className="p-4">
                    <span className={`inline-block px-2 py-0.5 border text-[9px] font-extrabold uppercase rounded-full ${
                      app.status === 'PENDING'
                        ? 'text-amber-700 bg-amber-50 border-amber-100'
                        : app.status === 'APPROVED'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                        : 'text-red-700 bg-red-50 border-red-100'
                    }`}>
                      {app.status}
                    </span>
                  </td>

                  <td className="p-4 text-gray-450">{formatDate(app.createdAt)}</td>

                  {/* Approvals buttons */}
                  <td className="p-4 text-right space-x-2">
                    {app.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleReviewWholesale(app._id, 'APPROVED')}
                          disabled={updatingId === app._id}
                          className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReviewWholesale(app._id, 'REJECTED')}
                          disabled={updatingId === app._id}
                          className="py-1 px-3 border border-red-200 hover:bg-red-50 text-red-650 rounded-lg text-[10px] font-bold uppercase transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Reviewed ✓</span>
                    )}
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
