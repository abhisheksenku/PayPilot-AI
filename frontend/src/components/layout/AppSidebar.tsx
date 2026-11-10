'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

interface AppSidebarProps {
  onOpenTestCards?: () => void;
  onOpenCredentials?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  activeTab?: string;
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
    <div className="flex flex-col justify-between h-full p-4 space-y-6">
      <div className="space-y-5">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between lg:hidden pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-[#003087]">
              Pay<span className="text-[#0070BA]">Pal</span>
            </span>
            <span className="text-[11px] text-gray-500 font-medium">Developer</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sandbox / Live Switcher */}
        <div className="relative">
          <div className="flex items-center bg-[#F3F4F6] p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => handleEnvToggle('sandbox')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                environment === 'sandbox'
                  ? 'bg-[#0070BA] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${environment === 'sandbox' ? 'bg-white' : 'bg-gray-400'}`} />
              Sandbox
            </button>
            <button
              onClick={() => handleEnvToggle('live')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                environment === 'live'
                  ? 'bg-[#0070BA] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              Live
            </button>
          </div>

          {showLiveNotice && (
            <div className="absolute top-full left-0 right-0 mt-1.5 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 shadow-lg z-30 animate-fade-in">
              Production live credentials are locked. Use verified PayPal Sandbox environment.
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              (item.id === 'studio' && (pathname === '/studio' || pathname === '/')) ||
              (item.id !== 'studio' && pathname.startsWith(item.href));

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
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EBF5FF] text-[#0070BA] font-semibold border border-[#D0E5FF]/70 shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#0070BA]' : 'text-gray-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.hasChevron && (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom PayPal JS SDK v6 Status Widget */}
      <div>
        <div
          onClick={() => {
            onOpenCredentials?.();
            onCloseMobile?.();
          }}
          className="p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-200/80 rounded-2xl cursor-pointer hover:border-[#0070BA]/50 transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-[#0070BA]/10 text-[#0070BA] flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-bold text-gray-900 group-hover:text-[#0070BA] transition-colors">
              PayPal JS SDK v6
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100/80 text-emerald-800 rounded-full text-[11px] font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Active
            </span>
            <span className="text-[10px] text-gray-500 font-mono">v6.1.4</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex w-60 xl:w-64 bg-white border-r border-gray-200 flex-col h-full min-h-[calc(100vh-105px)] select-none shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-Over) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Canvas */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10 animate-slide-right flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
