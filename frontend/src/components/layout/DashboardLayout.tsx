'use client';

import React, { useState, Suspense } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { TestCardsModal } from '../modals/TestCardsModal';
import { CredentialsModal } from '../modals/CredentialsModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isTestCardsOpen, setIsTestCardsOpen] = useState(false);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#F5F7FA] text-gray-900 flex flex-col antialiased overflow-hidden">
      {/* Persistent App Header with Dual Banners (Fixed at top) */}
      <div className="shrink-0 z-40">
        <AppHeader
          onOpenTestCards={() => setIsTestCardsOpen(true)}
          onOpenCredentials={() => setIsCredentialsOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
      </div>

      {/* Main Workspace (Takes remaining viewport height down to bottom of screen) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar (Full height from header down to bottom edge) */}
        <Suspense fallback={<div className="w-64 bg-white border-r border-gray-200 hidden md:block" />}>
          <AppSidebar
            onOpenTestCards={() => setIsTestCardsOpen(true)}
            onOpenCredentials={() => setIsCredentialsOpen(true)}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />
        </Suspense>

        {/* Scrollable Content Viewport */}
        <main className="flex-1 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>

      {/* Global Sandbox Modals */}
      <TestCardsModal
        isOpen={isTestCardsOpen}
        onClose={() => setIsTestCardsOpen(false)}
      />

      <CredentialsModal
        isOpen={isCredentialsOpen}
        onClose={() => setIsCredentialsOpen(false)}
      />
    </div>
  );
}
