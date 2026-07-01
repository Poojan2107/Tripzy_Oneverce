"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { getAuditLogs } from '../../../backend/actions/adminActions';

export default function AdminAuditLogTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const r = await getAuditLogs(page);
      if (r.success) { setLogs(r.data ?? []); setTotalPages(r.totalPages ?? 1); }
      setLoading(false);
    })();
  }, [page]);

  if (loading) {
    return <div className="text-center text-stone py-12"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-2" />Loading activity log...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-gold" />
        <span className="text-micro font-bold uppercase tracking-wider text-stone">Admin Activity Log</span>
        <span className="text-xs text-stone ml-auto">{logs.length} entries</span>
      </div>
      {logs.length === 0 && <p className="text-stone text-sm">No activity recorded yet.</p>}
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 p-3 bg-white border border-border rounded-xl text-sm">
            <Clock className="w-4 h-4 text-stone mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-night truncate">{log.action}</p>
              <p className="text-xs text-stone">
                {log.entity}{log.entityId ? ` #${log.entityId.slice(0, 8)}` : ""}
                {log.metadata ? ` — ${JSON.stringify(log.metadata).slice(0, 80)}` : ""}
              </p>
              <p className="text-[10px] text-stone mt-0.5">{new Date(log.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="btn-ghost text-stone hover:text-night disabled:opacity-30 min-h-[44px] min-w-[44px] flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button>
          <span className="text-xs text-stone">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn-ghost text-stone hover:text-night disabled:opacity-30 min-h-[44px] min-w-[44px] flex items-center justify-center"><ArrowRight className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}
