'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ENABLE_SEED_DATA } from '@/lib/config';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types/order';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  ShoppingCart,
  ShieldCheck,
  Wallet,
  Printer,
  Plus,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckCircle2,
  Package,
  FileText,
  User,
  Calendar,
  CreditCard,
  Download,
  Mail,
  X,
  Truck,
  Check,
  ArrowRight,
  Eye,
  Sparkles,
  Info,
} from 'lucide-react';
import { BryntumSchedulerWrapper } from '@/components/fulfillment/BryntumSchedulerWrapper';
import type { FulfillmentResource, FulfillmentEvent } from '@/components/fulfillment/BryntumLogisticsScheduler';

interface OrderItem {
  id: string;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  name: string;
  specs: string;
  modelKey: 'lenovo-loq' | 'macbook-pro' | 'hp-victus' | 'asus-rog' | 'dell-g15' | 'lenovo-legion';
  amount: string;
  amountNumeric: number;
  paymentMethod: string;
  status: 'DELIVERED' | 'IN_TRANSIT' | 'ON_HOLD';
  date: string;
  time: string;
  shipping: string;
  tax: string;
}

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ORD-8842',
    transactionId: 'TXN-8F3K2D9M',
    customerName: 'Rahul Verma',
    customerEmail: 'rahul.verma@example.com',
    name: 'Lenovo LOQ 15',
    specs: 'RTX 4060 • 16GB DDR5 • 115W TGP',
    modelKey: 'lenovo-loq',
    amount: '₹62,990 INR',
    amountNumeric: 62990,
    paymentMethod: 'PayPal Balance',
    status: 'DELIVERED',
    date: 'Nov 10, 2026',
    time: '10:24 AM (IST)',
    shipping: 'Free',
    tax: '₹0.00',
  },
  {
    id: 'ORD-8837',
    transactionId: 'TXN-Z9M8P1VQ',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@example.com',
    name: 'MacBook Pro 14',
    specs: 'M3 Pro • 36GB Unified RAM • 14.2" Liquid Retina',
    modelKey: 'macbook-pro',
    amount: '₹1,69,900 INR',
    amountNumeric: 169900,
    paymentMethod: 'PayPal Balance',
    status: 'IN_TRANSIT',
    date: 'Nov 09, 2026',
    time: '04:37 PM (IST)',
    shipping: 'Free',
    tax: '₹0.00',
  },
  {
    id: 'ORD-8831',
    transactionId: 'TXN-H6D4R2PL',
    customerName: 'Arjun Rao',
    customerEmail: 'arjun.rao@example.com',
    name: 'HP Victus 15',
    specs: 'RTX 3050 • 16GB DDR5 • 144Hz FHD',
    modelKey: 'hp-victus',
    amount: '₹58,990 INR',
    amountNumeric: 58990,
    paymentMethod: 'PayPal Balance',
    status: 'DELIVERED',
    date: 'Nov 09, 2026',
    time: '11:15 AM (IST)',
    shipping: 'Free',
    tax: '₹0.00',
  },
  {
    id: 'ORD-8825',
    transactionId: 'TXN-K4T9W3XP',
    customerName: 'Devendra Rao',
    customerEmail: 'devendra.rao@example.com',
    name: 'Dell G15 Gaming',
    specs: 'RTX 4050 • 16GB DDR5 • 120Hz Display',
    modelKey: 'dell-g15',
    amount: '₹65,490 INR',
    amountNumeric: 65490,
    paymentMethod: 'PayPal Balance',
    status: 'DELIVERED',
    date: 'Nov 08, 2026',
    time: '11:06 AM (IST)',
    shipping: 'Free',
    tax: '₹0.00',
  },
  {
    id: 'ORD-8819',
    transactionId: 'TXN-M2X7F9GT',
    customerName: 'Sakshi Iyer',
    customerEmail: 'sakshi.iyer@example.com',
    name: 'Lenovo Legion Pro 5',
    specs: 'RTX 4060 • 32GB DDR5 • 16" WQXGA 240Hz',
    modelKey: 'lenovo-legion',
    amount: '₹1,09,990 INR',
    amountNumeric: 109990,
    paymentMethod: 'PayPal Balance',
    status: 'IN_TRANSIT',
    date: 'Nov 07, 2026',
    time: '06:21 PM (IST)',
    shipping: 'Free',
    tax: '₹0.00',
  },
  {
    id: 'ORD-8812',
    transactionId: 'TXN-E7P4W1KQ',
    customerName: 'Vikramaditya Sen',
    customerEmail: 'vikram.sen@example.com',
    name: 'ASUS ROG Zephyrus G16',
    specs: 'RTX 4070 • 32GB DDR5 • 240Hz (Escrow)',
    modelKey: 'asus-rog',
    amount: '₹1,25,990 INR',
    amountNumeric: 125990,
    paymentMethod: 'PayPal Escrow Rails',
    status: 'ON_HOLD',
    date: 'Nov 07, 2026',
    time: '02:14 PM (IST)',
    shipping: 'Free',
    tax: '₹0.00',
  },
];

