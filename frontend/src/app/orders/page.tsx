'use client';

import React, { useEffect, useState } from 'react';
import { api, OrderItem } from '@/lib/api';
import { Receipt, CheckCircle2, Clock, ExternalLink, Copy, Check, ShieldCheck, ArrowRight, Bot } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    api.getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A] border border-white/[0.08] text-xs font-mono text-slate-300 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-white font-medium">PayPal Capture Receipts</span>
            <span className="text-slate-600">/</span>
            <span className="text-paypal-blue font-semibold">Immutable MySQL Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Purchase Receipts & Settlement History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Every transaction authorized through your human-in-the-loop checkpoint is committed with official PayPal Capture IDs.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-white/[0.08] text-xs font-mono font-semibold text-white transition-all shadow-sm"
        >
          <span>Open AG Grid Ledger</span>
          <ArrowRight className="w-3.5 h-3.5 text-paypal-blue" />
        </Link>
      </div>

      {/* =========================================================================
          RECEIPTS LIST
          ========================================================================= */}
      {loading ? (
        <div className="text-center py-24 text-slate-400 font-mono text-xs">
          Loading verified receipts from database...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-2xl bg-[#0F172A] border border-white/[0.08] space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#1E293B] border border-white/[0.08] flex items-center justify-center text-slate-400">
            <Receipt className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-sans">No Transactions Recorded Yet</h3>
            <p className="text-xs text-slate-400 font-sans">
              Ask the PayPilot Assistant for a hardware recommendation and authorize checkout with PayPal Sandbox!
            </p>
          </div>
          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0070BA] hover:bg-[#005EA6] text-white text-xs font-bold uppercase tracking-wider shadow-fintech-glow transition-all hover:scale-105"
          >
            <Bot className="w-4 h-4" />
            <span>Launch Shopping Assistant</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isCompleted =
              (order.status as string)?.toLowerCase() === 'paid' ||
              (order.status as string)?.toLowerCase() === 'completed';
            const capId = order.paypalCaptureId;

            return (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#0F172A] border border-white/[0.08] hover:border-paypal-blue/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm"
              >
                {/* Left Info */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span>{isCompleted ? 'CAPTURED (200 OK)' : 'IN ESCROW'}</span>
                    </span>

                    <span className="text-xs font-mono text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-base font-bold text-white tracking-tight font-sans">
                    {order.Product?.name || (order as any).product?.name || 'Verified Developer Workstation'}
                  </h3>

                  {/* Monospace IDs Trail */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-mono text-slate-400">
                    <span>
                      Order Ref: <strong className="text-white">{order.id}</strong>
                    </span>
                    {order.paypalOrderId && (
                      <span>
                        PayPal Order: <strong className="text-slate-300">{order.paypalOrderId}</strong>
                      </span>
                    )}
                    {capId && capId !== 'PENDING_CAPTURE' && (
                      <span className="flex items-center gap-1.5">
                        Capture ID: <strong className="text-emerald-400">{capId}</strong>
                        <button
                          onClick={() => handleCopy(capId)}
                          className="p-1 rounded bg-[#1E293B] hover:text-white text-slate-300 transition-colors"
                          title="Copy Capture ID"
                        >
                          {copiedId === capId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Price & Audit Link */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-white/[0.08] gap-2 shrink-0">
                  <div className="text-2xl font-mono font-black text-white">
                    ${Number(order.totalAmount).toFixed(2)}
                    <span className="text-xs text-slate-400 font-normal ml-1">USD</span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="text-xs font-mono text-paypal-blue hover:text-white flex items-center gap-1 font-semibold transition-colors"
                  >
                    <span>Inspect in AG Grid</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
