'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileCode2,
  Cpu,
  Activity,
  Receipt,
  FileText,
  Code2,
  Wrench,
  Video,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';

interface PayPalSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isSandbox: boolean;
  onToggleSandbox: () => void;
  onOpenTestCards?: () => void;
  onOpenCredentials?: () => void;
}

export const PayPalSidebar: React.FC<PayPalSidebarProps> = ({
  isOpen,
  onClose,
  isSandbox,
  onToggleSandbox,
  onOpenTestCards,
  onOpenCredentials,
}) => {
  const pathname = usePathname();

  const primaryNavItems = [
    { label: 'Home (Studio)', href: '/assistant', icon: Home, badge: 'AI' },
    { label: 'Apps & Catalog', href: '/catalog', icon: FileCode2 },
    { label: 'Testing Tools', href: '/compare', icon: Cpu },
    { label: 'Event Logs & Ledger', href: '/dashboard', icon: Activity, count: '142' },
    { label: 'Orders & Receipts', href: '/orders', icon: Receipt },
  ];

  const secondaryNavItems = [
    { label: 'Dev Docs', href: '/', icon: FileText },
    { label: 'APIs & SDKs', onClick: onOpenCredentials, icon: Code2, isAction: true },
    { label: 'Test Credit Cards', onClick: onOpenTestCards, icon: Wrench, isAction: true },
    { label: 'Video Pitch Library', href: '/#video', icon: Video },
    { label: 'Help & Support', href: 'https://developer.paypal.com/docs/support', icon: HelpCircle, external: true },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#080C15] border-r border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header: PayPal Wordmark + Close Button (Mobile) */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* PayPal Dual-P Monogram + Wordmark */}
            <div className="flex items-center gap-2">
              <svg className="w-6 h-7" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20.25 4.5C19.125 1.5 15.75 0 11.25 0H3.375C2.625 0 2.0625 0.5625 1.875 1.3125L0 19.5C0 20.0625 0.375 20.625 0.9375 20.625H6L7.125 13.5H9.75C15 13.5 18.75 11.25 19.875 5.625C20.25 5.25 20.25 4.875 20.25 4.5Z"
                  fill="#003087"
                />
                <path
                  d="M21.75 7.5C21.75 7.125 21.75 6.75 21.75 6.375C21 11.625 17.25 14.25 11.625 14.25H8.625L6.75 26.25C6.75 26.625 7.125 27 7.5 27H12.375C13.125 27 13.6875 26.4375 13.875 25.6875L15 18.75L15.375 16.875H16.125C20.625 16.875 23.625 14.625 24.375 10.125C24.75 8.25 24.375 7.5 21.75 7.5Z"
                  fill="#0070BA"
                />
                <path
                  d="M20.25 4.5C19.875 4.125 19.5 3.75 19.125 3.75C18.375 9 14.625 11.625 9 11.625H6L7.125 4.5H3.375L1.875 14.625C2.0625 13.875 2.625 13.3125 3.375 13.3125H6.75L7.875 6.1875H9C14.25 6.1875 18 8.4375 19.125 14.0625C19.5 13.6875 19.875 13.3125 20.25 12.5625C21 8.25 20.625 5.625 20.25 4.5Z"
                  fill="#0079C1"
                />
              </svg>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white font-sans">
                  PayPal<span className="text-[#0070BA] font-normal">Developer</span>
                </span>
                <span className="block text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  PayPilot AI Suite
                </span>
              </div>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sandbox / Live Toggle Switcher (Authentic PayPal Developer UI) */}
        <div className="px-4 py-3 border-b border-white/[0.08] bg-[#0B111E]">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span
              className={`transition-colors ${
                isSandbox ? 'text-white font-bold' : 'text-slate-400'
              }`}
            >
              Sandbox
            </span>

            {/* Switch pill */}
            <button
              onClick={onToggleSandbox}
              aria-label="Toggle Sandbox / Live Mode"
              className={`relative w-11 h-6 rounded-full transition-colors p-0.5 focus:outline-none border ${
                isSandbox
                  ? 'bg-[#0070BA] border-[#005EA6]'
                  : 'bg-emerald-600 border-emerald-500'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  isSandbox ? 'translate-x-0' : 'translate-x-5'
                }`}
              />
            </button>

            <span
              className={`transition-colors ${
                !isSandbox ? 'text-white font-bold' : 'text-slate-400'
              }`}
            >
              Live
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Developer Sandbox Active</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
          {/* Primary Nav List */}
          <nav className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Core Applications
            </div>
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#0070BA] text-white font-semibold shadow-fintech-glow'
                      : 'text-slate-300 hover:text-white hover:bg-[#1E293B]/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="border-t border-white/[0.08]" />

          {/* Secondary Nav List (Developer Tools & Docs) */}
          <nav className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Developer & Sandbox Tools
            </div>
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;

              if (item.isAction) {
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1E293B]/70 transition-all text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href || '#'}
                  target={item.external ? '_blank' : '_self'}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1E293B]/70 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.external ? (
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info card */}
        <div className="p-3 border-t border-white/[0.08] bg-[#0B111E]">
          <div className="p-2.5 rounded-lg bg-[#0F172A] border border-white/[0.06] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0070BA]/20 border border-[#0070BA]/40 text-[#0070BA] flex items-center justify-center font-bold text-xs">
              v6
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-white truncate">PayPal JS SDK v6</div>
              <div className="text-[10px] text-slate-400 truncate">React PayPal JS 8.7</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
