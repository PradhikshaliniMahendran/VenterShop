'use client';

import React, { useEffect, useState } from 'react';
import { Clock, ShieldAlert } from 'lucide-react';

interface IAuditLog {
  _id: string;
  adminId?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  action: string;
  targetModel: string;
  targetId?: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch('/api/admin/audit-logs');
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
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
          <Clock className="w-5 h-5 text-[#E53935]" />
          Operations Audit Logs
        </h1>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-150 p-12 text-center text-gray-500 max-w-md mx-auto">
          No audit logs recorded in the system yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-gray-100 text-gray-500 uppercase font-bold border-b border-gray-150">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Administrator</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Schema</th>
                <th className="p-4">Details Summary</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
              {logs.map((log) => {
                const adminName = log.adminId ? `${log.adminId.firstName} ${log.adminId.lastName}` : 'System Agent';

                return (
                  <tr key={log._id} className="hover:bg-gray-55/30">
                    <td className="p-4 text-gray-500 font-mono text-[10px]">{formatDate(log.createdAt)}</td>
                    <td className="p-4">
                      <p className="font-bold text-[#1A2A4A]">{adminName}</p>
                      {log.adminId && <span className="text-[10px] text-gray-400 font-semibold">{log.adminId.email}</span>}
                    </td>
                    <td className="p-4">
                      <span className="bg-red-50 text-[#E53935] border border-red-100 px-2 py-0.5 rounded-sm font-extrabold text-[10px] uppercase">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 font-mono text-[10px]">{log.targetModel}</td>
                    <td className="p-4 text-gray-600 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="p-4 text-gray-450 font-mono text-[10px]">{log.ipAddress || 'unknown'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
