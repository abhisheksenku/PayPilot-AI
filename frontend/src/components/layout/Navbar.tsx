'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Layers, ShoppingBag, BarChart3, Receipt, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';

export const Navbar = () => {
  const pathname = usePathname();
  const [online, setOnline] = useState<boolean>(true);

  useEffect(() => {
    api.checkHealth().then(setOnline);
    const interval = setInterval(() => {
      api.checkHealth().then(setOnline);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Shopping Studio', href: '/assistant', icon: Bot },
    { label: 'Spec Matrix', href: '/compare', icon: Layers },
    { label: 'Hardware Catalog', href: '/catalog', icon: ShoppingBag },
    { label: 'AG Grid Ledger', href: '/dashboard', icon: BarChart3 },
    { label: 'Orders & Receipts', href: '/orders', icon: Receipt },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#080C15]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#003087] via-[#0070BA] to-[#2563EB] flex items-center justify-center text-white font-extrabold text-base shadow-fintech-glow transition-all group-hover:scale-105 border border-white/20">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white tracking-tight">PayPilot</span>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-[#0070BA]/20 text-[#00CFDE] border border-[#0070BA]/40">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans font-medium">Agentic Commerce • PayPal 2026</p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0F172A] p-1.5 rounded-xl border border-white/[0.08]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0070BA] text-white shadow-fintech-glow'
                    : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Telemetry Status Badges */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F172A] border border-white/[0.08] text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px]">Human Guardrail: Armed</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F172A] border border-white/[0.08]">
            <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-amber-400'}`} />
            <span className="text-white font-medium text-[11px]">
              {online ? 'PayPal Rails Active' : 'Connecting'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
