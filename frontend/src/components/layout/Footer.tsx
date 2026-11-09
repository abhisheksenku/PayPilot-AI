import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#080C15] py-8 mt-auto text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-tight">PayPilot AI</span>
          <span>•</span>
          <span className="font-sans">PayPal AI Hackathon 2026 — Agentic Commerce Track</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero-Tamper Price Lock
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Lock className="w-3.5 h-3.5 text-paypal-blue" />
            PayPal Orders v2 & Captures v2
          </span>
        </div>
      </div>
    </footer>
  );
};
