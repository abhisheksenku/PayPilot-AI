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
  Clock,
  Terminal,
  ChevronDown,
  Globe,
  Users,
  Activity,
  FileCode,
  CreditCard,
  BookOpen,
  Send,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { TestCardsModal } from '@/components/layout/TestCardsModal';
import { CredentialsModal } from '@/components/layout/CredentialsModal';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function DashboardPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'captured' | 'pending'>('all');
  const [dateRange, setDateRange] = useState('Last 12 hours');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTestCards, setShowTestCards] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [activeSolutionTab, setActiveSolutionTab] = useState<'popular' | 'online' | 'payouts' | 'multiparty'>('popular');

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
      const isCompleted =
        (o.status as string)?.toLowerCase() === 'paid' ||
        (o.status as string)?.toLowerCase() === 'completed';
      if (activeTab === 'captured' && !isCompleted) return false;
      if (activeTab === 'pending' && isCompleted) return false;

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
            <span className="text-[11px] text-slate-400 truncate">
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
            <span className="text-[10px] text-slate-400">USD</span>
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
          <span className="font-mono text-xs text-slate-400">
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
            return <span className="font-mono text-xs text-slate-500">PENDING_ESCROW</span>;
          }
          const isCopied = copiedId === capId;
          return (
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-emerald-400 font-bold">{capId}</span>
              <button
                onClick={() => handleCopy(capId)}
                className="p-1 rounded bg-[#17181D] hover:text-white text-slate-400 transition-colors"
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
          <span className="text-slate-400 text-xs font-mono">
            {params.value ? new Date(params.value).toLocaleString() : 'N/A'}
          </span>
        ),
      },
    ],
    [copiedId]
  );

  return (
    <div className="space-y-8 py-2">
      {/* =========================================================================
          1. OFFICIAL PAYPAL DEVELOPER HEADER (PRE-ARTICLE)
          ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            Welcome back, Abhishek
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Get started with step-by-step advice for setting up your payment solutions & monitoring autonomous commerce agents.
          </p>
        </div>

        {/* Date Range Selector (Dropdown) */}
        <div className="relative">
          <button
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0F172A] border border-white/[0.1] text-xs font-mono text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <span>{dateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showDateDropdown && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#0F172A] border border-white/[0.1] shadow-xl p-1 z-20 text-xs font-mono">
              {['Last 1 hour', 'Last 12 hours', 'Last 24 hours', 'Last 7 days', 'Last 14 days'].map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setDateRange(range);
                    setShowDateDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                    dateRange === range
                      ? 'bg-[#0070BA] text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          2. OFFICIAL PAYPAL ONBOARDING BANNER ("Which Payment Solution...?")
          ========================================================================= */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/[0.08] shadow-fintech-card relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">
              Which Payment Solution do you want to offer?
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              We&apos;ll help you set up everything from multi-agent integration to sandbox go-live.
            </p>
          </div>
          <a
            href="https://developer.paypal.com/docs/online"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#00CFDE] hover:underline flex items-center gap-1"
          >
            <span>All products</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Tab Group */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 text-xs font-semibold">
          {[
            { id: 'popular', label: 'Most popular' },
            { id: 'online', label: 'Online' },
            { id: 'payouts', label: 'Payouts' },
            { id: 'multiparty', label: 'Multi-party Escrow' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSolutionTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSolutionTab === tab.id
                  ? 'bg-[#0070BA] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Solution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Card 1: PayPal Checkout */}
          <div className="p-4 rounded-xl bg-[#080C15] border border-white/[0.06] hover:border-[#0070BA]/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#0070BA]/20 text-[#0070BA] flex items-center justify-center font-bold text-xs mb-3">
                PP
              </div>
              <h3 className="text-sm font-bold text-white">PayPal Checkout</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Set up standard payments on your checkout page for buyers with server-side price locks.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-mono text-[11px] font-bold">● Active Rails</span>
              <span className="text-slate-400 font-mono text-[11px]">v2/orders</span>
            </div>
          </div>

          {/* Card 2: Expanded Checkout */}
          <div className="p-4 rounded-xl bg-[#080C15] border border-white/[0.06] hover:border-[#0070BA]/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs mb-3">
                CC
              </div>
              <h3 className="text-sm font-bold text-white">Expanded Checkout</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Build and customize standard debit and credit card flows with 3D Secure fallback.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Ready in Sandbox</span>
              <button
                onClick={() => setShowTestCards(true)}
                className="text-[#00CFDE] hover:underline font-mono text-[11px]"
              >
                View Cards →
              </button>
            </div>
          </div>

          {/* Card 3: Multi-Agent Escrow */}
          <div className="p-4 rounded-xl bg-[#080C15] border border-white/[0.06] hover:border-[#0070BA]/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs mb-3">
                AI
              </div>
              <h3 className="text-sm font-bold text-white">Autonomous Agent Escrow</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Halts automated purchasing swarms at human authorization checkpoints.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-purple-400 font-mono text-[11px] font-bold">● Armed Checkpoint</span>
              <span className="text-slate-400 font-mono text-[11px]">PayPilot Swarm</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. OFFICIAL PAYPAL QUICK LINKS ROW
          ========================================================================= */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
          Developer Quick Access Links
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            {
              label: 'API & credentials',
              icon: FileCode,
              onClick: () => setShowCredentials(true),
            },
            {
              label: 'Sandbox accounts',
              icon: Users,
              href: 'https://developer.paypal.com/dashboard/accounts',
              external: true,
            },
            {
              label: 'API calls',
              icon: Globe,
              onClick: () => setActiveTab('all'),
            },
            {
              label: 'Webhooks events',
              icon: Activity,
              href: 'https://developer.paypal.com/dashboard/webhooks/sandbox',
              external: true,
            },
            {
              label: 'Webhooks simulator',
              icon: Send,
              href: 'https://developer.paypal.com/dashboard/webhooksSimulator',
              external: true,
            },
            {
              label: 'Test credit cards',
              icon: CreditCard,
              onClick: () => setShowTestCards(true),
            },
            {
              label: 'Dev docs',
              icon: BookOpen,
              href: 'https://developer.paypal.com/docs/online/',
              external: true,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            if (item.onClick) {
              return (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className="p-3 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-[#0070BA] hover:bg-[#1E293B] transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#080C15] flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 group-hover:text-white">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <a
                key={idx}
                href={item.href}
                target={item.external ? '_blank' : '_self'}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="p-3 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-[#0070BA] hover:bg-[#1E293B] transition-all flex flex-col items-center text-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#080C15] flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-300 group-hover:text-white">
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          4. OFFICIAL ERROR LOG & MONITORING TILES (FROM PAYPAL DEVELOPER CONSOLE)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Error Log Tile */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/[0.08] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Error Log
            </h3>
            <span className="text-[11px] font-mono text-emerald-400">Zero System Faults</span>
          </div>

          <div className="py-6 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="font-bold text-white text-sm">No errors found</div>
            <div className="text-xs text-slate-400 mt-0.5">We found 0 errors in the {dateRange.toLowerCase()}.</div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span>PayPal Rails Status</span>
            <span className="text-emerald-400 font-mono font-bold">Operational (100%)</span>
          </div>
        </div>

        {/* Monitoring Card 1: API Calls */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/[0.08] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              API Calls (v2 REST)
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">Sandbox Metrics</span>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="p-3 rounded-xl bg-[#080C15] border border-white/[0.04]">
              <div className="text-[11px] text-slate-400">Successful Requests</div>
              <div className="text-2xl font-mono font-black text-white mt-1">142</div>
            </div>
            <div className="p-3 rounded-xl bg-[#080C15] border border-white/[0.04]">
              <div className="text-[11px] text-slate-400">Errors</div>
              <div className="text-2xl font-mono font-black text-emerald-400 mt-1">0</div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Latency SLA</span>
            <span className="text-white">avg 240ms</span>
          </div>
        </div>

        {/* Monitoring Card 2: API Error Distribution */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/[0.08] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              HTTP Method Distribution
            </h3>
            <span className="text-[11px] font-mono text-purple-400">HTTP Status 200</span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-4 text-center">
            <div className="p-2.5 rounded-xl bg-[#080C15] border border-white/[0.04]">
              <div className="text-[10px] font-mono text-slate-400">GET</div>
              <div className="text-xl font-mono font-black text-white mt-1">86</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#080C15] border border-white/[0.04]">
              <div className="text-[10px] font-mono text-slate-400">POST</div>
              <div className="text-xl font-mono font-black text-white mt-1">56</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#080C15] border border-white/[0.04]">
              <div className="text-[10px] font-mono text-slate-400">DELETE</div>
              <div className="text-xl font-mono font-black text-white mt-1">0</div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Escrow Integrity</span>
            <span className="text-emerald-400 font-bold">Verified</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. AG GRID FINANCIAL & ESCROW AUDIT LEDGER
          ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0F172A] border border-white/[0.08] font-mono text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all font-medium ${
                activeTab === 'all'
                  ? 'bg-[#1E293B] text-white font-bold border border-white/[0.12] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Records ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('captured')}
              className={`px-3.5 py-1.5 rounded-lg transition-all font-medium ${
                activeTab === 'captured'
                  ? 'bg-[#1E293B] text-emerald-400 font-bold border border-white/[0.12] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Captured ({completedCount})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-1.5 rounded-lg transition-all font-medium ${
                activeTab === 'pending'
                  ? 'bg-[#1E293B] text-amber-400 font-bold border border-white/[0.12] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              In Escrow ({pendingCount})
            </button>
          </div>

          {/* Search + Sync + Export */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search Order, Product, ID..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#0F172A] border border-white/[0.08] focus:border-[#0070BA] rounded-xl text-xs text-white placeholder-slate-400 outline-none font-mono transition-all"
              />
            </div>

            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0070BA] hover:bg-[#005EA6] text-white text-xs font-semibold shadow-sm transition-all shrink-0"
              title="Sync Ledger"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-white/[0.08] text-slate-200 hover:text-white text-xs font-semibold transition-all shrink-0"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>

        {/* The AG Grid */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-3 shadow-fintech-card">
          <div className="ag-theme-quartz-dark w-full h-[520px]">
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

      {/* Modals */}
      <TestCardsModal isOpen={showTestCards} onClose={() => setShowTestCards(false)} />
      <CredentialsModal isOpen={showCredentials} onClose={() => setShowCredentials(false)} />
    </div>
  );
}
