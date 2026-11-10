'use client';

import React, { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-gray-900 flex flex-col">
      {/* Persistent App Header with Dual Banners */}
      <AppHeader
        onOpenTestCards={() => setIsTestCardsOpen(true)}
        onOpenCredentials={() => setIsCredentialsOpen(true)}
      />

      {/* Main Workspace with Persistent Left Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <AppSidebar
          onOpenTestCards={() => setIsTestCardsOpen(true)}
          onOpenCredentials={() => setIsCredentialsOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
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
