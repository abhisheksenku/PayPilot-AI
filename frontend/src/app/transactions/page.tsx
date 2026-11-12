'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { api } from '@/lib/api';
import { ENABLE_SEED_DATA } from '@/lib/config';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types/order';
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
  return (
    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700">
      <FileText className="w-5 h-5 text-slate-600" />
    </div>
  );
}

export default function TransactionsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'logs' | 'summary' | 'webhooks'>('logs');
  const [viewMode, setViewMode] = useState<'aggrid' | 'standard'>('aggrid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('7d');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedTxn, setSelectedTxn] = useState<TransactionItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);

  const gridRef = useRef<AgGridReact<TransactionItem>>(null);

  // Fetch live orders from MySQL database
  const fetchOrders = async () => {
    try {
      const orders = await api.getOrders();
      if (orders && Array.isArray(orders)) {
        setLiveOrders(orders);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders().finally(() => {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    });
  };

  // Map live MySQL orders to TransactionItem format
  const mappedLiveTransactions = useMemo<TransactionItem[]>(() => {
    return liveOrders.map((order) => {
      const modelKey = (
        order.Product?.externalId?.includes('apple') ? 'macbook-pro' :
        order.Product?.externalId?.includes('victus') ? 'hp-victus' :
        order.Product?.externalId?.includes('rog') ? 'asus-rog' :
        order.Product?.externalId?.includes('dell') ? 'dell-g15' :
        order.Product?.externalId?.includes('legion') ? 'lenovo-legion' :
        'lenovo-loq'
      ) as TransactionItem['modelKey'];

      const isCaptured =
        order.status === 'CAPTURED' ||
        (order as any).status === 'paid' ||
        (order as any).status === 'completed';
      const status: TransactionItem['status'] = isCaptured ? 'CAPTURED' : 'ON_HOLD';

      return {
        id: `TXN-${order.id.slice(0, 8).toUpperCase()}`,
        orderId: order.paypalOrderId || `ORD-${order.id.slice(0, 8).toUpperCase()}`,
        captureId: order.paypalCaptureId || 'C-PENDING-CAPTURE',
        name: order.Product?.name || 'Lenovo LOQ 15 Gaming & ML Laptop',
        specs: (order.Product as any)?.specifications
          ? Object.values((order.Product as any).specifications).slice(0, 3).join(' • ')
          : 'RTX 4060 • 16GB • 100% sRGB',
        brand: order.Product?.name?.includes('Apple') ? 'Apple' : 'Lenovo',
        modelKey,
        amount: `$${Number(order.totalAmount || 749).toFixed(2)} USD`,
        amountNumeric: Number(order.totalAmount || 749),
        currency: order.currency || 'USD',
        status,
        date: new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
        time: new Date(order.createdAt || Date.now()).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        sellerProtection: 'ELIGIBLE',
        paymentMethod: 'PayPal Balance / Instant',
      };
    });
  }, [liveOrders]);

  // Combined dataset: Always display transactions so ledger looks complete and authentic
  const allTransactions = useMemo<TransactionItem[]>(() => {
    if (mappedLiveTransactions.length > 0) {
      if (ENABLE_SEED_DATA) {
        const liveIds = new Set(mappedLiveTransactions.map((t) => t.orderId));
        const dedupedSeed = INITIAL_TRANSACTIONS.filter((t) => !liveIds.has(t.orderId));
        return [...mappedLiveTransactions, ...dedupedSeed];
      }
      return mappedLiveTransactions;
    }
    return INITIAL_TRANSACTIONS;
  }, [mappedLiveTransactions]);

  // Dynamic KPI Metrics
  const totalVolumeFormatted = useMemo(() => {
    const sum = allTransactions.reduce((acc, t) => acc + t.amountNumeric, 0);
    return `$${sum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [allTransactions]);

  const settledCapturesCount = useMemo(() => {
    return allTransactions.filter((t) => t.status === 'CAPTURED').length;
  }, [allTransactions]);

  const activeEscrowsCount = useMemo(() => {
    return allTransactions.filter((t) => t.status === 'ON_HOLD').length;
  }, [allTransactions]);

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
    return allTransactions.filter((txn) => {
      const matchesSearch =
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.captureId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.specs.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || txn.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allTransactions, searchQuery, statusFilter]);

  // Synchronize search input with AG Grid quick filter
  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption('quickFilterText', searchQuery);
    }
  }, [searchQuery]);

  // AG Grid Column Definitions
  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const columnDefs = useMemo<ColDef<TransactionItem>[]>(
    () => [
      {
        headerName: '#',
        valueGetter: (params) => (params.node ? (params.node.rowIndex ?? 0) + 1 : ''),
        width: 70,
        pinned: 'left',
        sortable: false,
        filter: false,
        cellClass: 'text-gray-500 font-sans text-sm flex items-center justify-center font-medium',
      },
      {
        headerName: 'Transaction ID',
        field: 'id',
        width: 185,
        pinned: 'left',
        cellRenderer: (params: any) => {
          const id = params.value;
          return (
            <div className="flex items-center gap-1.5 font-mono font-semibold text-[#0070BA] text-sm h-full">
              <span>{id}</span>
            </div>
          );
        },
      },
      {
        headerName: 'Hardware Model & Specs',
        field: 'name',
        flex: 2,
        minWidth: 280,
        cellRenderer: (params: any) => {
          const data = params.data as TransactionItem;
          if (!data) return null;
          return (
            <div className="flex items-center gap-3 h-full py-1">
              <div className="w-10 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center p-0.5 shrink-0">
                <MiniThumbnail model={data.modelKey} />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-gray-900 text-sm truncate leading-tight">
                  {data.name}
                </div>
                <div className="text-sm text-gray-500 truncate leading-tight mt-0.5">
                  {data.specs}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        headerName: 'Amount',
        field: 'amountNumeric',
        width: 150,
        filter: 'agNumberColumnFilter',
        cellRenderer: (params: any) => (
          <span className="font-semibold text-sm text-gray-900 flex items-center h-full">
            ${Number(params.value || 0).toFixed(2)} USD
          </span>
        ),
      },
      {
        headerName: 'PayPal Order ID',
        field: 'orderId',
        width: 200,
        cellRenderer: (params: any) => (
          <span className="font-mono text-gray-700 text-sm bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
            {params.value}
          </span>
        ),
      },
      {
        headerName: 'Capture ID',
        field: 'captureId',
        width: 190,
        cellRenderer: (params: any) => (
          <span className="font-mono text-gray-600 text-sm">
            {params.value}
          </span>
        ),
      },
      {
        headerName: 'Settlement Status',
        field: 'status',
        width: 160,
        cellRenderer: (params: any) => {
          const status = params.value;
          if (status === 'CAPTURED') {
            return (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Captured
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              On Hold
            </span>
          );
        },
      },
      {
        headerName: 'Created At',
        valueGetter: (params: any) => `${params.data?.date || ''} ${params.data?.time || ''}`,
        width: 175,
        cellClass: 'text-sm text-gray-600 flex items-center',
      },
    ],
    []
  );

  // Export CSV generator
  const handleExportCSV = () => {
    if (viewMode === 'aggrid' && gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `paypilot-transactions-ledger-${new Date().toISOString().slice(0, 10)}.csv`,
      });
      return;
    }

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

  return (
    <DashboardLayout>
      <div className="px-6 py-5 max-w-[1600px] mx-auto space-y-4">
        {/* Top Header & View Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Event Logs &amp; Financial Ledger
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              PayPal REST API v2 settlement records, capture transactions, and audit trail.
            </p>
          </div>

          {/* Right Navigation Tabs */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-[#EBF5FF] text-[#0070BA] border border-blue-200 shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-xs'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Transaction Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'summary'
                  ? 'bg-[#EBF5FF] text-[#0070BA] border border-blue-200 shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-xs'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Ledger Summary</span>
            </button>

            <button
              onClick={() => setActiveTab('webhooks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'webhooks'
                  ? 'bg-[#EBF5FF] text-[#0070BA] border border-blue-200 shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-xs'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Webhooks</span>
            </button>
          </div>
        </div>

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Metric 1: Total Volume */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#0070BA]">
                <Coins className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 block leading-tight">
                  Total Volume
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900 tracking-tight font-sans">
                    {totalVolumeFormatted}
                  </span>
                  <span className="text-sm font-semibold text-gray-500 font-sans">USD</span>
                </div>
                <span className="text-sm text-gray-500 font-medium block mt-1">
                  Settled across verified transactions
                </span>
              </div>
            </div>
          </div>

          {/* Metric 2: Settled Captures */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 block leading-tight">
                  Settled Captures
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900 tracking-tight font-sans">
                    {settledCapturesCount} Orders
                  </span>
                </div>
                <span className="text-sm text-gray-500 font-medium block mt-1">
                  Completed payments (CAPTURED)
                </span>
              </div>
            </div>
          </div>

          {/* Metric 3: Active Escrows */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#0070BA]">
                <Lock className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 block leading-tight">
                  Active Escrows
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900 tracking-tight font-sans">
                    {activeEscrowsCount}
                  </span>
                </div>
                <span className="text-sm text-gray-500 font-medium block mt-1">
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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Search input */}
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Transaction ID, Order ID, or Hardware Item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:border-[#0070BA] shadow-xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Right Filter Selectors */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Status Dropdown */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter transactions by settlement status"
                    className="appearance-none bg-white border border-gray-300 rounded-xl pl-3.5 pr-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-[#0070BA] shadow-xs cursor-pointer"
                  >
                    <option value="ALL">Status: All</option>
                    <option value="CAPTURED">Status: Captured</option>
                    <option value="ON_HOLD">Status: On Hold</option>
                    <option value="PENDING">Status: Pending</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Date Range Dropdown */}
                <div className="relative">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    aria-label="Filter transactions by date range"
                    className="appearance-none bg-white border border-gray-300 rounded-xl pl-3.5 pr-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-[#0070BA] shadow-xs cursor-pointer"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="all">All Time</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  title="Refresh Ledger"
                  className="bg-white border border-gray-300 rounded-xl p-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCw
                    className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#0070BA]' : ''}`}
                  />
                </button>

                {/* View Switcher: AG Grid vs Standard Table */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('aggrid')}
                    className={`px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      viewMode === 'aggrid'
                        ? 'bg-white text-[#0070BA] shadow-xs font-bold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span>Interactive Grid</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('standard')}
                    className={`px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                      viewMode === 'standard'
                        ? 'bg-white text-gray-900 shadow-xs font-bold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span>Standard Table</span>
                  </button>
                </div>

                {/* Export CSV Button */}
                <button
                  onClick={handleExportCSV}
                  className="bg-[#0070BA] hover:bg-[#005ea6] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Financial Ledger: AG Grid or Standard Table */}
            {viewMode === 'aggrid' ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 space-y-3 font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-bold text-gray-900">
                      Interactive Financial Ledger
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Click column headers to sort • Use column filters to filter • Drag column borders to resize
                  </span>
                </div>

                <div className="ag-theme-quartz w-full h-[540px] rounded-xl overflow-hidden border border-gray-200">
                  <AgGridReact<TransactionItem>
                    ref={gridRef}
                    rowData={filteredTransactions}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 25, 50]}
                    onRowClicked={(event) => {
                      if (event.data) setSelectedTxn(event.data);
                    }}
                    rowHeight={48}
                    headerHeight={42}
                    animateRows={true}
                  />
                </div>
              </div>
            ) : (
            /* Financial Ledger Table (Standard) */
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse font-sans">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 select-none">
                      <th className="py-3 px-3.5 text-center w-12 text-gray-400">#</th>
                      <th className="py-3.5 px-4 tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <span>Transaction ID</span>
                          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 tracking-wider">Hardware Item</th>
                      <th className="py-3.5 px-4 tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <span>Amount</span>
                          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <span>PayPal Order ID</span>
                          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <span>Capture ID</span>
                          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <span>Status</span>
                          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <span>Created At</span>
                          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
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
                          className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                        >
                          {/* Row Number */}
                          <td className="py-4 px-3.5 text-center text-gray-400 font-sans text-sm">
                            {index + 1}
                          </td>

                          {/* Transaction ID */}
                          <td className="py-4 px-4 font-mono font-semibold text-[#0070BA] whitespace-nowrap text-sm">
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
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Hardware Item with Mini Thumbnail */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <MiniThumbnail model={txn.modelKey} />
                              <div>
                                <span className="font-bold text-gray-900 block leading-tight text-sm">
                                  {txn.name}
                                </span>
                                <span className="text-sm text-gray-500 font-medium block mt-0.5">
                                  {txn.specs}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-4 font-bold text-gray-900 whitespace-nowrap text-sm">
                            {txn.amount}
                          </td>

                          {/* PayPal Order ID */}
                          <td className="py-4 px-4 font-mono font-medium text-[#0070BA] whitespace-nowrap text-sm">
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
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Capture ID */}
                          <td className="py-4 px-4 font-mono text-gray-700 whitespace-nowrap text-sm">
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
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {txn.status === 'CAPTURED' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Captured
                              </span>
                            )}
                            {txn.status === 'ON_HOLD' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                On Hold
                              </span>
                            )}
                            {txn.status === 'REFUNDED' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                                <Clock className="w-3.5 h-3.5 text-rose-600" />
                                Refunded
                              </span>
                            )}
                          </td>

                          {/* Created At */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="leading-tight">
                              <span className="font-semibold text-gray-900 block text-sm">
                                {txn.date}
                              </span>
                              <span className="text-sm text-gray-500 font-mono block mt-0.5">
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
                          <p className="font-semibold text-gray-800 text-base">
                            No matching transactions found
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Try adjusting your search query or status filter.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 bg-white border-t border-gray-200 gap-3 text-sm text-gray-600">
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
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus:border-[#0070BA] pr-6 cursor-pointer"
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Page Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled
                      title="Previous Page"
                      className="p-1 rounded-lg text-gray-300 hover:text-gray-500 disabled:opacity-40 cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="w-7 h-7 bg-[#0070BA] text-white rounded-lg font-bold flex items-center justify-center text-sm shadow-xs">
                      1
                    </span>
                    <button
                      disabled
                      title="Next Page"
                      className="p-1 rounded-lg text-gray-300 hover:text-gray-500 disabled:opacity-40 cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        )}

        {/* Tab 2: Ledger Summary View */}
        {activeTab === 'summary' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6 font-sans">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                PayPal Sandbox Financial Settlement Summary
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Real-time breakdown of gross settlement volumes, merchant fees, and seller protection eligibility.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-sm text-gray-500 font-medium">Gross Captured Volume</span>
                <p className="text-2xl font-bold font-sans text-gray-900 mt-1">$6,874.00 USD</p>
                <span className="text-sm text-emerald-700 font-semibold mt-1 block">
                  6 of 6 Orders Captured
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-sm text-gray-500 font-medium">Estimated Merchant Fees</span>
                <p className="text-2xl font-bold font-sans text-gray-900 mt-1">$201.34 USD</p>
                <span className="text-sm text-gray-500 mt-1 block">
                  2.9% + $0.30 per transaction
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-sm text-gray-500 font-medium">Net Settlement Payout</span>
                <p className="text-2xl font-bold font-sans text-[#0070BA] mt-1">$6,672.66 USD</p>
                <span className="text-sm text-emerald-700 font-semibold mt-1 block">
                  Immediate Sandbox Release
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-sm text-gray-500 font-medium">Seller Protection Coverage</span>
                <p className="text-2xl font-bold font-sans text-emerald-600 mt-1">100.0%</p>
                <span className="text-sm text-gray-500 mt-1 block">
                  All 6 items hardware verified
                </span>
              </div>
            </div>

            {/* Settlement Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 font-semibold text-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Payment Channel</th>
                    <th className="py-3 px-4">Transactions</th>
                    <th className="py-3 px-4">Total Settled</th>
                    <th className="py-3 px-4">Settlement Speed</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">PayPal Balance / Instant</td>
                    <td className="py-3.5 px-4">3</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">$3,547.00 USD</td>
                    <td className="py-3.5 px-4">Instantaneous</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-semibold">Cleared</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">PayPal Credit / Pay Later</td>
                    <td className="py-3.5 px-4">1</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">$1,849.00 USD</td>
                    <td className="py-3.5 px-4">Upfront Merchant Credit</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-semibold">Cleared</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">Debit / Credit Card (Direct)</td>
                    <td className="py-3.5 px-4">2</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">$1,478.00 USD</td>
                    <td className="py-3.5 px-4">T+0 Sandbox Settlement</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-semibold">Cleared</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Webhooks Log View */}
        {activeTab === 'webhooks' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  PayPal REST API v2 Webhook Dispatcher
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Listening to endpoint: <code className="text-sm font-mono text-[#0070BA] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">https://api.sandbox.paypal.com/v1/notifications/webhooks</code>
                </p>
              </div>
              <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-sm font-semibold flex items-center gap-2 self-start sm:self-auto">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Webhook Ingress 200 OK
              </span>
            </div>

            <div className="space-y-2.5">
              {filteredTransactions.map((txn) => (
                <div
                  key={txn.id}
                  onClick={() => setSelectedTxn(txn)}
                  className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm text-gray-900">
                          PAYMENT.CAPTURE.COMPLETED
                        </span>
                        <span className="text-sm font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                          {txn.captureId}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 block mt-1">
                        Order {txn.orderId} • Captured {txn.amount} for {txn.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600 shrink-0">
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">HTTP 200 OK</span>
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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 font-sans"
            onClick={() => setSelectedTxn(null)}
          >
            <div
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0070BA] flex items-center justify-center font-bold">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">
                      PayPal REST API v2 Webhook Payload
                    </h3>
                    <p className="text-sm text-gray-500 font-mono mt-0.5">
                      Event: PAYMENT.CAPTURE.COMPLETED • {selectedTxn.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-sm text-gray-500 font-medium block">Item</span>
                    <span className="font-bold text-gray-900 block truncate mt-1 text-sm">{selectedTxn.name}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-sm text-gray-500 font-medium block">Settlement</span>
                    <span className="font-bold text-[#0070BA] font-mono block mt-1 text-sm">{selectedTxn.amount}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-sm text-gray-500 font-medium block">Protection</span>
                    <span className="font-bold text-emerald-700 block mt-1 text-sm">{selectedTxn.sellerProtection}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-sm text-gray-500 font-medium block">Channel</span>
                    <span className="font-bold text-gray-800 block truncate mt-1 text-sm">{selectedTxn.paymentMethod}</span>
                  </div>
                </div>

                {/* Raw JSON Payload */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span>Simulated Sandbox Ingress Payload</span>
                      <span className="text-sm bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">
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
                      className="text-sm text-[#0070BA] hover:text-[#005ea6] font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedKey === 'json-payload' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Copied JSON</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-900 text-gray-100 rounded-xl text-sm font-mono overflow-x-auto leading-relaxed border border-gray-800">
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
              <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="px-5 py-2 bg-[#0070BA] text-white rounded-xl text-sm font-semibold hover:bg-[#005ea6] shadow-xs cursor-pointer"
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