function MiniThumbnail({ model }: { model: OrderItem['modelKey'] }) {
  return (
    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700">
      <Package className="w-5 h-5 text-slate-600" />
    </div>
  );
}

function OrdersViewContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Reactive viewMode connected directly to Next.js query parameters
  const viewQuery = searchParams ? searchParams.get('view') : null;
  const [viewMode, setViewMode] = useState<'table' | 'bryntum'>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('view') === 'bryntum' ? 'bryntum' : 'table';
    }
    return 'table';
  });

  // Keep viewMode synchronized whenever the URL query parameter changes
  useEffect(() => {
    if (viewQuery === 'bryntum') {
      setViewMode('bryntum');
    } else if (viewQuery === 'table' || !viewQuery) {
      if (viewQuery === 'table') {
        setViewMode('table');
      }
    }
  }, [viewQuery]);

  const handleSwitchView = (mode: 'table' | 'bryntum') => {
    setViewMode(mode);
    if (mode === 'bryntum') {
      router.push('/orders?view=bryntum');
    } else {
      router.push('/orders');
    }
  };

  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('7d');
  const [isSentNotice, setIsSentNotice] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  const [showDemoPreview, setShowDemoPreview] = useState(false);

  // Fetch real orders from database for current authenticated user
  useEffect(() => {
    api
      .getOrders()
      .then((orders) => {
        if (orders && Array.isArray(orders)) {
          setLiveOrders(orders);
        }
      })
      .catch(() => {});
  }, []);

  const mappedLiveOrders = useMemo<OrderItem[]>(() => {
    return liveOrders.map((order) => {
      const modelKey = (
        order.Product?.externalId?.includes('apple') ? 'macbook-pro' :
        order.Product?.externalId?.includes('victus') ? 'hp-victus' :
        order.Product?.externalId?.includes('rog') ? 'asus-rog' :
        order.Product?.externalId?.includes('dell') ? 'dell-g15' :
        order.Product?.externalId?.includes('legion') ? 'lenovo-legion' :
        'lenovo-loq'
      ) as OrderItem['modelKey'];

      const isDelivered =
        order.status === 'CAPTURED' ||
        (order as any).status === 'paid' ||
        (order as any).status === 'completed';
      const status: OrderItem['status'] = isDelivered ? 'DELIVERED' : 'IN_TRANSIT';

      return {
        id: order.paypalOrderId || `ORD-${order.id.slice(0, 8).toUpperCase()}`,
        transactionId: order.paypalCaptureId || `TXN-${order.id.slice(0, 8).toUpperCase()}`,
        customerName: user?.name || 'Customer',
        customerEmail: user?.email || '',
        name: order.Product?.name || 'Lenovo LOQ 15 Gaming & ML Laptop',
        specs: (order.Product as any)?.specifications
          ? Object.values((order.Product as any).specifications).slice(0, 3).join(' • ')
          : 'RTX 4060 • 16GB DDR5 • 115W TGP',
        modelKey,
        amount: `₹${Number(order.totalAmount || 62990).toLocaleString('en-IN')} INR`,
        amountNumeric: Number(order.totalAmount || 62990),
        paymentMethod: 'PayPal Balance',
        status,
        date: new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
        time:
          new Date(order.createdAt || Date.now()).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }) + ' (IST)',
        shipping: 'Free',
        tax: '₹0.00',
      };
    });
  }, [liveOrders, user?.name, user?.email]);

  const isDemoAccount = !user || user.email === 'demo@paypilot.ai';

  // Strict user data scoping:
  // - Real logged-in user: Strictly displays their own genuine orders (unless they choose to preview sample data)
  // - Demo account (demo@paypilot.ai): Displays pre-seeded showcase data so presentations look complete
  const allOrders = useMemo<OrderItem[]>(() => {
    if (!isDemoAccount && !showDemoPreview) {
      return mappedLiveOrders;
    }

    if (ENABLE_SEED_DATA || showDemoPreview) {
      if (mappedLiveOrders.length > 0) {
        const liveIds = new Set(mappedLiveOrders.map((o) => o.id));
        const dedupedSeed = INITIAL_ORDERS.filter((o) => !liveIds.has(o.id));
        return [...mappedLiveOrders, ...dedupedSeed];
      }
      return INITIAL_ORDERS;
    }

    return mappedLiveOrders;
  }, [mappedLiveOrders, isDemoAccount, showDemoPreview]);

  // Keep selectedOrderId synchronized with the available list
  useEffect(() => {
    if (allOrders.length > 0) {
      if (!allOrders.some((o) => o.id === selectedOrderId)) {
        setSelectedOrderId(allOrders[0].id);
      }
    } else {
      setSelectedOrderId('');
    }
  }, [allOrders, selectedOrderId]);

  // Dynamic Metrics
  const totalOrdersCount = useMemo(() => {
    return allOrders.length;
  }, [allOrders]);

  const netInvoicedVolume = useMemo(() => {
    const sum = allOrders.reduce((acc, o) => acc + o.amountNumeric, 0);
    return `₹${sum.toLocaleString('en-IN')}`;
  }, [allOrders]);

  const selectedOrder = useMemo(() => {
    if (allOrders.length === 0) return null;
    return allOrders.find((o) => o.id === selectedOrderId) || allOrders[0];
  }, [allOrders, selectedOrderId]);

  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const q = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.name.toLowerCase().includes(q) ||
        order.transactionId.toLowerCase().includes(q)
      );
    });
  }, [allOrders, searchQuery]);

  const bryntumResources = useMemo<FulfillmentResource[]>(
    () => [
      {
        id: 'res-hub-1',
        name: 'Channel3 South Depot',
        role: 'Primary Hardware Hub',
        hub: 'Bengaluru, KA',
        status: 'ACTIVE',
      },
      {
        id: 'res-hub-2',
        name: 'Channel3 North Hub',
        role: 'Regional Warehouse',
        hub: 'Gurugram, HR',
        status: 'ACTIVE',
      },
      {
        id: 'res-carrier-fedex',
        name: 'Blue Dart / FedEx Express',
        role: 'Express Air Courier',
        hub: 'Domestic Priority',
        status: 'ACTIVE',
      },
      {
        id: 'res-carrier-dhl',
        name: 'DHL Express India',
        role: 'National Air Freight',
        hub: 'Inter-State Priority',
        status: 'ACTIVE',
      },
      {
        id: 'res-agent-ai',
        name: 'PayPal Autonomous Dispatcher',
        role: 'Escrow Settlement',
        hub: 'Fintech Rail (India)',
        status: 'ONLINE',
      },
    ],
    []
  );

  const bryntumEvents = useMemo<FulfillmentEvent[]>(() => {
    const events: FulfillmentEvent[] = [];
    allOrders.forEach((order, index) => {
      const isRog = order.modelKey === 'asus-rog';
      const isMac = order.modelKey === 'macbook-pro';
      const hubId = isRog || isMac ? 'res-hub-1' : 'res-hub-2';
      const carrierId = isMac ? 'res-carrier-dhl' : 'res-carrier-fedex';
      const color = isRog ? 'purple' : isMac ? 'indigo' : 'green';

      const baseDay = 8 + (index % 4);
      const startHour = 8 + ((index * 2) % 6);
      const startHourPad = String(startHour).padStart(2, '0');
      const startDayPad = String(baseDay).padStart(2, '0');
      const midDayPad = String(baseDay + 1).padStart(2, '0');
      const endDayPad = String(baseDay + 2).padStart(2, '0');

      events.push({
        id: `evt-hub-${order.id}`,
        resourceId: hubId,
        name: `${order.id}: ${order.name} (Allocation & QA)`,
        orderId: order.id,
        startDate: `2026-11-${startDayPad} ${startHourPad}:00`,
        endDate: `2026-11-${midDayPad} 13:00`,
        eventColor: color,
        iconCls: 'b-fa b-fa-box-check',
        status: order.status === 'DELIVERED' ? 'Completed' : 'Processing',
      });

      events.push({
        id: `evt-carrier-${order.id}`,
        resourceId: carrierId,
        name: `${order.id}: ${carrierId === 'res-carrier-dhl' ? 'DHL Express India' : 'Blue Dart Air Express'} (${order.name})`,
        orderId: order.id,
        startDate: `2026-11-${midDayPad} 14:00`,
        endDate: `2026-11-${endDayPad} 18:00`,
        eventColor: carrierId === 'res-carrier-dhl' ? 'orange' : 'blue',
        iconCls: 'b-fa b-fa-plane',
        status: order.status === 'DELIVERED' ? 'Delivered' : 'In Transit',
      });

      events.push({
        id: `evt-escrow-${order.id}`,
        resourceId: 'res-agent-ai',
        name: `${order.id}: PayPal Smart Lock (${order.amount})`,
        orderId: order.id,
        startDate: `2026-11-${startDayPad} ${startHourPad}:00`,
        endDate: `2026-11-${endDayPad} 18:00`,
        eventColor: 'cyan',
        iconCls: 'b-fa b-fa-lock',
        status: 'Escrow Protected',
      });
    });

    return events;
  }, [allOrders]);

  // Compute dynamic timeline boundaries so events are always visible and centered
  const calculatedStartDate = useMemo(() => {
    if (bryntumEvents.length === 0) return new Date(2026, 10, 8);
    const minTime = Math.min(...bryntumEvents.map((e) => new Date(e.startDate).getTime()));
    const d = new Date(minTime);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 1);
    return d;
  }, [bryntumEvents]);

  const calculatedEndDate = useMemo(() => {
    if (bryntumEvents.length === 0) return new Date(2026, 10, 16);
    const maxTime = Math.max(...bryntumEvents.map((e) => new Date(e.endDate).getTime()));
    const d = new Date(maxTime);
    d.setHours(23, 59, 59, 999);
    d.setDate(d.getDate() + 2);
    return d;
  }, [bryntumEvents]);

  const handleResend = () => {
    setIsSentNotice(true);
    setTimeout(() => {
      setIsSentNotice(false);
    }, 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="px-6 py-6 max-w-[1600px] mx-auto space-y-6 font-sans">
        {/* Sample Preview Banner if user toggled demo preview */}
        {showDemoPreview && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 text-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-semibold">Simulated Sample Deliveries &amp; Timeline Active:</span>
              <span>Displaying sample Channel3 shipments and FedEx flight corridors for demonstration.</span>
            </div>
            <button
              onClick={() => setShowDemoPreview(false)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer shrink-0"
            >
              Return to Live Account View
            </button>
          </div>
        )}

        {/* Top Header & Navigation Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Orders &amp; Deliveries
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage hardware purchases, track multi-carrier shipping schedules, and audit invoices.
            </p>
          </div>

          {/* Action Controls & View Switcher */}
          <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
            {/* View Mode Toggle: Clean Segmented Control */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-xs">
              <button
                onClick={() => handleSwitchView('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4 text-gray-500" />
                <span>Orders Table</span>
              </button>
              <button
                onClick={() => handleSwitchView('bryntum')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  viewMode === 'bryntum'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Shipping Schedule</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              <span>Print All</span>
            </button>

            <button
              onClick={() => setIsManualModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0070BA] hover:bg-[#005ea6] text-white rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>

        {/* Top 3 KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Metric 1 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#0070BA]">
                <ShoppingCart className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 block leading-tight">
                  Orders Processed
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900 tracking-tight font-sans">
                    {totalOrdersCount} Orders
                  </span>
                </div>
                <span className="text-sm text-gray-500 font-medium block mt-1">
                  {totalOrdersCount > 0 ? 'All transactions verified & settled' : 'No transactions recorded yet'}
                </span>
              </div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 block leading-tight">
                  Delivery Status
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-emerald-700 tracking-tight font-sans">
                    {totalOrdersCount > 0 ? '100% Dispatched' : 'Standby (Ready)'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500 font-medium">
                    {totalOrdersCount} Delivered / In Transit
                  </span>
                  <button
                    onClick={() => handleSwitchView('bryntum')}
                    className="text-sm text-[#0070BA] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#0070BA]">
                <Wallet className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 block leading-tight">
                  Total Invoiced Volume
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900 tracking-tight font-sans">
                    {netInvoicedVolume}
                  </span>
                  <span className="text-sm font-semibold text-gray-500">INR</span>
                </div>
                <span className="text-sm text-gray-500 font-medium block mt-1">
                  Full PayPal Seller Protection
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workstation: Switchable between Schedule Timeline & Orders Table */}
        {viewMode === 'bryntum' ? (
          <div className="space-y-4">
            {/* Clean Timeline Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
                    <Truck className="w-5 h-5 text-blue-400" />
                    Shipping &amp; Delivery Logistics Schedule
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                    Real-time timeline tracking Channel3 hardware depot allocation, priority domestic air routes (Blue Dart / DHL India), and PayPal autonomous payment releases.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    onClick={() => handleSwitchView('table')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-slate-200 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>View Orders Table</span>
                  </button>
                </div>
              </div>

              {/* 4 Clean Logistics KPI Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-800">
                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                  <span className="text-sm text-slate-400 block font-medium">Active Shipments</span>
                  <span className="text-lg font-bold text-white mt-1 block">
                    {allOrders.length} Hardware Units
                  </span>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                  <span className="text-sm text-slate-400 block font-medium">Fulfillment Hubs</span>
                  <span className="text-lg font-bold text-emerald-400 mt-1 block">
                    {allOrders.length > 0 ? 'Bengaluru & Gurugram' : 'Standby (Bengaluru / Gurugram)'}
                  </span>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                  <span className="text-sm text-slate-400 block font-medium">Air Freight Corridors</span>
                  <span className="text-lg font-bold text-blue-400 mt-1 block">
                    {allOrders.length > 0 ? 'Blue Dart & DHL India' : 'Ready (Blue Dart / DHL India)'}
                  </span>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                  <span className="text-sm text-slate-400 block font-medium">Escrow Protection</span>
                  <span className="text-lg font-bold text-cyan-400 mt-1 block">100% Protected</span>
                </div>
              </div>
            </div>

            {/* Standby Banner if genuine user has 0 orders */}
            {allOrders.length === 0 && !showDemoPreview && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Logistics Pipelines on Standby</h4>
                    <p className="text-sm text-slate-400 mt-0.5">
                      No active shipments scheduled for {user?.email || 'your account'}. Place an order in the Catalog or preview sample flight routes.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setShowDemoPreview(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Preview Sample Logistics Schedule
                  </button>
                  <Link
                    href="/catalog"
                    className="px-4 py-2 bg-[#0070BA] hover:bg-[#005ea6] text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    Browse Catalog
                  </Link>
                </div>
              </div>
            )}

            {/* Interactive Timeline Component */}
            <BryntumSchedulerWrapper
              resources={bryntumResources}
              events={bryntumEvents}
              startDate={calculatedStartDate}
              endDate={calculatedEndDate}
              height={620}
              viewPreset="dayAndWeek"
            />

            {/* Clean Timeline Legend */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-wrap items-center gap-4 text-sm">
              <span className="font-semibold text-gray-800">Route Legend:</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                Channel3 South Depot (Bengaluru Electronics City)
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Channel3 North Hub (Delhi NCR / Gurugram)
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Blue Dart / FedEx Priority Express
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                DHL Express India Air Cargo
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                PayPal Smart Escrow Lock (INR Settlement)
              </span>
            </div>
          </div>
        ) : allOrders.length === 0 ? (
          /* Personalized Empty State for Real Users with 0 Orders */
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-[#0070BA]">
              <Package className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Welcome{user?.name ? `, ${user.name}` : ''}! No orders placed yet
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your authenticated account ({user?.email || 'your profile'}) does not have any active hardware orders. When you purchase items through our Catalog or autonomous AI shopping studio, your digital tax receipts and delivery schedule will appear here.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
              <Link
                href="/catalog"
                className="px-5 py-2.5 bg-[#0070BA] hover:bg-[#005ea6] text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
              >
                Browse Apps &amp; Hardware Catalog
              </Link>
              <Link
                href="/studio"
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-semibold transition-colors"
              >
                Launch AI Shopping Studio
              </Link>
              <button
                onClick={() => setShowDemoPreview(true)}
                className="px-4 py-2.5 border border-dashed border-gray-300 hover:border-gray-400 text-gray-600 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                Preview Sample Orders
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Orders Table (col-span-7) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
                {/* Header inside Card */}
                <div className="p-4 border-b border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-5 h-5 text-gray-700" />
                      <h2 className="text-base font-bold text-gray-900">
                        Order History ({filteredOrders.length})
                      </h2>
                    </div>

                    {/* Date Filter */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Showing:</span>
                      <div className="relative">
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          aria-label="Filter orders by time window"
                          className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus:border-[#0070BA] pr-7 cursor-pointer"
                        >
                          <option value="7d">Last 7 Days</option>
                          <option value="24h">Last 24 Hours</option>
                          <option value="30d">Last 30 Days</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by Order ID, Customer Name, or Hardware Model..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:border-[#0070BA] shadow-xs"
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
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 select-none">
                        <th className="py-3 px-4 w-10"></th>
                        <th className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span>Order ID</span>
                            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                        </th>
                        <th className="py-3 px-4">Hardware Item</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span>Amount</span>
                            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                        </th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                      {filteredOrders.map((order) => {
                        const isSelected = order.id === selectedOrderId;

                        return (
                          <tr
                            key={order.id}
                            onClick={() => setSelectedOrderId(order.id)}
                            className={`transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50/70 font-medium'
                                : 'hover:bg-gray-50/80'
                            }`}
                          >
                            {/* Radio Selector */}
                            <td className="py-4 px-4 text-center">
                              <input
                                type="radio"
                                name="selected_order"
                                checked={isSelected}
                                onChange={() => setSelectedOrderId(order.id)}
                                className="w-4 h-4 text-[#0070BA] border-gray-300 focus:ring-[#0070BA] cursor-pointer"
                              />
                            </td>

                            {/* Order ID */}
                            <td className="py-4 px-4 font-mono font-semibold text-[#0070BA] whitespace-nowrap text-sm">
                              {order.id}
                            </td>

                            {/* Hardware Item */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <MiniThumbnail model={order.modelKey} />
                                <div>
                                  <span className="font-bold text-gray-900 block leading-tight text-sm">
                                    {order.name}
                                  </span>
                                  <span className="text-sm text-gray-500 block mt-0.5">
                                    {order.modelKey === 'macbook-pro' ? 'M3 Pro • 36GB' : order.specs.split('•')[0].trim()}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Customer */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2 text-gray-700 text-sm">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>{order.customerName}</span>
                              </div>
                            </td>

                            {/* Amount */}
                            <td className="py-4 px-4 font-bold text-gray-900 whitespace-nowrap text-sm">
                              {order.amount}
                            </td>

                            {/* Payment Method */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                <span className="font-medium">{order.paymentMethod}</span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              {order.status === 'DELIVERED' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  Delivered
                                </span>
                              )}
                              {order.status === 'IN_TRANSIT' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                                  In Transit
                                </span>
                              )}
                              {order.status === 'ON_HOLD' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                                  Escrow Hold
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {filteredOrders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-500">
                            <p className="font-semibold text-gray-800 text-base">No matching orders found</p>
                            <p className="text-sm text-gray-500 mt-1">Try clearing your search query.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 bg-white border-t border-gray-200 gap-3 text-sm text-gray-600">
                  <span>
                    Showing 1 to {filteredOrders.length} of {filteredOrders.length} orders
                  </span>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span>Rows per page:</span>
                      <select
                        defaultValue="10"
                        aria-label="Select rows per page"
                        className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#0070BA] cursor-pointer"
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        disabled
                        title="Previous Page"
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-400 disabled:opacity-40 cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="w-7 h-7 bg-[#0070BA] text-white rounded-lg font-bold flex items-center justify-center text-sm shadow-xs">
                        1
                      </span>
                      <button
                        disabled
                        title="Next Page"
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-400 disabled:opacity-40 cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Invoice & Digital Receipt Preview (col-span-5) */}
            <div className="lg:col-span-5">
              {!selectedOrder ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-[#0070BA]">
                    <Package className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-900">No Order Selected</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                      Select an order from the list on the left to inspect digital invoice details and tracking status.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
                  {/* Receipt Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xl tracking-tight text-[#003087]">
                          Pay<span className="text-[#0070BA]">Pal</span>
                        </span>
                        <span className="bg-blue-50 text-[#0070BA] font-semibold text-sm px-3 py-0.5 rounded-full border border-blue-200">
                          Sandbox Invoice
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900">
                        Sales Receipt &amp; Tax Invoice
                      </h3>
                      <p className="text-sm text-gray-500">
                        PayPal Developer Sandbox • PayPilot AI
                      </p>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-16 h-16 bg-white p-1 rounded-lg border border-gray-200 shadow-xs flex items-center justify-center">
                        <svg viewBox="0 0 29 29" className="w-full h-full fill-gray-900">
                          <path d="M0,0 h7 v7 h-7 z M1,1 v5 h5 v-5 z M2,2 h3 v3 h-3 z" />
                          <path d="M22,0 h7 v7 h-7 z M23,1 v5 h5 v-5 z M24,2 h3 v3 h-3 z" />
                          <path d="M0,22 h7 v7 h-7 z M1,23 v5 h5 v-5 z M2,24 h3 v3 h-3 z" />
                          <rect x="9" y="2" width="2" height="2" />
                          <rect x="13" y="1" width="3" height="1" />
                          <rect x="17" y="3" width="2" height="2" />
                          <rect x="9" y="6" width="3" height="1" />
                          <rect x="2" y="9" width="3" height="1" />
                          <rect x="10" y="10" width="3" height="3" />
                          <rect x="15" y="9" width="2" height="2" />
                          <rect x="20" y="11" width="2" height="3" />
                          <rect x="25" y="9" width="3" height="2" />
                          <rect x="10" y="15" width="2" height="4" />
                          <rect x="14" y="14" width="3" height="2" />
                          <rect x="18" y="17" width="4" height="2" />
                          <rect x="24" y="15" width="3" height="3" />
                          <rect x="9" y="22" width="3" height="2" />
                          <rect x="14" y="24" width="2" height="3" />
                          <rect x="18" y="22" width="3" height="2" />
                          <rect x="23" y="24" width="4" height="2" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-400 mt-1">Verified</span>
                    </div>
                  </div>

                  {/* Metadata Reference Boxes */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                      <span className="text-gray-500 font-medium block">Invoice Number</span>
                      <span className="font-mono font-bold text-gray-900 mt-0.5 block">
                        INV-2026-{selectedOrder.id.replace('ORD-', '')}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                      <span className="text-gray-500 font-medium block">Invoice Date</span>
                      <span className="font-semibold text-gray-900 mt-0.5 block">
                        {selectedOrder.date}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                      <span className="text-gray-500 font-medium block">Order ID</span>
                      <span className="font-mono font-bold text-[#0070BA] mt-0.5 block">
                        {selectedOrder.id}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                      <span className="text-gray-500 font-medium block">Capture ID</span>
                      <span className="font-mono font-bold text-gray-900 mt-0.5 block truncate">
                        {selectedOrder.transactionId}
                      </span>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-2 text-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="font-semibold text-gray-700">Billed To:</span>
                      <span className="text-emerald-700 bg-emerald-50 text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                        Verified PayPal Customer
                      </span>
                    </div>
                    <div className="pt-1">
                      <div className="font-bold text-gray-900">{selectedOrder.customerName}</div>
                      <div className="text-gray-600 font-mono text-sm mt-0.5">{selectedOrder.customerEmail}</div>
                      <div className="text-gray-500 text-sm mt-1">
                        Shipping Address: Flat 402, Prestige Tech Vista, Kadubeesanahalli, Outer Ring Road, Bengaluru, Karnataka 560103
                      </div>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                        <tr>
                          <th className="py-2.5 px-3">Item Description</th>
                          <th className="py-2.5 px-3 text-center">Qty</th>
                          <th className="py-2.5 px-3 text-right">Unit Price</th>
                          <th className="py-2.5 px-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-800">
                        <tr>
                          <td className="py-3 px-3">
                            <span className="font-bold block text-gray-900">{selectedOrder.name}</span>
                            <span className="text-xs text-gray-500 block mt-0.5">{selectedOrder.specs}</span>
                          </td>
                          <td className="py-3 px-3 text-center font-semibold">1</td>
                          <td className="py-3 px-3 text-right font-medium">{selectedOrder.amount}</td>
                          <td className="py-3 px-3 text-right font-bold text-gray-900">{selectedOrder.amount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Invoice Summary Totals */}
                  <div className="space-y-2 pt-2 border-t border-gray-100 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-900">{selectedOrder.amount}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Express Shipping (Blue Dart / DHL Express)</span>
                      <span className="font-semibold text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Estimated GST / Tax (0.0%)</span>
                      <span className="font-medium text-gray-900">₹0.00 INR</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-gray-200 text-base font-bold text-gray-900">
                      <span>Total Paid</span>
                      <span className="text-xl text-[#0070BA] font-extrabold font-sans">
                        {selectedOrder.amount}
                      </span>
                    </div>
                  </div>

                  {/* Seller Protection & Escrow Banner */}
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold block">PayPal Seller Protection Guaranteed</span>
                      <span className="text-xs text-emerald-700 block mt-0.5">
                        Eligible for unauthorized payment and item-not-received coverage under PayPal Sandbox rails.
                      </span>
                    </div>
                  </div>

                  {/* Receipt Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handlePrint}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={handleResend}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0070BA] hover:bg-[#005ea6] text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{isSentNotice ? 'Receipt Sent!' : 'Email Receipt'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Create Manual Invoice */}
        {isManualModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <Plus className="w-5 h-5 text-[#0070BA]" />
                  <h3 className="text-lg font-bold text-gray-900">Issue Manual Tax Invoice</h3>
                </div>
                <button
                  onClick={() => setIsManualModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-sm">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1 text-sm">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name || 'Rahul Verma'}
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0070BA]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1 text-sm">
                    Customer Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || 'rahul.verma@example.com'}
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0070BA]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1 text-sm">
                    Catalog Hardware Item
                  </label>
                  <select
                    defaultValue="asus-rog"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0070BA]"
                  >
                    <option value="asus-rog">ASUS ROG Zephyrus G16 (₹1,25,990 INR)</option>
                    <option value="lenovo-loq">Lenovo LOQ 15 (₹62,990 INR)</option>
                    <option value="macbook-pro">Apple MacBook Pro 14 M3 Pro (₹1,69,900 INR)</option>
                    <option value="hp-victus">HP Victus 15 (₹58,990 INR)</option>
                    <option value="dell-g15">Dell G15 Gaming (₹65,490 INR)</option>
                    <option value="lenovo-legion">Lenovo Legion Pro 5 (₹1,09,990 INR)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1 text-sm">
                    Payment Terms
                  </label>
                  <select
                    defaultValue="immediate"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0070BA]"
                  >
                    <option value="immediate">Due upon receipt (Immediate Settlement)</option>
                    <option value="net15">Net 15 Days</option>
                    <option value="net30">Net 30 Days</option>
                  </select>
                </div>

                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-900 leading-relaxed">
                  Generated invoices simulate official PayPal merchant accounts eligible for Seller Protection upon capture.
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-5 py-2 bg-[#0070BA] hover:bg-[#005ea6] text-white rounded-xl text-sm font-semibold shadow-xs cursor-pointer"
                >
                  Issue Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#0070BA] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-500">Loading orders &amp; shipping schedules...</p>
            </div>
          </div>
        </DashboardLayout>
      }
    >
      <OrdersViewContent />
    </Suspense>
  );
}
