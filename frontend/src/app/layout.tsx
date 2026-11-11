import type { Metadata } from 'next';
import './globals.css';
import { PayPalProvider } from '@/components/providers/PayPalProvider';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'PayPilot AI — Intelligent Purchasing Agent with User-Controlled Financial Authorization',
  description: 'Autonomous Multi-Agent Hardware Commerce with Server-Side Price Validation and Human-in-the-Loop Financial Guardrail',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#F5F7FA] text-gray-900 antialiased selection:bg-[#0070BA] selection:text-white overflow-x-hidden">
        <AuthProvider>
          <PayPalProvider>
            {children}
          </PayPalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
