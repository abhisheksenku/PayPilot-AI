'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Coins,
  ShieldCheck,
  Lock,
  Search,
  RotateCw,
  Download,
  Copy,
  Check,
  FileText,
  BarChart3,
  Zap,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  X,
  Code2,
} from 'lucide-react';

interface TransactionItem {
  id: string;
  orderId: string;
  captureId: string;
  name: string;
  specs: string;
  brand: string;
  modelKey: 'lenovo-loq' | 'macbook-pro' | 'hp-victus' | 'asus-rog' | 'dell-g15' | 'lenovo-legion';
  amount: string;
  amountNumeric: number;
  currency: string;
  status: 'CAPTURED' | 'ON_HOLD' | 'PENDING' | 'REFUNDED';
  date: string;
  time: string;
  sellerProtection: 'ELIGIBLE' | 'PARTIALLY_ELIGIBLE' | 'INELIGIBLE';
  paymentMethod: string;
}

const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'TXN-8F3K2D9M',
    orderId: 'O-7H2KJ83P4N56',
    captureId: 'C-9D4L7M2Q8F9K',
    name: 'Lenovo LOQ 15',
    specs: 'RTX 4060 • 16GB • 100% sRGB',
    brand: 'Lenovo',
    modelKey: 'lenovo-loq',
    amount: '$749.00 USD',
    amountNumeric: 749.0,
    currency: 'USD',
    status: 'CAPTURED',
    date: 'Nov 10, 2026',
    time: '10:24 AM',
    sellerProtection: 'ELIGIBLE',
    paymentMethod: 'PayPal Balance / Instant',
  },
  {
    id: 'TXN-Z9M8P1VQ',
    orderId: 'O-3K9VZ7B6M8Q1',
    captureId: 'C-2P8N5X9D4K7L',
    name: 'MacBook Pro 14 M3 Pro',
    specs: '36GB • 14.2" • Liquid Retina',
    brand: 'Apple',
    modelKey: 'macbook-pro',
    amount: '$1,849.00 USD',
    amountNumeric: 1849.0,
    currency: 'USD',
    status: 'CAPTURED',
    date: 'Nov 09, 2026',
    time: '04:37 PM',
    sellerProtection: 'ELIGIBLE',
    paymentMethod: 'PayPal Credit / Pay Later',
  },
  {
    id: 'TXN-H6D4R2PL',
    orderId: 'O-8M5QK1D9V3Z7',
    captureId: 'C-6F8B2R4N9P1V',
    name: 'HP Victus 15',
    specs: 'RTX 3050 • 16GB • 144Hz',
    brand: 'HP',
    modelKey: 'hp-victus',
    amount: '$699.00 USD',
    amountNumeric: 699.0,
    currency: 'USD',
    status: 'CAPTURED',
    date: 'Nov 09, 2026',
    time: '01:15 PM',
    sellerProtection: 'ELIGIBLE',
    paymentMethod: 'Visa Debit (•••• 4026)',
  },
  {
    id: 'TXN-K5P7N8JV',
    orderId: 'O-4Z6D9M3K1B8V',
    captureId: 'C-5N7K1Q8M2D4R',
    name: 'ASUS ROG Zephyrus G16',
    specs: 'RTX 4070 • 32GB • 240Hz',
    brand: 'ASUS',
    modelKey: 'asus-rog',
    amount: '$1,499.00 USD',
    amountNumeric: 1499.0,
    currency: 'USD',
    status: 'CAPTURED',
    date: 'Nov 08, 2026',
    time: '08:42 PM',
    sellerProtection: 'ELIGIBLE',
    paymentMethod: 'PayPal Instant Settlement',
  },
  {
    id: 'TXN-V3Q9L6BW',
    orderId: 'O-1P8R4V6K9Z3D',
    captureId: 'C-7M1D5K9P4R8B',
    name: 'Dell G15 Gaming',
    specs: 'RTX 4050 • 16GB • 165Hz',
    brand: 'Dell',
    modelKey: 'dell-g15',
    amount: '$779.00 USD',
    amountNumeric: 779.0,
    currency: 'USD',
    status: 'CAPTURED',
    date: 'Nov 08, 2026',
    time: '11:06 AM',
    sellerProtection: 'ELIGIBLE',
    paymentMethod: 'Mastercard (•••• 8824)',
  },
  {
    id: 'TXN-M2X7F9GT',
    orderId: 'O-9D3K8F6V2N1Q',
    captureId: 'C-4R9V7P2K8M5D',
    name: 'Lenovo Legion Pro 5',
    specs: 'RTX 4060 • 32GB • 16" WQXGA',
    brand: 'Lenovo',
    modelKey: 'lenovo-legion',
    amount: '$1,299.00 USD',
    amountNumeric: 1299.0,
    currency: 'USD',
    status: 'CAPTURED',
    date: 'Nov 07, 2026',
    time: '06:21 PM',
    sellerProtection: 'ELIGIBLE',
    paymentMethod: 'PayPal Balance / Instant',
  },
  {
    id: 'TXN-E7P4W1KQ',
    orderId: 'O-5B9T2K8M3P7Q',
    captureId: 'C-PENDING-ESCROW',
    name: 'ASUS ROG Zephyrus G16 (Escrow Hold)',
    specs: 'RTX 4070 • 32GB • 240Hz',
    brand: 'ASUS',
    modelKey: 'asus-rog',
    amount: '$1,499.00 USD',
    amountNumeric: 1499.0,
    currency: 'USD',
    status: 'ON_HOLD',
    date: 'Nov 07, 2026',
    time: '02:14 PM',
    sellerProtection: 'ELIGIBLE',
    paymentMethod: 'PayPal Authorized Escrow',
  },
];

