'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CheckCircle2, Download, Filter } from 'lucide-react';

export default function TransactionsPage() {
  const transactions = [
    {
      id: 'TXN-9041284',
      orderId: 'ORD-2026-8842',
      paypalOrderId: '57H46888ER9629107',
      captureId: '8B72938104889214',
      payer: 'Abhishek UthukotaSriram',
      amount: '$749.00 USD',
      status: 'CAPTURED',
      date: 'Today, 10:25 AM',
      method: 'PayPal Balance / Instant',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Financial Ledger & Transactions</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Verified PayPal sandbox transaction settlement and capture audit log
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0070BA] text-white rounded-lg text-xs font-semibold hover:bg-[#005ea6] shadow-2xs">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">PayPal Capture ID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Settled At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0070BA]">{txn.id}</td>
                    <td className="py-3 px-4 font-mono text-gray-700">{txn.orderId}</td>
                    <td className="py-3 px-4 font-mono text-gray-600">{txn.captureId}</td>
                    <td className="py-3 px-4 font-bold font-mono text-gray-900">{txn.amount}</td>
                    <td className="py-3 px-4 text-gray-600">{txn.method}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{txn.date}</td>
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
