'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  ShoppingCart,
  ShieldCheck,
  Wallet,
  Filter,
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
} from 'lucide-react';

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
  status: 'DELIVERED' | 'IN_TRANSIT';
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
    amount: '$749.00 USD',
    amountNumeric: 749.0,
    paymentMethod: 'PayPal Balance',
    status: 'DELIVERED',
    date: 'Nov 10, 2026',
    time: '10:24 AM (IST)',
    shipping: 'Free',
    tax: '$0.00',
  },
  {
    id: 'ORD-8837',
    transactionId: 'TXN-Z9M8P1VQ',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@example.com',
    name: 'MacBook Pro 14',
    specs: 'M3 Pro • 36GB Unified RAM • 14.2" Liquid Retina',
    modelKey: 'macbook-pro',
    amount: '$1,849.00 USD',
    amountNumeric: 1849.0,
    paymentMethod: 'PayPal Balance',
    status: 'IN_TRANSIT',
    date: 'Nov 09, 2026',
    time: '04:37 PM (IST)',
    shipping: 'Free',
    tax: '$0.00',
  },
  {
    id: 'ORD-8831',
    transactionId: 'TXN-H6D4R2PL',
    customerName: 'Arjun Rao',
    customerEmail: 'arjun.rao@example.com',
    name: 'HP Victus 15',
    specs: 'RTX 3050 • 16GB DDR5 • 144Hz FHD',
    modelKey: 'hp-victus',
    amount: '$699.00 USD',
    amountNumeric: 699.0,
    paymentMethod: 'PayPal Balance',
    status: 'DELIVERED',
    date: 'Nov 09, 2026',
    time: '01:15 PM (IST)',
    shipping: 'Free',
    tax: '$0.00',
  },
  {
    id: 'ORD-8828',
    transactionId: 'TXN-K5P7N8JV',
    customerName: 'Neha Gupta',
    customerEmail: 'neha.gupta@example.com',
    name: 'ASUS ROG Zephyrus G16',
    specs: 'RTX 4070 • 32GB DDR5 • 240Hz 2.5K',
    modelKey: 'asus-rog',
    amount: '$1,499.00 USD',
    amountNumeric: 1499.0,
    paymentMethod: 'PayPal Balance',
    status: 'DELIVERED',
    date: 'Nov 08, 2026',
    time: '08:42 PM (IST)',
    shipping: 'Free',
    tax: '$0.00',
  },
  {
    id: 'ORD-8823',
    transactionId: 'TXN-V3Q9L6BW',
    customerName: 'Karan Mehta',
    customerEmail: 'karan.mehta@example.com',
    name: 'Dell G15',
    specs: 'RTX 4050 • 16GB DDR5 • 165Hz FHD',
    modelKey: 'dell-g15',
    amount: '$779.00 USD',
    amountNumeric: 779.0,
    paymentMethod: 'PayPal Balance',
    status: 'DELIVERED',
    date: 'Nov 08, 2026',
    time: '11:06 AM (IST)',
    shipping: 'Free',
    tax: '$0.00',
  },
  {
    id: 'ORD-8819',
    transactionId: 'TXN-M2X7F9GT',
    customerName: 'Sakshi Iyer',
    customerEmail: 'sakshi.iyer@example.com',
    name: 'Lenovo Legion Pro 5',
    specs: 'RTX 4060 • 32GB DDR5 • 16" WQXGA 240Hz',
    modelKey: 'lenovo-legion',
    amount: '$1,299.00 USD',
    amountNumeric: 1299.0,
    paymentMethod: 'PayPal Balance',
    status: 'IN_TRANSIT',
    date: 'Nov 07, 2026',
    time: '06:21 PM (IST)',
    shipping: 'Free',
    tax: '$0.00',
  },
];

