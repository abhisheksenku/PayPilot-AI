'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Layers, ShoppingBag, BarChart3, Receipt, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';

export const Navbar = () => {
  const pathname = usePathname();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    api.checkHealth().then(setBackendOnline);
    const interval = setInterval(() => {
      api.checkHealth().then(setBackendOnline);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'AI Assistant', href: '/assistant', icon: Bot },
    { label: 'Compare', href: '/compare', icon: Layers },
    { label: 'Catalog', href: '/catalog', icon: ShoppingBag },
    { label: 'AG Grid Dashboard', href: '/dashboard', icon: BarChart3 },
    { label: 'Orders', href: '/orders', icon: Receipt },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#262626] bg-[#111111]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E53935] to-[#B71C1C] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#E53935]/20 group-hover:scale-105 transition-transform">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">PayPilot</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-[#E53935]/20 text-[#E53935] border border-[#E53935]/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium">Autonomous Agentic Commerce</p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#1A1A1A] p-1 rounded-xl border border-[#2B2B2B]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#E53935] text-white shadow-md shadow-[#E53935]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#262626]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Status Pill & Human-In-Loop Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A1A1A] border border-[#2B2B2B] text-[11px] text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E53935]" />
            <span>Human-Auth Checkpoint</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181B] border border-[#2B2B2B]">
            <span
              className={`w-2 h-2 rounded-full ${
                backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-[11px] font-mono text-zinc-300">
              {backendOnline ? 'PayPal Sandbox Live' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
