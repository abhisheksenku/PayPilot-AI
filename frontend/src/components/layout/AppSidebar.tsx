'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Home,
  Box,
  Wrench,
  BarChart3,
  Receipt,
  ChevronRight,
  Code2,
  CheckCircle2,
  X,
  Calendar,
} from 'lucide-react';

interface AppSidebarProps {
  onOpenTestCards?: () => void;
  onOpenCredentials?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  setActiveTab?: (tab: string) => void;
}

export function AppSidebar({
  onOpenTestCards,
  onOpenCredentials,
  isMobileOpen = false,
  onCloseMobile,
  setActiveTab,
}: AppSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewQuery = searchParams ? searchParams.get('view') : null;
  const [environment, setEnvironment] = React.useState<'sandbox' | 'live'>('sandbox');
  const [showLiveNotice, setShowLiveNotice] = React.useState(false);

  const navItems = [
    {
      id: 'studio',
      label: 'Home (Studio)',
      href: '/studio',
      icon: Home,
      hasChevron: false,
    },
    {
      id: 'catalog',
      label: 'Apps & Catalog',
      href: '/catalog',
      icon: Box,
      hasChevron: true,
    },
    {
      id: 'testing',
      label: 'Testing Tools',
      href: '#',
      icon: Wrench,
      hasChevron: true,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        onOpenTestCards?.();
        onCloseMobile?.();
      },
    },
    {
      id: 'ledger',
      label: 'Event Logs & Ledger',
      href: '/transactions',
      icon: BarChart3,
      hasChevron: true,
    },
    {
      id: 'orders',
      label: 'Orders & Receipts',
      href: '/orders',
      icon: Receipt,
      hasChevron: true,
    },
    {
      id: 'bryntum-schedule',
      label: 'Shipping Schedule',
      href: '/orders?view=bryntum',
      icon: Calendar,
      hasChevron: true,
    },
  ];

  const handleEnvToggle = (mode: 'sandbox' | 'live') => {
    if (mode === 'live') {
      setShowLiveNotice(true);
      setTimeout(() => setShowLiveNotice(false), 3000);
      return;
    }
    setEnvironment('sandbox');
  };

  const sidebarContent = (
    <div className="relative z-10 flex flex-col justify-between h-full p-4 space-y-4">
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
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
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-[#003087] leading-none block">
                Pay<span className="text-[#0070BA]">Pal</span>
              </span>
              <span className="text-sm font-medium text-gray-500 tracking-tight leading-none mt-1 block">
                Developer <span className="text-gray-400">•</span> PayPilot AI
              </span>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sandbox / Live Switcher */}
        <div className="relative pt-1">
          <div className="flex items-center bg-[#F3F4F6] p-1.5 rounded-xl border border-gray-200">
            <button
              onClick={() => handleEnvToggle('sandbox')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                environment === 'sandbox'
                  ? 'bg-[#0070BA] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${environment === 'sandbox' ? 'bg-white' : 'bg-gray-400'}`} />
              Sandbox
            </button>
            <button
              onClick={() => handleEnvToggle('live')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                environment === 'live'
                  ? 'bg-[#0070BA] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              Live
            </button>
          </div>

          {showLiveNotice && (
            <div className="absolute top-full left-0 right-0 mt-1.5 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 shadow-lg z-30 animate-fade-in">
              Production live credentials locked. Using verified PayPal Sandbox.
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              (item.id === 'studio' && (pathname === '/studio' || pathname === '/')) ||
              (item.id === 'bryntum-schedule' && pathname === '/orders' && viewQuery === 'bryntum') ||
              (item.id === 'orders' && pathname === '/orders' && viewQuery !== 'bryntum') ||
              (item.id !== 'studio' && item.id !== 'bryntum-schedule' && item.id !== 'orders' && item.href !== '#' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    item.onClick(e);
                  } else {
                    setActiveTab?.(item.id);
                    onCloseMobile?.();
                  }
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#EBF5FF] text-[#0070BA] border border-[#D0E5FF]/70 shadow-xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-[#0070BA]' : 'text-gray-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(item as any).badge && (
                    <span className="text-sm font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                      {(item as any).badge}
                    </span>
                  )}
                  {item.hasChevron && (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom PayPal JS SDK v6 Status Widget */}
      <div className="pt-2">
        <div
          onClick={() => {
            onOpenCredentials?.();
            onCloseMobile?.();
          }}
          className="p-3.5 bg-gradient-to-r from-blue-50/90 to-indigo-50/60 border border-blue-200/90 rounded-2xl cursor-pointer hover:border-[#0070BA]/60 transition-all shadow-xs group backdrop-blur-xs"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-6 h-6 rounded-md bg-[#0070BA]/10 text-[#0070BA] flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-gray-900 group-hover:text-[#0070BA] transition-colors">
              PayPal JS SDK v6
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100/80 text-emerald-800 rounded-full text-sm font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Active
            </span>
            <span className="text-sm text-gray-500 font-mono">v6.1.4</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (100% height down to viewport bottom) */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-white border-r border-gray-200 flex-col h-full min-h-full select-none shrink-0 relative overflow-hidden font-sans">
        {/* Subtle ambient light blue wave at bottom matching blueprint image */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-blue-100/50 via-blue-50/20 to-transparent pointer-events-none" />
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-Over) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10 animate-slide-right flex flex-col overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-blue-100/50 via-blue-50/20 to-transparent pointer-events-none" />
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
