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
} from 'lucide-react';

interface AppHeaderProps {
  onOpenTestCards?: () => void;
  onOpenCredentials?: () => void;
}

export function AppHeader({ onOpenTestCards, onOpenCredentials }: AppHeaderProps) {
  const [showSdkBanner, setShowSdkBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGuardrailMenu, setShowGuardrailMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col bg-white border-b border-gray-200">
      {/* Top Banner 1: PayPal JS SDK v6 Announcement */}
      {showSdkBanner && (
        <div className="bg-[#0070BA] text-white text-xs py-2 px-4 flex items-center justify-between font-medium transition-all shadow-xs">
          <div className="flex-1 flex items-center justify-center gap-2 text-center">
            <Info className="w-4 h-4 shrink-0 text-white/90" />
            <span>
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
            className="text-white/80 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner 2: Sandbox Mode Warning */}
      <div className="bg-[#FEF3C7] text-[#92400E] border-b border-[#FDE68A] text-xs py-1.5 px-4 flex items-center justify-center gap-2 font-medium">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#B45309]" />
        <span>You&apos;re in sandbox mode. Transactions simulate real PayPal checkout.</span>
        <button
          onClick={onOpenTestCards}
          className="text-xs font-semibold text-[#0070BA] hover:underline ml-2 hidden sm:inline-flex items-center gap-1"
        >
          View Test Cards →
        </button>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-16 px-6 flex items-center justify-between gap-4">
        {/* Left: User Identity & Verification */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
              <User className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-gray-900 hidden sm:inline">
              Abhishek UthukotaSriram
            </span>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Merchant Verified
          </span>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search APIs, products, orders... (Ctrl+K)"
              className="w-full pl-10 pr-4 py-2 bg-gray-50/80 hover:bg-gray-100/70 focus:bg-white text-xs md:text-sm text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0070BA]/20 focus:border-[#0070BA] transition-all"
            />
          </div>
        </div>

        {/* Right: Security & Network Indicators */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Guardrail Status */}
          <div className="relative">
            <button
              onClick={() => setShowGuardrailMenu(!showGuardrailMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-xs font-semibold text-emerald-800 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Guardrail: Armed</span>
              <ChevronDown className="w-3 h-3 text-emerald-600 ml-0.5" />
            </button>

            {showGuardrailMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-3.5 z-50 text-xs space-y-2 animate-fade-in">
                <div className="font-bold text-gray-900 flex items-center justify-between">
                  <span>Guardrail Enforcement</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                    LEVEL 3
                  </span>
                </div>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  Prevents autonomous agent purchase execution beyond locked price caps.
                  Requires explicit user checkout authorization before funds capture.
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
                  <div className="flex justify-between">
                    <span>Safety Margin:</span>
                    <span className="font-semibold text-emerald-700">$75.00 UNDER</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rails Status */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Rails Active</span>
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 rounded-full bg-[#0070BA] text-white font-bold text-xs flex items-center justify-center hover:opacity-95 shadow-sm ring-2 ring-[#0070BA]/20 transition-all cursor-pointer"
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