function MiniThumbnail({ model }: { model: OrderItem['modelKey'] }) {
  switch (model) {
    case 'lenovo-loq':
      return (
        <div className="w-10 h-7.5 rounded bg-[#10141f] border border-[#2d313d] p-0.5 flex flex-col justify-between shrink-0 shadow-2xs overflow-hidden">
          <div className="flex justify-between items-center text-[5px] text-white">
            <span className="bg-[#E2231A] px-0.5 rounded-xs font-bold">LOQ</span>
          </div>
          <div className="text-center font-black text-[6px] text-white tracking-wider bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            LOQ 15
          </div>
          <div className="h-0.5 bg-cyan-400/80 rounded-full w-full" />
        </div>
      );
    case 'macbook-pro':
      return (
        <div className="w-10 h-7.5 rounded bg-[#18191c] border border-gray-700 p-0.5 flex flex-col justify-between shrink-0 shadow-2xs overflow-hidden">
          <div className="flex justify-between items-center text-[5px] text-gray-400">
            <span className="font-semibold text-[4px]">M3 Pro</span>
          </div>
          <div className="text-center my-auto">
            <svg className="w-2.5 h-2.5 mx-auto fill-gray-200" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.56-.69.95-1.64.84-2.6-.82.04-1.8.56-2.38 1.24-.51.59-.96 1.55-.84 2.48.91.07 1.83-.43 2.38-1.12z" />
            </svg>
          </div>
          <div className="h-0.5 bg-gray-500 rounded-full w-3/4 mx-auto" />
        </div>
      );
    case 'hp-victus':
      return (
        <div className="w-10 h-7.5 rounded bg-[#15171c] border border-blue-900/60 p-0.5 flex flex-col justify-between shrink-0 shadow-2xs overflow-hidden">
          <div className="flex justify-between items-center text-[5px] text-gray-300">
            <span className="font-bold text-blue-400 text-[4px]">VICTUS</span>
          </div>
          <div className="text-center my-auto">
            <span className="text-[#0070BA] font-black text-[8px] tracking-tighter">▼</span>
          </div>
          <div className="h-0.5 bg-[#0070BA] rounded-full w-full" />
        </div>
      );
    case 'asus-rog':
      return (
        <div className="w-10 h-7.5 rounded bg-[#0d0e12] border border-purple-900/60 p-0.5 flex flex-col justify-between shrink-0 shadow-2xs overflow-hidden">
          <div className="flex justify-between items-center text-[5px] text-gray-300">
            <span className="font-bold text-red-500 text-[4px]">ROG</span>
          </div>
          <div className="text-center font-black text-[6px] text-purple-300 tracking-wider">
            G16
          </div>
          <div className="h-0.5 bg-gradient-to-r from-red-500 to-purple-500 rounded-full w-full" />
        </div>
      );
    case 'dell-g15':
      return (
        <div className="w-10 h-7.5 rounded bg-[#0f141d] border border-cyan-900/50 p-0.5 flex flex-col justify-between shrink-0 shadow-2xs overflow-hidden">
          <div className="flex justify-between items-center text-[5px] text-gray-300">
            <span className="font-bold text-cyan-400 text-[4px]">DELL</span>
          </div>
          <div className="text-center font-black text-[6px] text-cyan-200">
            G15
          </div>
          <div className="h-0.5 bg-cyan-500 rounded-full w-full" />
        </div>
      );
    case 'lenovo-legion':
      return (
        <div className="w-10 h-7.5 rounded bg-[#121520] border border-indigo-900/60 p-0.5 flex flex-col justify-between shrink-0 shadow-2xs overflow-hidden">
          <div className="flex justify-between items-center text-[5px] text-gray-300">
            <span className="font-bold text-indigo-400 text-[4px]">LEGION</span>
          </div>
          <div className="text-center font-black text-[6px] text-indigo-200">
            PRO 5
          </div>
          <div className="h-0.5 bg-indigo-500 rounded-full w-full" />
        </div>
      );
  }
}

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string>('ORD-8842');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('7d');
  const [isSentNotice, setIsSentNotice] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Selected Order
  const selectedOrder = useMemo(() => {
    return (
      INITIAL_ORDERS.find((o) => o.id === selectedOrderId) ||
      INITIAL_ORDERS[0]
    );
  }, [selectedOrderId]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return INITIAL_ORDERS.filter((order) => {
      const q = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.name.toLowerCase().includes(q) ||
        order.transactionId.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

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
      <div className="px-6 py-5 max-w-[1600px] mx-auto space-y-4">
        {/* Top Header & Global Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Orders &amp; Digital Receipts
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Verified PayPal Sandbox Order Fulfillment &amp; Tax Invoice Audit
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => {}}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs transition-all cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-gray-500" />
              <span>Filter Orders</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-gray-500" />
              <span>Print All</span>
            </button>

            <button
              onClick={() => setIsManualModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0070BA] hover:bg-[#005ea6] text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create Manual Invoice</span>
            </button>
          </div>
        </div>

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Metric 1: Total Orders Processed */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#0070BA]">
                <ShoppingCart className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 block leading-tight">
                  Total Orders Processed
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-gray-900 tracking-tight font-mono">
                    6 Orders
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 ml-1">
                    ▲ +100%
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                  All Sandbox Settled
                </span>
              </div>
            </div>
          </div>

          {/* Metric 2: Fulfillment Status */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 block leading-tight">
                  Fulfillment Status
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-gray-900 tracking-tight font-mono">
                    100% Dispatched
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                  6 Delivered / In Transit
                </span>
              </div>
            </div>
          </div>

          {/* Metric 3: Net Invoiced Volume */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#0070BA]">
                <Wallet className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 block leading-tight">
                  Net Invoiced Volume
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-gray-900 tracking-tight font-mono">
                    $6,874.00
                  </span>
                  <span className="text-xs font-bold text-gray-500 font-mono">USD</span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                  Full Seller Protection
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Two-Pane Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Order History Table (60% width = col-span-7) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between">
              {/* Header inside Card */}
              <div className="p-3.5 border-b border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <h2 className="text-sm font-bold text-gray-900">
                      Order History ({filteredOrders.length})
                    </h2>
                  </div>

                  {/* Date Filter */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>Showing:</span>
                    <div className="relative">
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        aria-label="Filter orders by time window"
                        className="appearance-none bg-white border border-gray-200 rounded px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-[#0070BA] pr-6 cursor-pointer"
                      >
                        <option value="7d">Last 7 Days</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="30d">Last 30 Days</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Customer, or Item..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-4 py-1.5 text-xs placeholder-gray-400 text-gray-900 focus:outline-none focus:border-[#0070BA] shadow-2xs"
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
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200 select-none">
                      <th className="py-2.5 px-3 w-8"></th>
                      <th className="py-2.5 px-3">
                        <div className="flex items-center gap-1">
                          <span>Order ID</span>
                          <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3">Hardware Item</th>
                      <th className="py-2.5 px-3">Customer Name</th>
                      <th className="py-2.5 px-3">
                        <div className="flex items-center gap-1">
                          <span>Amount</span>
                          <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-2.5 px-3">Payment Method</th>
                      <th className="py-2.5 px-3">Status</th>
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
                              ? 'bg-blue-50/60 font-medium'
                              : 'hover:bg-gray-50/70'
                          }`}
                        >
                          {/* Radio Selector */}
                          <td className="py-3 px-3 text-center">
                            <input
                              type="radio"
                              name="selected_order"
                              checked={isSelected}
                              onChange={() => setSelectedOrderId(order.id)}
                              className="w-3.5 h-3.5 text-[#0070BA] border-gray-300 focus:ring-[#0070BA] cursor-pointer"
                            />
                          </td>

                          {/* Order ID */}
                          <td className="py-3 px-3 font-mono font-semibold text-[#0070BA] whitespace-nowrap">
                            {order.id}
                          </td>

                          {/* Hardware Item */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <MiniThumbnail model={order.modelKey} />
                              <div>
                                <span className="font-bold text-gray-900 block leading-tight">
                                  {order.name}
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono block">
                                  {order.modelKey === 'macbook-pro' ? 'M3 Pro' : order.specs.split('•')[0].trim()}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-gray-700">
                              <User className="w-3 h-3 text-gray-400" />
                              <span>{order.customerName}</span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="py-3 px-3 font-bold font-mono text-gray-900 whitespace-nowrap">
                            {order.amount}
                          </td>

                          {/* Payment Method */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-[11px] text-gray-600">
                              <svg viewBox="0 0 32 32" className="w-3 h-3" fill="none">
                                <path
                                  d="M10.5 4h8.2c4.2 0 7.3 2.8 6.5 7.1-.8 4.2-4.1 6.6-8.2 6.6h-3.4L11.8 28H7l4.8-21.6c.2-.9.5-1.7 1.1-2.1.5-.3 1.1-.3 1.6-.3z"
                                  fill="#003087"
                                />
                                <path
                                  d="M14.2 11h7.8c3.9 0 6.8 2.6 6 6.6-.7 3.9-3.8 6.1-7.6 6.1h-3.2L15.4 33H11l4.4-20c.2-.8.5-1.6 1-2 .5-.3 1.1-.3 1.6-.3z"
                                  fill="#0070BA"
                                  style={{ mixBlendMode: 'multiply' }}
                                />
                              </svg>
                              <span>{order.paymentMethod}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            {order.status === 'DELIVERED' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                DELIVERED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Truck className="w-2.5 h-2.5 text-emerald-600" />
                                IN TRANSIT
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-gray-400">
                          No matching orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-2.5 bg-white border-t border-gray-200 gap-2 text-xs text-gray-500">
                <span>
                  Showing 1 – {filteredOrders.length} of {filteredOrders.length} orders
                </span>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span>Rows per page:</span>
                    <div className="relative">
                      <select
                        defaultValue="10"
                        aria-label="Select rows per page"
                        className="appearance-none bg-white border border-gray-200 rounded px-2 py-0.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-[#0070BA] pr-5 cursor-pointer"
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-gray-400 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center gap-1">
                    <button
                      disabled
                      title="Previous Page"
                      className="p-1 rounded text-gray-300 hover:text-gray-500 disabled:opacity-40 cursor-not-allowed"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 h-6 bg-[#0070BA] text-white rounded font-bold flex items-center justify-center text-xs shadow-2xs">
                      1
                    </span>
                    <button
                      disabled
                      title="Next Page"
                      className="p-1 rounded text-gray-300 hover:text-gray-500 disabled:opacity-40 cursor-not-allowed"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Official PayPal Digital Receipt Preview (40% width = col-span-5) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4 relative">
              {/* Receipt Top Header */}
              <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <span className="font-extrabold text-lg tracking-tight text-[#003087]">
                        Pay<span className="text-[#0070BA]">Pal</span>
                      </span>
                    </div>
                    <span className="bg-[#EBF5FF] text-[#0070BA] font-bold text-[10px] px-2 py-0.5 rounded-full border border-blue-200">
                      SANDBOX RECEIPT
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">
                    Digital Sales Receipt &amp; Tax Invoice
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    PayPal Developer (Sandbox) • PayPilot AI
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-14 h-14 bg-white p-1 rounded-md border border-gray-200 shadow-2xs flex items-center justify-center">
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
                  <span className="text-[9px] text-gray-400 font-medium mt-1">
                    Verify Receipt
                  </span>
                </div>
              </div>

              {/* Order Reference & Transaction ID Boxes */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-gray-50/90 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-medium uppercase">
                    <Package className="w-3 h-3 text-[#0070BA]" />
                    <span>Order Reference</span>
                  </div>
                  <span className="font-bold font-mono text-gray-900 block mt-0.5 text-xs">
                    {selectedOrder.id}
                  </span>
                </div>

                <div className="p-2.5 bg-gray-50/90 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-medium uppercase">
                    <FileText className="w-3 h-3 text-[#0070BA]" />
                    <span>PayPal Transaction ID</span>
                  </div>
                  <span className="font-bold font-mono text-gray-900 block mt-0.5 text-xs truncate">
                    {selectedOrder.transactionId}
                  </span>
                </div>
              </div>

              {/* Customer & Order Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs border-y border-gray-100 py-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                    <User className="w-3 h-3 text-gray-400" />
                    <span>Customer</span>
                  </div>
                  <span className="font-bold text-gray-900 block leading-tight">
                    {selectedOrder.customerName}
                  </span>
                  <span className="text-[11px] text-gray-500 block font-mono">
                    {selectedOrder.customerEmail}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>Order Date</span>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-900 block leading-tight">
                      {selectedOrder.date}, {selectedOrder.time}
                    </span>
                  </div>

                  <div className="space-y-0.5 pt-1">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                      <CreditCard className="w-3 h-3 text-gray-400" />
                      <span>Payment Method</span>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-900 block leading-tight">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

              {/* Itemized Cost Breakdown */}
              <div className="space-y-2">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 text-[10px] border-b border-gray-200 pb-1 font-semibold uppercase">
                      <th className="text-left pb-1">Item Description</th>
                      <th className="text-center pb-1 w-10">Qty</th>
                      <th className="text-right pb-1">Amount (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <MiniThumbnail model={selectedOrder.modelKey} />
                          <div>
                            <span className="font-bold text-gray-900 block text-xs leading-tight">
                              {selectedOrder.name} Gaming &amp; ML Laptop
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
                              {selectedOrder.specs}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 text-center font-bold text-gray-800">1</td>
                      <td className="py-2 text-right font-bold font-mono text-gray-900">
                        ${selectedOrder.amountNumeric.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Subtotals & Fees */}
                <div className="pt-2 border-t border-gray-100 space-y-1 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Hardware Unit Price</span>
                    <span className="font-mono">${selectedOrder.amountNumeric.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-semibold">{selectedOrder.shipping}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (0%)</span>
                    <span className="font-mono">{selectedOrder.tax}</span>
                  </div>
                </div>

                {/* Total (Paid) Highlight Strip */}
                <div className="bg-[#F0F7FF] border border-[#D0E5FF] rounded-lg px-4 py-2.5 flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-xs">Total (Paid)</span>
                  <span className="font-black text-[#0070BA] text-lg font-mono tracking-tight">
                    ${selectedOrder.amountNumeric.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* PayPal Seller Protection Guarantee Pill */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-800 text-xs block leading-tight">
                    ✔ PayPal Verified Merchant Paid
                  </span>
                  <span className="text-[11px] text-emerald-700 block mt-0.5 leading-snug">
                    This transaction is protected by PayPal Seller Protection.
                  </span>
                </div>
              </div>

              {/* Receipt Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handlePrint}
                  className="w-full bg-[#0070BA] hover:bg-[#005ea6] text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Receipt</span>
                </button>

                <button
                  onClick={handleResend}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  {isSentNotice ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Sent!</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      <span>Resend to Buyer</span>
                    </>
                  )}
                </button>
              </div>

              {isSentNotice && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-center text-xs text-emerald-800 animate-in fade-in">
                  Digital invoice email dispatched to <strong>{selectedOrder.customerEmail}</strong>!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal: Create Manual Invoice */}
        {isManualModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setIsManualModalOpen(false)}
          >
            <div
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0070BA] flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Create PayPal Sandbox Manual Invoice
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Issue verified merchant invoice for hardware purchase
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsManualModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    Buyer Name &amp; Email
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      defaultValue="Devendra Rao"
                      placeholder="Buyer Full Name"
                      className="border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0070BA]"
                    />
                    <input
                      type="email"
                      defaultValue="devendra.rao@example.com"
                      placeholder="buyer@example.com"
                      className="border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0070BA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    Hardware Item
                  </label>
                  <select
                    defaultValue="lenovo-loq"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0070BA]"
                  >
                    <option value="lenovo-loq">Lenovo LOQ 15 ($749.00 USD)</option>
                    <option value="macbook-pro">Apple MacBook Pro 14 M3 Pro ($1,849.00 USD)</option>
                    <option value="hp-victus">HP Victus 15 ($699.00 USD)</option>
                    <option value="asus-rog">ASUS ROG Zephyrus G16 ($1,499.00 USD)</option>
                    <option value="dell-g15">Dell G15 Gaming ($779.00 USD)</option>
                    <option value="lenovo-legion">Lenovo Legion Pro 5 ($1,299.00 USD)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    Payment Terms
                  </label>
                  <select
                    defaultValue="immediate"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0070BA]"
                  >
                    <option value="immediate">Due upon receipt (Immediate Settlement)</option>
                    <option value="net15">Net 15 Days</option>
                    <option value="net30">Net 30 Days</option>
                  </select>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-[11px] text-blue-900 leading-relaxed">
                  Notice: Generated sandbox invoices simulate real PayPal merchant accounts and are eligible for Instant PayPal Seller Protection upon capture.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-3.5 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-1.5 bg-[#0070BA] hover:bg-[#005ea6] text-white rounded-lg text-xs font-semibold shadow-2xs cursor-pointer"
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
