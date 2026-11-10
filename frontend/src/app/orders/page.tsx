'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CheckCircle2, ShoppingBag, Eye, Download } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const orders = [
    {
      id: 'ORD-2026-8842',
      productName: 'Lenovo LOQ 15 Gaming & ML Laptop',
      amount: '$749.00 USD',
      paypalOrderId: '57H46888ER9629107',
      paypalCaptureId: '8B72938104889214',
      status: 'CAPTURED',
      statusColor: 'bg-emerald-100 text-emerald-800',
      date: 'Today, 10:25 AM',
      items: 1,
      escrowStatus: 'Released to Merchant',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders & Receipts</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Multi-agent purchase orders authorized and captured via PayPal Sandbox
            </p>
          </div>

          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0070BA] hover:bg-[#005ea6] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Launch Shopping Studio</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4">Locked Total</th>
                  <th className="py-3 px-4">PayPal Order ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Escrow Rails</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0070BA]">{order.id}</td>
                    <td className="py-3 px-4 font-medium">{order.productName}</td>
                    <td className="py-3 px-4 font-bold font-mono text-gray-900">{order.amount}</td>
                    <td className="py-3 px-4 font-mono text-gray-600">{order.paypalOrderId}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${order.statusColor}`}>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-medium">{order.escrowStatus}</td>
                    <td className="py-3 px-4 text-gray-500">{order.date}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href="/studio"
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-[#0070BA] transition-colors"
                          title="View in Studio"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
