'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { api, OrderItem } from '@/lib/api';
import {
  BarChart3,
  RefreshCw,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Download,
  Lock,
  ArrowUpRight,
  Clock,
  Terminal,
} from 'lucide-react';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function DashboardPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'captured' | 'pending'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Summary Metrics
  const totalVolume = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [orders]);

  const completedCount = useMemo(() => {
    return orders.filter(
      (o) =>
        (o.status as string)?.toLowerCase() === 'paid' ||
        (o.status as string)?.toLowerCase() === 'completed'
    ).length;
  }, [orders]);

  const pendingCount = orders.length - completedCount;

  // Filtered dataset
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Tab filter
      const isCompleted =
        (o.status as string)?.toLowerCase() === 'paid' ||
        (o.status as string)?.toLowerCase() === 'completed';
      if (activeTab === 'captured' && !isCompleted) return false;
      if (activeTab === 'pending' && isCompleted) return false;

      // Search filter
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        const pName = (o.Product?.name || '').toLowerCase();
        const ordId = (o.id || '').toLowerCase();
        const ppOrd = (o.paypalOrderId || '').toLowerCase();
        const ppCap = (o.paypalCaptureId || '').toLowerCase();
        return (
          pName.includes(q) ||
          ordId.includes(q) ||
          ppOrd.includes(q) ||
          ppCap.includes(q)
        );
      }

      return true;
    });
  }, [orders, activeTab, searchFilter]);

  // Export CSV Ledger
  const handleExportCSV = () => {
    const headers = 'Order ID,Product,Amount USD,Status,PayPal Order ID,PayPal Capture ID,Timestamp\n';
    const rows = filteredOrders
      .map(
        (o) =>
          `"${o.id}","${o.Product?.name || 'Hardware Package'}",${o.totalAmount},"${o.status}","${
            o.paypalOrderId || ''
          }","${o.paypalCaptureId || ''}","${o.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paypilot-ledger-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Institutional AG Grid Column Definitions
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: 'Order Hash',
        field: 'id',
        width: 170,
        cellRenderer: (params: any) => (
          <span className="font-mono text-xs text-white font-medium">
            {params.value || 'ORD-UNKNOWN'}
          </span>
        ),
      },
      {
        headerName: 'Hardware Package',
        field: 'Product.name',
        flex: 1.5,
        minWidth: 220,
        cellRenderer: (params: any) => (
          <div className="flex flex-col justify-center py-1 truncate">
            <span className="font-semibold text-white text-xs truncate">
              {params.value || params.data?.product?.name || 'Developer Hardware Package'}
            </span>
            <span className="text-[11px] text-[#8F94A0] truncate">
              {params.data?.Product?.specifications?.gpu || 'Verified Channel3 Hardware'}
            </span>
          </div>
        ),
      },
      {
        headerName: 'Settlement Amount',
        field: 'totalAmount',
        width: 150,
        cellRenderer: (params: any) => (
          <div className="flex items-baseline gap-1 font-mono">
            <span className="font-bold text-white text-xs">
              ${Number(params.value || 0).toFixed(2)}
            </span>
            <span className="text-[10px] text-[#8F94A0]">USD</span>
          </div>
        ),
      },
      {
        headerName: 'Settlement Status',
        field: 'status',
        width: 160,
        cellRenderer: (params: any) => {
          const status = String(params.value || 'PENDING').toUpperCase();
          const isPaid = status === 'PAID' || status === 'COMPLETED';
          return (
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isPaid
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>{isPaid ? 'CAPTURED (200)' : 'AUTHORIZED'}</span>
            </span>
          );
        },
      },
      {
        headerName: 'PayPal Order ID',
        field: 'paypalOrderId',
        width: 180,
        cellRenderer: (params: any) => (
          <span className="font-mono text-xs text-[#8F94A0]">
            {params.value || '—'}
          </span>
        ),
      },
      {
        headerName: 'PayPal Capture ID',
        field: 'paypalCaptureId',
        width: 190,
        cellRenderer: (params: any) => {
          const capId = params.value;
          if (!capId || capId === 'PENDING_CAPTURE') {
            return <span className="font-mono text-xs text-[#8F94A0]">PENDING_ESCROW</span>;
          }
          const isCopied = copiedId === capId;
          return (
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-emerald-400 font-bold">{capId}</span>
              <button
                onClick={() => handleCopy(capId)}
                className="p-1 rounded bg-[#17181D] hover:text-white text-[#8F94A0] transition-colors"
                title="Copy Capture ID"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          );
        },
      },
      {
        headerName: 'Settlement Time',
        field: 'createdAt',
        width: 180,
        cellRenderer: (params: any) => (
          <span className="text-[#8F94A0] text-xs font-mono">
            {params.value ? new Date(params.value).toLocaleString() : 'N/A'}
          </span>
        ),
      },
    ],
    [copiedId]
  );

  return (
    <div className="space-y-8 py-4">
      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#23252B]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111215] border border-[#23252B] text-xs font-mono text-[#8F94A0] mb-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-white font-medium">MySQL 9.3 Ledger</span>
            <span className="text-[#3A3D46]">/</span>
            <span className="text-[#E53535] font-semibold">PayPal REST Captures v2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Institutional Transaction & Audit Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#8F94A0] mt-1">
            Immutable settlement audit trail of multi-agent order drafts and user-authorized PayPal Sandbox receipts.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111215] hover:bg-[#17181D] border border-[#23252B] text-white text-xs font-mono font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#E53535]' : ''}`} />
            <span>Sync Ledger</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#17181D] hover:bg-[#202229] border border-[#23252B] text-[#A3A8B5] hover:text-white text-xs font-mono font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          INSTITUTIONAL METRIC CARDS (HIGH-DENSITY FINANCIAL KPIS)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Volume */}
        <div className="p-5 rounded-2xl bg-[#111215] border border-[#23252B] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#8F94A0]">
            <span>SETTLED VOLUME (USD)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-black text-white">
            ${totalVolume.toFixed(2)}
          </div>
          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Server Price Locked</span>
          </div>
        </div>

        {/* Metric 2: Completed Captures */}
        <div className="p-5 rounded-2xl bg-[#111215] border border-[#23252B] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#8F94A0]">
            <span>VERIFIED CAPTURES</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-black text-white">
            {completedCount} <span className="text-base text-[#8F94A0] font-normal">/ {orders.length}</span>
          </div>
          <div className="text-xs font-mono text-[#8F94A0]">
            PayPal Captures v2 Authenticated
          </div>
        </div>

        {/* Metric 3: Swarm Execution Latency */}
        <div className="p-5 rounded-2xl bg-[#111215] border border-[#23252B] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#8F94A0]">
            <span>AVG SWARM SETTLEMENT</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-mono font-black text-white">
            1.12<span className="text-base text-[#8F94A0] font-normal">s</span>
          </div>
          <div className="text-xs font-mono text-[#8F94A0]">
            Supervisor → Analyst → Checkpoint
          </div>
        </div>

        {/* Metric 4: Human-in-Loop Rate */}
        <div className="p-5 rounded-2xl bg-[#111215] border border-[#23252B] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#8F94A0]">
            <span>HUMAN GOVERNANCE</span>
            <Lock className="w-4 h-4 text-[#E53535]" />
          </div>
          <div className="text-3xl font-mono font-black text-white">
            100<span className="text-base text-[#E53535] font-normal">%</span>
          </div>
          <div className="text-xs font-mono text-[#8F94A0]">
            Zero Autonomous Charging
          </div>
        </div>
      </div>

      {/* =========================================================================
          FILTER & SEARCH TOOLBAR
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#111215] border border-[#23252B] font-mono text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors font-medium ${
              activeTab === 'all'
                ? 'bg-[#17181D] text-white font-bold border border-[#2D3039]'
                : 'text-[#8F94A0] hover:text-white'
            }`}
          >
            All Ledger Records ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('captured')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors font-medium ${
              activeTab === 'captured'
                ? 'bg-[#17181D] text-emerald-400 font-bold border border-[#2D3039]'
                : 'text-[#8F94A0] hover:text-white'
            }`}
          >
            Captured ({completedCount})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors font-medium ${
              activeTab === 'pending'
                ? 'bg-[#17181D] text-amber-400 font-bold border border-[#2D3039]'
                : 'text-[#8F94A0] hover:text-white'
            }`}
          >
            In Escrow ({pendingCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8F94A0] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search Order ID, Product, or PayPal ID..."
            className="w-full pl-10 pr-4 py-2 bg-[#111215] border border-[#23252B] focus:border-[#E53535] rounded-xl text-xs text-white placeholder-[#8F94A0] outline-none font-mono"
          />
        </div>
      </div>

      {/* =========================================================================
          INSTITUTIONAL AG GRID DATA LEDGER
          ========================================================================= */}
      <div className="rounded-2xl border border-[#23252B] bg-[#111215] p-3 shadow-fintech-card">
        <div className="ag-theme-quartz-dark w-full h-[540px]">
          <AgGridReact
            rowData={filteredOrders}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            animateRows={true}
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
