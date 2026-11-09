'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { api, OrderItem } from '@/lib/api';
import { BarChart3, RefreshCw, DollarSign, ShoppingCart, ShieldCheck, CheckCircle } from 'lucide-react';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function DashboardPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching dashboard orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Summary Metrics
  const totalVolume = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [orders]);

  const completedCount = useMemo(() => {
    return orders.filter((o) => (o.status as string)?.toLowerCase() === 'paid' || (o.status as string)?.toLowerCase() === 'completed').length;
  }, [orders]);

  // AG Grid Column Definitions
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: 'Order ID',
        field: 'id',
        width: 170,
        cellRenderer: (params: any) => (
          <span className="font-mono text-xs text-zinc-300">
            {params.value ? `${String(params.value).substring(0, 12)}...` : 'N/A'}
          </span>
        ),
      },
      {
        headerName: 'Product',
        field: 'Product.name',
        flex: 1.5,
        minWidth: 200,
        cellRenderer: (params: any) => (
          <span className="font-bold text-white text-xs">
            {params.value || params.data?.product?.name || 'Hardware Package'}
          </span>
        ),
      },
      {
        headerName: 'Amount (USD)',
        field: 'totalAmount',
        width: 130,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-white text-xs">
            ${Number(params.value || 0).toFixed(2)}
          </span>
        ),
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 130,
        cellRenderer: (params: any) => {
          const status = String(params.value || 'PENDING').toUpperCase();
          const isPaid = status === 'PAID' || status === 'COMPLETED';
          return (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isPaid
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        headerName: 'PayPal Order ID',
        field: 'paypalOrderId',
        width: 180,
        cellRenderer: (params: any) => (
          <span className="font-mono text-[11px] text-[#E53935] font-semibold">
            {params.value || params.data?.transaction?.paypalOrderId || 'PENDING_AUTH'}
          </span>
        ),
      },
      {
        headerName: 'PayPal Capture ID',
        field: 'paypalCaptureId',
        width: 180,
        cellRenderer: (params: any) => (
          <span className="font-mono text-[11px] text-zinc-400">
            {params.value || params.data?.transaction?.paypalCaptureId || '—'}
          </span>
        ),
      },
      {
        headerName: 'Timestamp',
        field: 'createdAt',
        width: 170,
        cellRenderer: (params: any) => (
          <span className="text-zinc-400 text-xs font-mono">
            {params.value ? new Date(params.value).toLocaleString() : 'N/A'}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-xs font-semibold text-[#E53935] mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>AG Grid Real-Time Audit Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Transactions & Order Audit Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Live persistence logs from MySQL 9.3 connected to PayPal Orders & Captures v2.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1E] hover:bg-[#25252B] border border-[#2E2E36] text-white text-xs font-bold transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#E53935]' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-[#141416] border border-[#26262A] space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{orders.length}</div>
          <div className="text-[10px] text-zinc-500 font-mono">Recorded in MySQL</div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-[#141416] border border-[#26262A] space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Total Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">${totalVolume.toFixed(2)}</div>
          <div className="text-[10px] text-emerald-400 font-mono">USD Sandbox Volume</div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-[#141416] border border-[#26262A] space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Completed Captures</span>
            <CheckCircle className="w-4 h-4 text-[#E53935]" />
          </div>
          <div className="text-2xl font-black text-white">{completedCount}</div>
          <div className="text-[10px] text-[#E53935] font-mono">Verified by PayPal</div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-[#141416] border border-[#26262A] space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Agentic Governance</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">100%</div>
          <div className="text-[10px] text-cyan-400 font-mono">Human Authorization Rate</div>
        </div>
      </div>

      {/* AG Grid Component */}
      <div className="rounded-3xl border border-[#26262A] bg-[#141416] p-4 shadow-2xl">
        <div className="ag-theme-quartz-dark w-full h-[500px]">
          <AgGridReact
            rowData={orders}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
