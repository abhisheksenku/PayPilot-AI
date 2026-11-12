'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
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
  LogOut,
  LogIn,
  UserPlus,
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
  const { user, logout, demoLogin } = useAuth();
  const [showSdkBanner, setShowSdkBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGuardrailMenu, setShowGuardrailMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isRailsActive, setIsRailsActive] = useState(true);

  useEffect(() => {
    // Initial health check against backend Express server
    api
      .checkHealth()
      .then((healthy) => {
        setIsRailsActive(healthy);
      })
      .catch(() => {
        setIsRailsActive(false);
      });
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'AU';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const displayName = user ? user.name : 'Abhishek UthukotaSriram';
  const displayInitials = user ? getInitials(user.name) : 'AU';

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col bg-white border-b border-gray-200 font-sans">
      {/* Top Banner 1: PayPal JS SDK v6 Announcement */}
      {showSdkBanner && (
        <div className="bg-[#0070BA] text-white text-sm py-2 px-4 flex items-center justify-between font-medium transition-all shadow-xs">
          <div className="flex-1 flex items-center justify-center gap-2 text-center truncate">
            <Info className="w-4 h-4 shrink-0 text-white/90" />
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
            className="text-white/80 hover:text-white p-1 rounded transition-colors shrink-0 ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner 2: Sandbox Mode Warning */}
      <div className="bg-[#FEF3C7] text-[#92400E] border-b border-[#FDE68A] text-sm py-1.5 px-4 flex items-center justify-center gap-2 font-medium">
        <AlertTriangle className="w-4 h-4 shrink-0 text-[#B45309]" />
        <span className="truncate">You&apos;re in sandbox mode. Transactions simulate real PayPal checkout.</span>
        <button
          onClick={onOpenTestCards}
          className="text-sm font-semibold text-[#0070BA] hover:underline ml-1 hidden md:inline-flex items-center gap-0.5 shrink-0 cursor-pointer"
        >
          View Test Cards →
        </button>
      </div>

      {/* Main Header Bar */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: User Identity & Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleMobileSidebar}
            aria-label="Open navigation menu"
            className="p-2 -ml-1 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm sm:text-base text-gray-900 hidden sm:inline truncate max-w-[200px] xl:max-w-none">
              {displayName}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Merchant</span> Verified
            </span>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-sm sm:max-w-md lg:max-w-lg mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search APIs, products, orders... (Ctrl+K)"
              className="w-full pl-10 pr-4 py-2 bg-gray-50/80 hover:bg-gray-100/70 focus:bg-white text-sm text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0070BA]/20 focus:border-[#0070BA] transition-all truncate"
            />
          </div>
        </div>

        {/* Right: Security, Telemetry, Auth Buttons, Avatar */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Guardrail Status */}
          <div className="relative">
            <button
              onClick={() => setShowGuardrailMenu(!showGuardrailMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-sm font-semibold text-emerald-800 transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">Guardrail: Armed</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
            </button>

            {showGuardrailMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 text-sm space-y-2.5 animate-fade-in">
                <div className="font-bold text-gray-900 flex items-center justify-between">
                  <span>Guardrail Policy</span>
                  <span className="text-sm bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                    LEVEL 3
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Autonomous agents cannot complete funds capture without user human-in-the-loop authorization.
                </p>
                <div className="border-t border-gray-100 pt-2 space-y-1.5 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Budget Limit:</span>
                    <span className="font-semibold text-gray-900">₹70,000 INR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Locked Amount:</span>
                    <span className="font-semibold text-emerald-700">₹62,990 INR</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rails Status */}
          <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <Radio className={`w-4 h-4 ${isRailsActive ? 'text-emerald-600' : 'text-amber-600'}`} />
            <span>{isRailsActive ? 'Rails Active' : 'Rails (Sandbox)'}</span>
          </div>

          {/* Guest Sign-in Links if unauthenticated */}
          {!user && (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3.5 py-1.5 text-sm font-semibold text-white bg-[#0070BA] hover:bg-[#005ea6] rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 rounded-full bg-[#0070BA] text-white font-bold text-sm flex items-center justify-center hover:opacity-95 shadow-xs ring-2 ring-[#0070BA]/20 transition-all cursor-pointer"
            >
              {displayInitials}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 text-sm animate-fade-in">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenCredentials?.();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center justify-between cursor-pointer"
                    >
                      <span>PayPal Credentials</span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenTestCards?.();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center justify-between cursor-pointer"
                    >
                      <span>Test Credit Cards</span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-bold text-gray-900">Guest Visitor</p>
                      <p className="text-sm text-gray-500">Sign in to save orders &amp; tests</p>
                    </div>
                    <Link
                      href="/login"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account</span>
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        demoLogin();
                      }}
                      className="w-full text-left px-4 py-2 text-[#0070BA] font-semibold hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Instant Demo Sign-In</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
