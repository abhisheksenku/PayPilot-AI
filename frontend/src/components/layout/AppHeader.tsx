'use client';

import React, { useState } from 'react';
import {
  Search,
  Shield,
  Radio,
  ChevronDown,
  User,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  ExternalLink,
  Menu,
} from 'lucide-react';

interface AppHeaderProps {
  onOpenTestCards?: () => void;
  onOpenCredentials?: () => void;
  onToggleMobileSidebar?: () => void;
}

export function AppHeader({
  onOpenTestCards,
  onOpenCredentials,
  onToggleMobileSidebar,
}: AppHeaderProps) {
  const [showSdkBanner, setShowSdkBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGuardrailMenu, setShowGuardrailMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col bg-white border-b border-gray-200">
      {/* Top Banner 1: PayPal JS SDK v6 Announcement */}
      {showSdkBanner && (
        <div className="bg-[#0070BA] text-white text-[12px] sm:text-xs py-2 px-3 sm:px-4 flex items-center justify-between font-medium transition-all shadow-2xs">
          <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-center truncate">
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-white/90" />
            <span className="truncate">
              PayPal JavaScript SDK v6 is Now Available!{' '}
              <button
                onClick={onOpenCredentials}
                className="font-bold underline hover:text-white/90 inline-flex items-center gap-1 cursor-pointer transition-opacity"
              >
                Get Started →
              </button>
            </span>
          </div>
          <button
            onClick={() => setShowSdkBanner(false)}
            aria-label="Dismiss banner"
            className="text-white/80 hover:text-white p-1 rounded transition-colors shrink-0 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner 2: Sandbox Mode Warning */}
      <div className="bg-[#FEF3C7] text-[#92400E] border-b border-[#FDE68A] text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 font-medium">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#B45309]" />
        <span className="truncate">You&apos;re in sandbox mode. Transactions simulate real PayPal checkout.</span>
        <button
          onClick={onOpenTestCards}
          className="text-[11px] sm:text-xs font-semibold text-[#0070BA] hover:underline ml-1 hidden md:inline-flex items-center gap-1 shrink-0"
        >
          View Test Cards →
        </button>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Hamburger & Brand & User Identity */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile Hamburger Button */}
          <button
            onClick={onToggleMobileSidebar}
            aria-label="Open navigation menu"
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* PayPal Developer Brand Monogram */}
          <div className="flex items-center gap-2.5 pr-2 border-r border-gray-200/80">
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
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
            <div className="hidden sm:block">
              <span className="font-extrabold text-base tracking-tight text-[#003087] leading-none block">
                Pay<span className="text-[#0070BA]">Pal</span>
              </span>
              <span className="text-[10px] font-medium text-gray-500 tracking-tight leading-none">
                Developer <span className="text-gray-400">•</span> PayPilot AI
              </span>
            </div>
          </div>

          {/* User Identity & Merchant Verified */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-100 hidden sm:flex items-center justify-center text-gray-600 border border-gray-200 shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-gray-900 hidden md:inline truncate max-w-[150px] xl:max-w-none">
              Abhishek UthukotaSriram
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span className="hidden sm:inline">Merchant</span> Verified
            </span>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-xs md:max-w-md lg:max-w-lg mx-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search APIs, products, orders... (Ctrl+K)"
              className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-gray-50/80 hover:bg-gray-100/70 focus:bg-white text-xs sm:text-[13px] text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0070BA]/20 focus:border-[#0070BA] transition-all truncate"
            />
          </div>
        </div>

        {/* Right: Security, Telemetry, Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Guardrail Armed Button */}
          <div className="relative">
            <button
              onClick={() => setShowGuardrailMenu(!showGuardrailMenu)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-[11px] sm:text-xs font-semibold text-emerald-800 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">Guardrail: Armed</span>
              <ChevronDown className="w-3 h-3 text-emerald-600 ml-0.5" />
            </button>

            {showGuardrailMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-3.5 z-50 text-xs space-y-2 animate-fade-in">
                <div className="font-bold text-gray-900 flex items-center justify-between">
                  <span>Guardrail Policy</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                    LEVEL 3
                  </span>
                </div>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  Autonomous agents cannot complete funds capture without user human-in-the-loop authorization.
                </p>
                <div className="border-t border-gray-100 pt-2 space-y-1 text-[11px] text-gray-700">
                  <div className="flex justify-between">
                    <span>Budget Limit:</span>
                    <span className="font-semibold text-gray-900">$824.00 USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Locked Amount:</span>
                    <span className="font-semibold text-emerald-700">$749.00 USD</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rails Status */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rails Active</span>
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0070BA] text-white font-bold text-xs flex items-center justify-center hover:opacity-95 shadow-2xs ring-2 ring-[#0070BA]/20 transition-all cursor-pointer"
            >
              AU
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 text-xs animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-bold text-gray-900">Abhishek UthukotaSriram</p>
                  <p className="text-[11px] text-gray-500">Merchant Account</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenCredentials?.();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center justify-between"
                >
                  <span>PayPal Credentials</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenTestCards?.();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center justify-between"
                >
                  <span>Sandbox Test Cards</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
