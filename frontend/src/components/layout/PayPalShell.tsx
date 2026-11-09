'use client';

import React, { useState } from 'react';
import { PayPalSidebar } from './PayPalSidebar';
import { PayPalHeader } from './PayPalHeader';
import { TestCardsModal } from './TestCardsModal';
import { CredentialsModal } from './CredentialsModal';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface PayPalShellProps {
  children: React.ReactNode;
}

export const PayPalShell: React.FC<PayPalShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSandbox, setIsSandbox] = useState(true);
  const [showTestCards, setShowTestCards] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const handleToggleSandbox = () => {
    if (isSandbox) {
      setBannerNotice(
        '⚠️ Live Mode Blocked: PayPal AI Hackathon evaluation requires authenticated Sandbox Rails.'
      );
      setTimeout(() => setBannerNotice(null), 4000);
    } else {
      setIsSandbox(true);
      setBannerNotice('✓ Switched to PayPal Developer Sandbox mode.');
      setTimeout(() => setBannerNotice(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C15] text-slate-100 flex flex-col font-sans selection:bg-[#0070BA] selection:text-white">
      {/* 1. Official Left Navigation Sidebar */}
      <PayPalSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isSandbox={isSandbox}
        onToggleSandbox={handleToggleSandbox}
        onOpenTestCards={() => setShowTestCards(true)}
        onOpenCredentials={() => setShowCredentials(true)}
      />

      {/* 2. Main Content Container (offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        {/* Top Header */}
        <PayPalHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isSandbox={isSandbox}
          onOpenTestCards={() => setShowTestCards(true)}
        />

        {/* Transient Notice Toast */}
        {bannerNotice && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#0F172A] border border-white/[0.1] shadow-2xl text-xs font-sans text-white flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <AlertCircle className="w-4 h-4 text-[#FFC439] shrink-0" />
            <span>{bannerNotice}</span>
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>

      {/* Developer Tool Modals */}
      <TestCardsModal isOpen={showTestCards} onClose={() => setShowTestCards(false)} />
      <CredentialsModal isOpen={showCredentials} onClose={() => setShowCredentials(false)} />
    </div>
  );
};
