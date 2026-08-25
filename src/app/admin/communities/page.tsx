'use client';

import React, { useEffect, useState } from 'react';
import { Users, Plus, Edit, Trash2, CheckCircle, XCircle, Clock, UserCheck, UserX } from 'lucide-react';

interface ICommunity {
  _id: string;
  name: string;
  description: string;
  membershipCode: string;
  memberCount: number;
  isActive: boolean;
  createdAt: string;
}

interface IPendingRequest {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  communityId: { _id: string; name: string; membershipCode: string } | null;
  communityJoinDate: string;
  communityStatus: string;
}

export default function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<ICommunity[]>([]);
  const [pendingRequests, setPendingRequests] = useState<IPendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'communities' | 'pending'>('communities');

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({ name: '', description: '', membershipCode: '', isActive: true });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/communities?pending=true');
      if (res.ok) {
        const data = await res.json();
        setCommunities(data.communities || []);
        setPendingRequests(data.pendingRequests || []);
      }
    } catch (e) {
      console.error('Failed to load communities:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormValues((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    const payload = { communityId: editingId, ...formValues };
    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/communities', {
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
        setFormError(data.error || 'Failed to save community group');
      }
    } catch (err) {
      setFormError('Network error. Failed to save community.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteCommunity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this community group?')) return;
    try {
      const res = await fetch(`/api/admin/communities?id=${id}`, { method: 'DELETE' });
      if (res.ok) loadData();
      else { const data = await res.json(); alert(data.error || 'Failed to delete community'); }
    } catch (e) { alert('Error deleting community'); }
  };

  const handleMembershipAction = async (userId: string, action: 'approve' | 'reject') => {
    setActionLoading(userId + action);
    try {
      const res = await fetch('/api/admin/communities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });
      if (res.ok) {
        await loadData();
        // If no more pending after action, stay on pending tab
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update membership');
      }
    } catch (e) {
      alert('Error processing membership action');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenEdit = (comm: ICommunity) => {
    setEditingId(comm._id);
    setFormValues({ name: comm.name, description: comm.description, membershipCode: comm.membershipCode, isActive: comm.isActive });
    setFormOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormValues({ name: '', description: '', membershipCode: '', isActive: true });
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
          <Users className="w-5 h-5 text-[#E53935]" />
          Community Groups Administration
        </h1>
        
        {!formOpen && activeTab === 'communities' && (
          <button
            onClick={() => { resetForm(); setFormOpen(true); }}
            className="flex items-center gap-1.5 py-1.5 px-4 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Community Group</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-150 bg-gray-50/50 rounded-lg p-1 gap-1 max-w-sm">
        <button
          onClick={() => { setActiveTab('communities'); setFormOpen(false); resetForm(); }}
          className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${activeTab === 'communities' ? 'bg-[#1A2A4A] text-white shadow-xs' : 'text-gray-500 hover:text-black'}`}
        >
          Community Groups
        </button>
        <button
          onClick={() => { setActiveTab('pending'); setFormOpen(false); }}
          className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'pending' ? 'bg-[#E53935] text-white shadow-xs' : 'text-gray-500 hover:text-black'}`}
        >
          <Clock className="w-3.5 h-3.5" />
          Pending Requests
          {pendingRequests.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${activeTab === 'pending' ? 'bg-white text-[#E53935]' : 'bg-[#E53935] text-white'}`}>
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* PENDING REQUESTS TAB */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-150 p-12 text-center text-gray-400 space-y-2">
              <CheckCircle className="w-10 h-10 mx-auto text-emerald-300" />
              <p className="font-bold text-sm text-gray-500">No pending community requests.</p>
              <p className="text-[10px]">All membership requests have been processed.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-amber-50 text-amber-700 uppercase font-bold border-b border-amber-100">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Requested Community</th>
                    <th className="p-4">Request Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {pendingRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-amber-50/30">
                      <td className="p-4">
                        <p className="font-bold text-[#101A2D]">{req.firstName} {req.lastName}</p>
                        <p className="text-[10px] text-gray-400">{req.email}</p>
                      </td>
                      <td className="p-4">
                        {req.communityId ? (
                          <div>
                            <p className="font-bold text-[#1A2A4A]">{req.communityId.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono">{req.communityId.membershipCode}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">Unknown</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(req.communityJoinDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-4">
                        <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-sm font-extrabold flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" />
                          PENDING
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleMembershipAction(req._id, 'approve')}
                            disabled={actionLoading === req._id + 'approve'}
                            className="flex items-center gap-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] uppercase transition-colors disabled:opacity-50"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            {actionLoading === req._id + 'approve' ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleMembershipAction(req._id, 'reject')}
                            disabled={actionLoading === req._id + 'reject'}
                            className="flex items-center gap-1 py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-bold text-[10px] uppercase transition-colors disabled:opacity-50"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            {actionLoading === req._id + 'reject' ? 'Rejecting...' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* COMMUNITIES TAB */}
      {activeTab === 'communities' && (
        <>
          {/* Add / Edit Overlay Form */}
          {formOpen && (
            <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs max-w-xl space-y-6">
              <h3 className="font-extrabold text-sm text-[#101A2D] uppercase border-b border-gray-100 pb-2">
                {editingId ? 'Edit Community Details' : 'Create New Community Group'}
              </h3>

              {formError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 text-xs font-bold">
                  ⚠️ {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold block mb-1">Community Group Name *</label>
                  <input
                    type="text" name="name" required placeholder="e.g. Toronto Tamil Community"
                    value={formValues.name} onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-250 rounded-lg outline-none text-gray-900 font-bold focus:bg-white focus:border-[#1A2A4A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold block mb-1">Membership Code</label>
                  <input
                    type="text" name="membershipCode" placeholder="e.g. TORONTO100"
                    value={formValues.membershipCode} onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-250 rounded-lg outline-none uppercase font-mono text-gray-900 font-bold focus:bg-white focus:border-[#1A2A4A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold block mb-1">Description *</label>
                  <textarea
                    name="description" required rows={3}
                    placeholder="Describe targeted region, member eligibility and benefits..."
                    value={formValues.description} onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-250 rounded-lg outline-none resize-none text-gray-900 font-bold focus:bg-white focus:border-[#1A2A4A]"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" name="isActive" checked={formValues.isActive} onChange={handleInputChange} className="w-4 h-4 accent-[#1A2A4A]" />
                  <span className="text-gray-700 font-bold">Active Community Listing</span>
                </label>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button type="button" onClick={() => { setFormOpen(false); resetForm(); }} className="py-2 px-5 border border-gray-200 hover:bg-gray-50 rounded-lg font-bold text-gray-600" disabled={formSubmitting}>Cancel</button>
                  <button type="submit" className="py-2 px-5 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg font-bold shadow-xs transition-colors" disabled={formSubmitting}>
                    {formSubmitting ? 'Saving...' : 'Save Community Group'}
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
                    <th className="p-4">Group Name</th>
                    <th className="p-4">Membership Code</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Members</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {communities.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-gray-400">No community groups found. Create one to get started.</td>
                    </tr>
                  ) : communities.map((comm) => (
                    <tr key={comm._id} className="hover:bg-gray-50">
                      <td className="p-4 font-bold text-[#101A2D]">{comm.name}</td>
                      <td className="p-4 text-gray-500 font-mono">{comm.membershipCode}</td>
                      <td className="p-4 text-gray-500 max-w-xs truncate">{comm.description}</td>
                      <td className="p-4 font-bold text-[#1A2A4A]">{comm.memberCount || 0}</td>
                      <td className="p-4">
                        {comm.isActive ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-sm font-extrabold flex items-center gap-1 w-fit">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Active
                          </span>
                        ) : (
                          <span className="bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-sm font-extrabold flex items-center gap-1 w-fit">
                            <XCircle className="w-3.5 h-3.5" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleOpenEdit(comm)} className="p-1.5 text-gray-400 hover:text-black rounded-md hover:bg-gray-100 transition-colors inline-flex items-center" title="Edit Group">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteCommunity(comm._id)} className="p-1.5 text-gray-400 hover:text-red-650 rounded-md hover:bg-red-50 transition-colors inline-flex items-center" title="Delete Group">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
