'use client';

import React, { useEffect, useState } from 'react';
import { api, OrderItem } from '@/lib/api';
import { Receipt, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-xs font-semibold text-[#E53935] mb-2">
          <Receipt className="w-3.5 h-3.5" />
          <span>Verified Purchase History</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Your Orders & Receipts
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Every purchase is authorized by you and verified via PayPal Sandbox Orders & Captures v2.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500 font-mono text-xs">
          Loading order history from MySQL...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-3xl bg-[#141416] border border-[#242426] space-y-4">
          <Receipt className="w-12 h-12 text-zinc-600 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-white">No Orders Yet</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Ask PayPilot Assistant for product recommendations and checkout with PayPal Sandbox!
            </p>
          </div>
          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white text-xs font-bold shadow-lg shadow-[#E53935]/20"
          >
            <span>Start Shopping with AI</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isCompleted = (order.status as string)?.toLowerCase() === 'paid' || (order.status as string)?.toLowerCase() === 'completed';
            return (
              <div
                key={order.id}
                className="p-6 rounded-2xl bg-[#141416] border border-[#26262A] hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {order.status}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {order.Product?.name || (order as any).product?.name || 'Verified Hardware System'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-zinc-400">
                    <span>Order: <strong className="text-zinc-200">{order.id.substring(0, 14)}...</strong></span>
                    {order.paypalOrderId && (
                      <span>PayPal Order: <strong className="text-[#E53935]">{order.paypalOrderId}</strong></span>
                    )}
                    {order.paypalCaptureId && (
                      <span>Capture ID: <strong className="text-emerald-400">{order.paypalCaptureId}</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800 gap-1 shrink-0">
                  <div className="text-xl font-black text-white">
                    ${Number(order.totalAmount).toFixed(2)}
                    <span className="text-xs font-mono text-zinc-400 font-normal ml-1">USD</span>
                  </div>
                  <Link
                    href={`/dashboard`}
                    className="text-[11px] text-[#E53935] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View in Audit Grid</span>
                    <ExternalLink className="w-3 h-3" />
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
