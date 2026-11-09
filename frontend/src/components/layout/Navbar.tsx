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
    <header className="sticky top-0 z-40 w-full border-b border-[#23252B] bg-[#090A0C]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#E53535] flex items-center justify-center text-white font-black text-lg shadow-sm transition-transform group-hover:scale-105">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white tracking-tight">PayPilot</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-[#E53535]/15 text-[#E53535] border border-[#E53535]/30">
                AI
              </span>
            </div>
            <p className="text-xs text-[#8F94A0] font-mono">Agentic Commerce • PayPal 2026</p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#111215] p-1.5 rounded-xl border border-[#23252B]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#E53535] text-white shadow-sm font-semibold'
                    : 'text-[#8F94A0] hover:text-white hover:bg-[#17181D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Telemetry Status Badges */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111215] border border-[#23252B] text-[#8F94A0]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Human Guardrail: Armed</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111215] border border-[#23252B]">
            <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-white font-medium">
              {online ? 'PayPal Rails Active' : 'Connecting'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
