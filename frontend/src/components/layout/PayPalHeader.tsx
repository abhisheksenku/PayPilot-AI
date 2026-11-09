'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
  X,
  CreditCard,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { api } from '@/lib/api';

interface PayPalHeaderProps {
  onToggleSidebar: () => void;
  isSandbox: boolean;
  onOpenTestCards?: () => void;
}

export const PayPalHeader: React.FC<PayPalHeaderProps> = ({
  onToggleSidebar,
  isSandbox,
  onOpenTestCards,
}) => {
  const [showSdkBanner, setShowSdkBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [online, setOnline] = useState<boolean>(true);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  useEffect(() => {
    api.checkHealth().then(setOnline);
    const interval = setInterval(() => {
      api.checkHealth().then(setOnline);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#080C15]/95 backdrop-blur-xl border-b border-white/[0.08]">
      {/* 1. Official PayPal SDK Announcement Banner */}
      {showSdkBanner && (
        <div className="bg-[#0070BA] text-white text-xs px-4 py-2 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 max-w-5xl mx-auto flex-1 justify-center font-medium">
            <Info className="w-4 h-4 shrink-0 text-cyan-200" />
            <span>
              <strong>PayPal JavaScript SDK v6 is Now Available!</strong> Autonomous multi-agent escrow checkpoints are verified.
            </span>
            <a
              href="https://developer.paypal.com/docs/checkout/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold hover:text-cyan-200 ml-1.5 inline-flex items-center gap-1"
            >
              <span>Get Started</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <button
            onClick={() => setShowSdkBanner(false)}
            className="text-white/80 hover:text-white p-0.5 rounded transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Official PayPal Sandbox Mode Bar */}
      {isSandbox && (
        <div className="bg-[#FFC439]/15 border-b border-[#FFC439]/30 text-[#FFC439] px-4 py-1.5 text-xs font-mono flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>You&apos;re in sandbox mode. Transactions simulate real PayPal checkout without charging real funds.</span>
        </div>
      )}

      {/* 3. Main Header Navigation Bar */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle + Developer Profile Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight font-sans">
                Abhishek UthukotaSriram
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0070BA]/20 text-[#00CFDE] border border-[#0070BA]/40">
                Merchant Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
              PayPal Developer Sandbox Account • App ID: <span className="font-mono text-slate-300">sb-paypilot-2026</span>
            </p>
          </div>
        </div>

        {/* Center: Search Box */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation, orders, API events... (Ctrl+K)"
              className="w-full bg-[#0F172A] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#0070BA] focus:ring-1 focus:ring-[#0070BA] transition-all"
            />
          </div>
        </div>

        {/* Right: Security Status + Business Dashboard Link + User Avatar */}
        <div className="flex items-center gap-3">
          {/* Security Guardrail status */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F172A] border border-white/[0.08] text-slate-300 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px]">Guardrail: Armed</span>
          </div>

          {/* PayPal Rails Active indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F172A] border border-white/[0.08] text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                online ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-amber-400'
              }`}
            />
            <span className="text-white text-[11px] font-medium">
              {online ? 'Rails Active' : 'Connecting'}
            </span>
          </div>

          {/* Business Dashboard external link */}
          <a
            href="https://www.paypal.com/mep/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-800"
          >
            <span>Business Dashboard</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <div className="h-6 w-px bg-white/[0.1] hidden sm:block" />

          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#0070BA]/50 transition-all focus:outline-none"
              aria-label="User profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#003087] to-[#0070BA] border border-white/20 flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-sm">
                AU
              </div>
            </button>

            {/* Avatar Dropdown Menu */}
            {showAvatarMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0F172A] border border-white/[0.1] shadow-2xl p-2 z-50 text-xs font-sans">
                <div className="p-2.5 border-b border-white/[0.08]">
                  <p className="font-bold text-white">Abhishek UthukotaSriram</p>
                  <p className="text-slate-400 text-[11px] font-mono mt-0.5">abhishek@developer.paypal.com</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      if (onOpenTestCards) onOpenTestCards();
                      setShowAvatarMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-left"
                  >
                    <CreditCard className="w-4 h-4 text-[#0070BA]" />
                    <span>View Sandbox Test Cards</span>
                  </button>

                  <a
                    href="https://developer.paypal.com/dashboard/applications/sandbox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <span>Developer Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>

                <div className="border-t border-white/[0.08] pt-1">
                  <div className="px-3 py-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Session: Sandbox Authenticated</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