function MiniThumbnail({ model }: { model: TransactionItem['modelKey'] }) {
  switch (model) {
    case 'lenovo-loq':
      return (
        <div className="w-12 h-9 rounded bg-[#10141f] border border-[#2d313d] p-0.5 flex flex-col justify-between shrink-0 shadow-2xs overflow-hidden">
          <div className="flex justify-between items-center text-[5px] text-white">
            <span className="bg-[#E2231A] px-0.5 rounded-xs font-bold">LOQ</span>
            <span className="text-[4px] text-cyan-300 font-mono">144Hz</span>
          </div>
          <div className="text-center font-black text-[7px] text-white tracking-widest bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            LOQ 15
          </div>
          <div className="h-0.5 bg-cyan-400/80 rounded-full w-full" />
        </div>
      );
    case 'macbook-pro':
      return (
        <div className="w-12 h-9 rounded bg-[#18191c] border border-gray-700 p-0.5 flex flex-col justify-between shrink-0 shadow-2xs overflow-hidden">
          <div className="flex justify-between items-center text-[5px] text-gray-400">
            <span className="font-semibold">M3 Pro</span>
            <span className="text-[4px] text-amber-300">Retina</span>
          </div>
          <div className="text-center my-auto">
            <svg className="w-3 h-3 mx-auto fill-gray-200" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.56-.69.95-1.64.84-2.6-.82.04-1.8.56-2.38 1.24-.51.59-.96 1.55-.84 2.48.91.07 1.83-.43 2.38-1.12z" />
            </svg>
          </div>
          <div className="h-0.5 bg-gray-500 rounded-full w-3/4 mx-auto" />
        </div>
      );
    case 'hp-victus':
      return (
        <div className="w-12 h-9 rounded bg-[#15171c] border border-blue-900/60 p-0.5 flex flex-col justify-between shrink-0 shadow-2xs overflow-hidden">
          <div className="flex justify-between items-center text-[5px] text-gray-300">
            <span className="font-bold text-blue-400">VICTUS</span>
            <span className="text-[4px] text-gray-400">15.6&quot;</span>
          </div>
          <div className="text-center my-auto">
            <span className="text-[#0070BA] font-black text-[9px] tracking-tighter">▼</span>
          </div>
          <div className="h-0.5 bg-[#0070BA] rounded-full w-full" />
        </div>
      );
    case 'asus-rog':
      return (
        <div className="w-12 h-9 rounded bg-[#0d0e12] border border-purple-900/60 p-0.5 flex flex-col justify-between shrink-0 shadow-2xs overflow-hidden">
          <div className="flex justify-between items-center text-[5px] text-gray-300">
            <span className="font-bold text-red-500">ROG</span>
            <span className="text-[4px] text-cyan-300">240Hz</span>
          </div>
          <div className="text-center font-black text-[7px] text-purple-300 tracking-wider">
            G16
          </div>
          <div className="h-0.5 bg-gradient-to-r from-red-500 to-purple-500 rounded-full w-full" />
        </div>
      );
    case 'dell-g15':
      return (
        <div className="w-12 h-9 rounded bg-[#0f141d] border border-cyan-900/50 p-0.5 flex flex-col justify-between shrink-0 shadow-2xs overflow-hidden">
          <div className="flex justify-between items-center text-[5px] text-gray-300">
            <span className="font-bold text-cyan-400">DELL</span>
            <span className="text-[4px] text-gray-400">165Hz</span>
          </div>
          <div className="text-center font-black text-[7px] text-cyan-200">
            G15
          </div>
          <div className="h-0.5 bg-cyan-500 rounded-full w-full" />
        </div>
      );
    case 'lenovo-legion':
      return (
        <div className="w-12 h-9 rounded bg-[#121520] border border-indigo-900/60 p-0.5 flex flex-col justify-between shrink-0 shadow-2xs overflow-hidden">
          <div className="flex justify-between items-center text-[5px] text-gray-300">
            <span className="font-bold text-indigo-400">LEGION</span>
            <span className="text-[4px] text-emerald-300">WQXGA</span>
          </div>
          <div className="text-center font-black text-[7px] text-indigo-200">
            PRO 5
          </div>
          <div className="h-0.5 bg-indigo-500 rounded-full w-full" />
        </div>
      );
  }
}

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<'logs' | 'summary' | 'webhooks'>('logs');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('7d');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedTxn, setSelectedTxn] = useState<TransactionItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Copy helper with animated checkmark
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return INITIAL_TRANSACTIONS.filter((txn) => {
      const matchesSearch =
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.captureId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.specs.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || txn.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Export CSV generator
  const handleExportCSV = () => {
    const headers = [
      'Index',
      'Transaction ID',
      'Hardware Item',
      'Specs',
      'Amount',
      'PayPal Order ID',
      'Capture ID',
      'Status',
      'Date',
      'Time',
      'Seller Protection',
    ];

    const rows = filteredTransactions.map((t, idx) => [
      idx + 1,
      t.id,
      `"${t.name}"`,
      `"${t.specs}"`,
      t.amount,
      t.orderId,
      t.captureId,
      t.status,
      t.date,
      t.time,
      t.sellerProtection,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `paypal_sandbox_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <DashboardLayout>
      <div className="px-6 py-5 max-w-[1600px] mx-auto space-y-4">
        {/* Top Header & View Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Event Logs & Financial Ledger
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              PayPal Sandbox REST API v2 Settlement &amp; Capture Audit Trail
            </p>
          </div>

          {/* Right Navigation Tabs */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-[#EBF5FF] text-[#0070BA] border border-blue-200 shadow-2xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-2xs'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Transaction Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'summary'
                  ? 'bg-[#EBF5FF] text-[#0070BA] border border-blue-200 shadow-2xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-2xs'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Ledger Summary</span>
            </button>

            <button
              onClick={() => setActiveTab('webhooks')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'webhooks'
                  ? 'bg-[#EBF5FF] text-[#0070BA] border border-blue-200 shadow-2xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-2xs'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Webhooks</span>
            </button>
          </div>
        </div>

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Metric 1: Total Volume */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#0070BA]">
                <Coins className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 block leading-tight">
                  Total Volume
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-gray-900 tracking-tight font-mono">
                    $4,215.00
                  </span>
                  <span className="text-xs font-bold text-gray-500 font-mono">USD</span>
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 ml-1">
                    ▲ +100.0%
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                  Sandbox (Test) • Last 7 days
                </span>
              </div>
            </div>
          </div>

          {/* Metric 2: Settled Captures */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 block leading-tight">
                  Settled Captures
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-gray-900 tracking-tight font-mono">
                    6
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 ml-1">
                    ▲ +6
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                  Completed payments (CAPTURED)
                </span>
              </div>
            </div>
          </div>

          {/* Metric 3: Active Escrows */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#0070BA]">
                <Lock className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 block leading-tight">
                  Active Escrows
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-gray-900 tracking-tight font-mono">
                    1
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 ml-1">
                    — 0%
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                  Authorized (ON_HOLD) • Awaiting capture
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 1: Transaction Logs View */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            {/* Filter and Action Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Left Search input */}
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Transaction ID, Order ID, or Item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs placeholder-gray-400 text-gray-900 focus:outline-none focus:border-[#0070BA] focus:ring-1 focus:ring-[#0070BA] shadow-2xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Right Filter Selectors */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Status Dropdown */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter transactions by settlement status"
                    className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-[#0070BA] shadow-2xs cursor-pointer"
                  >
                    <option value="ALL">Status: All Statuses</option>
                    <option value="CAPTURED">Status: CAPTURED</option>
                    <option value="ON_HOLD">Status: ON_HOLD</option>
                    <option value="PENDING">Status: PENDING</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Date Range Dropdown */}
                <div className="relative">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    aria-label="Filter transactions by date range"
                    className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-[#0070BA] shadow-2xs cursor-pointer"
                  >
                    <option value="7d">📅 Last 7 Days</option>
                    <option value="24h">📅 Last 24 Hours</option>
                    <option value="30d">📅 Last 30 Days</option>
                    <option value="all">📅 All Time</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  title="Refresh Ledger"
                  className="bg-white border border-gray-200 rounded-lg p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-2xs transition-colors cursor-pointer"
                >
                  <RotateCw
                    className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#0070BA]' : ''}`}
                  />
                </button>

                {/* Export CSV Button */}
                <button
                  onClick={handleExportCSV}
                  className="bg-[#0070BA] hover:bg-[#005ea6] text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Financial Ledger Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50/90 text-gray-600 font-semibold border-b border-gray-200 select-none">
                      <th className="py-3 px-3.5 text-center w-10 text-gray-400">#</th>
                      <th className="py-3 px-4 tracking-wider">
                        <div className="flex items-center gap-1">
                          <span>Transaction ID</span>
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-3 px-4 tracking-wider">Hardware Item</th>
                      <th className="py-3 px-4 tracking-wider">
                        <div className="flex items-center gap-1">
                          <span>Amount</span>
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-3 px-4 tracking-wider">
                        <div className="flex items-center gap-1">
                          <span>PayPal Order ID</span>
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-3 px-4 tracking-wider">
                        <div className="flex items-center gap-1">
                          <span>Capture ID</span>
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-3 px-4 tracking-wider">
                        <div className="flex items-center gap-1">
                          <span>Status</span>
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-3 px-4 tracking-wider">
                        <div className="flex items-center gap-1">
                          <span>Created At</span>
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-800">
                    {filteredTransactions.map((txn, index) => {
                      const isTxnCopied = copiedKey === `txn-${txn.id}`;
                      const isOrderCopied = copiedKey === `order-${txn.orderId}`;
                      const isCaptureCopied = copiedKey === `cap-${txn.captureId}`;

                      return (
                        <tr
                          key={txn.id}
                          onClick={() => setSelectedTxn(txn)}
                          className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                        >
                          {/* Row Number */}
                          <td className="py-3.5 px-3.5 text-center text-gray-400 font-mono text-[11px]">
                            {index + 1}
                          </td>

                          {/* Transaction ID */}
                          <td className="py-3.5 px-4 font-mono font-semibold text-[#0070BA] whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="hover:underline">{txn.id}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(txn.id, `txn-${txn.id}`);
                                }}
                                title="Copy Transaction ID"
                                className="text-gray-400 hover:text-gray-700 p-0.5 rounded transition-colors"
                              >
                                {isTxnCopied ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Hardware Item with Mini Thumbnail */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <MiniThumbnail model={txn.modelKey} />
                              <div>
                                <span className="font-bold text-gray-900 block leading-tight">
                                  {txn.name}
                                </span>
                                <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                                  {txn.specs}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="py-3.5 px-4 font-bold font-mono text-gray-900 whitespace-nowrap">
                            {txn.amount}
                          </td>

                          {/* PayPal Order ID */}
                          <td className="py-3.5 px-4 font-mono font-medium text-[#0070BA] whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span>{txn.orderId}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(txn.orderId, `order-${txn.orderId}`);
                                }}
                                title="Copy PayPal Order ID"
                                className="text-gray-400 hover:text-gray-700 p-0.5 rounded transition-colors"
                              >
                                {isOrderCopied ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Capture ID */}
                          <td className="py-3.5 px-4 font-mono text-gray-700 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span>{txn.captureId}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(txn.captureId, `cap-${txn.captureId}`);
                                }}
                                title="Copy Capture ID"
                                className="text-gray-400 hover:text-gray-700 p-0.5 rounded transition-colors"
                              >
                                {isCaptureCopied ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {txn.status === 'CAPTURED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                CAPTURED
                              </span>
                            )}
                            {txn.status === 'ON_HOLD' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-600" />
                                ON_HOLD (ESCROW)
                              </span>
                            )}
                            {txn.status === 'REFUNDED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <Clock className="w-3 h-3 text-rose-600" />
                                REFUNDED
                              </span>
                            )}
                          </td>

                          {/* Created At */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="leading-tight">
                              <span className="font-semibold text-gray-900 block text-xs">
                                {txn.date}
                              </span>
                              <span className="text-[11px] text-gray-500 font-mono block mt-0.5">
                                {txn.time}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-gray-500">
                          <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="font-medium text-gray-700">No matching transactions found</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Try adjusting your search query or status filter.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 gap-3 text-xs text-gray-500">
                <span>
                  Showing 1 – {filteredTransactions.length} of {filteredTransactions.length} transactions
                </span>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <div className="relative">
                      <select
                        defaultValue="10"
                        aria-label="Select rows per page"
                        className="appearance-none bg-white border border-gray-200 rounded px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-[#0070BA] pr-6 cursor-pointer"
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Page Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      disabled
                      title="Previous Page"
                      className="p-1 rounded text-gray-300 hover:text-gray-500 disabled:opacity-40 cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="w-7 h-7 bg-[#0070BA] text-white rounded font-bold flex items-center justify-center text-xs shadow-2xs">
                      1
                    </span>
                    <button
                      disabled
                      title="Next Page"
                      className="p-1 rounded text-gray-300 hover:text-gray-500 disabled:opacity-40 cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Ledger Summary View */}
        {activeTab === 'summary' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                PayPal Sandbox Financial Settlement Summary
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time breakdown of gross settlement volumes, merchant fees, and seller protection eligibility
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-xs text-gray-500 font-medium">Gross Captured Volume</span>
                <p className="text-xl font-bold font-mono text-gray-900 mt-1">$6,874.00 USD</p>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  ✔ 6/6 Orders Captured
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-xs text-gray-500 font-medium">Estimated Merchant Fees (Sandbox)</span>
                <p className="text-xl font-bold font-mono text-gray-900 mt-1">$201.34 USD</p>
                <span className="text-[11px] text-gray-500 mt-1 block">
                  2.9% + $0.30 per transaction
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-xs text-gray-500 font-medium">Net Settlement Payout</span>
                <p className="text-xl font-bold font-mono text-[#0070BA] mt-1">$6,672.66 USD</p>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  Immediate Sandbox Release
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-xs text-gray-500 font-medium">Seller Protection Coverage</span>
                <p className="text-xl font-bold font-mono text-emerald-600 mt-1">100.0%</p>
                <span className="text-[11px] text-gray-500 mt-1 block">
                  All 6 items hardware verified
                </span>
              </div>
            </div>

            {/* Settlement Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 font-semibold text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4">Payment Channel</th>
                    <th className="py-2.5 px-4">Transactions</th>
                    <th className="py-2.5 px-4">Total Settled</th>
                    <th className="py-2.5 px-4">Settlement Speed</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-gray-900">PayPal Balance / Instant</td>
                    <td className="py-2.5 px-4">3</td>
                    <td className="py-2.5 px-4 font-mono font-bold">$3,547.00 USD</td>
                    <td className="py-2.5 px-4">Instantaneous</td>
                    <td className="py-2.5 px-4 text-emerald-600 font-bold">✔ Cleared</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-gray-900">PayPal Credit / Pay Later</td>
                    <td className="py-2.5 px-4">1</td>
                    <td className="py-2.5 px-4 font-mono font-bold">$1,849.00 USD</td>
                    <td className="py-2.5 px-4">Upfront Merchant Credit</td>
                    <td className="py-2.5 px-4 text-emerald-600 font-bold">✔ Cleared</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-gray-900">Debit / Credit Card (Direct)</td>
                    <td className="py-2.5 px-4">2</td>
                    <td className="py-2.5 px-4 font-mono font-bold">$1,478.00 USD</td>
                    <td className="py-2.5 px-4">T+0 Sandbox Settlement</td>
                    <td className="py-2.5 px-4 text-emerald-600 font-bold">✔ Cleared</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Webhooks Log View */}
        {activeTab === 'webhooks' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  PayPal REST API v2 Webhook Dispatcher
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Listening to endpoint: <code className="text-xs font-mono text-[#0070BA] bg-blue-50 px-1.5 py-0.5 rounded">https://api.sandbox.paypal.com/v1/notifications/webhooks</code>
                </p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Webhook Ingress 200 OK
              </span>
            </div>

            <div className="space-y-2">
              {filteredTransactions.map((txn) => (
                <div
                  key={txn.id}
                  onClick={() => setSelectedTxn(txn)}
                  className="p-3.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-gray-900">
                          PAYMENT.CAPTURE.COMPLETED
                        </span>
                        <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {txn.captureId}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 block mt-0.5">
                        Order {txn.orderId} • Captured {txn.amount} for {txn.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-mono text-[11px]">HTTP 200 OK</span>
                    <span className="text-gray-400">•</span>
                    <span>{txn.date} {txn.time}</span>
                    <Code2 className="w-4 h-4 text-[#0070BA]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: PayPal Webhook / Audit Payload Inspector */}
        {selectedTxn && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedTxn(null)}
          >
            <div
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0070BA] flex items-center justify-center font-bold">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      PayPal REST API v2 Webhook Payload
                    </h3>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                      Event: PAYMENT.CAPTURE.COMPLETED • {selectedTxn.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Item</span>
                    <span className="font-bold text-gray-900 block truncate">{selectedTxn.name}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Settlement</span>
                    <span className="font-bold text-[#0070BA] font-mono block">{selectedTxn.amount}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Protection</span>
                    <span className="font-bold text-emerald-600 block">{selectedTxn.sellerProtection}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Channel</span>
                    <span className="font-bold text-gray-800 block truncate">{selectedTxn.paymentMethod}</span>
                  </div>
                </div>

                {/* Raw JSON Payload */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <span>Simulated Sandbox Ingress Payload</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        200 VERIFIED
                      </span>
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(
                          JSON.stringify(
                            {
                              id: `WH-${selectedTxn.id}`,
                              event_version: '1.0',
                              create_time: `${selectedTxn.date} ${selectedTxn.time}`,
                              resource_type: 'capture',
                              event_type: 'PAYMENT.CAPTURE.COMPLETED',
                              summary: `Payment capture completed for ${selectedTxn.amount}`,
                              resource: {
                                id: selectedTxn.captureId,
                                status: selectedTxn.status,
                                amount: {
                                  currency_code: selectedTxn.currency,
                                  value: selectedTxn.amountNumeric.toFixed(2),
                                },
                                final_capture: true,
                                seller_protection: {
                                  status: selectedTxn.sellerProtection,
                                  dispute_categories: [
                                    'ITEM_NOT_RECEIVED',
                                    'UNAUTHORIZED_TRANSACTION',
                                  ],
                                },
                                supplementary_data: {
                                  related_ids: {
                                    order_id: selectedTxn.orderId,
                                  },
                                },
                              },
                            },
                            null,
                            2
                          ),
                          'json-payload'
                        )
                      }
                      className="text-xs text-[#0070BA] hover:text-[#005ea6] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'json-payload' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied JSON</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 bg-gray-900 text-gray-100 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-gray-800">
                    {JSON.stringify(
                      {
                        id: `WH-${selectedTxn.id}`,
                        event_version: '1.0',
                        create_time: `${selectedTxn.date} ${selectedTxn.time}`,
                        resource_type: 'capture',
                        event_type: 'PAYMENT.CAPTURE.COMPLETED',
                        summary: `Payment capture completed for ${selectedTxn.amount}`,
                        resource: {
                          id: selectedTxn.captureId,
                          status: selectedTxn.status,
                          amount: {
                            currency_code: selectedTxn.currency,
                            value: selectedTxn.amountNumeric.toFixed(2),
                          },
                          final_capture: true,
                          seller_protection: {
                            status: selectedTxn.sellerProtection,
                            dispute_categories: [
                              'ITEM_NOT_RECEIVED',
                              'UNAUTHORIZED_TRANSACTION',
                            ],
                          },
                          supplementary_data: {
                            related_ids: {
                              order_id: selectedTxn.orderId,
                            },
                          },
                        },
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end px-5 py-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="px-4 py-1.5 bg-[#0070BA] text-white rounded-lg text-xs font-semibold hover:bg-[#005ea6] shadow-2xs cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
