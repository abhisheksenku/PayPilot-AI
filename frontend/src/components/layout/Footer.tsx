import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-[#23252B] bg-[#090A0C] py-8 mt-auto font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#8F94A0]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-tight">PayPilot AI</span>
          <span>•</span>
          <span>PayPal AI Hackathon 2026 — Agentic Commerce Track</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero-Tamper Server Price Lock
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            PayPal Orders v2 & Captures v2
          </span>
        </div>
      </div>
    </footer>
  );
};
