import type { Metadata } from 'next';
import './globals.css';
import { PayPalProvider } from '@/components/providers/PayPalProvider';

export const metadata: Metadata = {
  title: 'PayPilot AI — PayPal Developer Portal & Autonomous Shopping Swarm',
  description: 'Autonomous Multi-Agent Hardware Commerce with PayPal Escrow & Price Locks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F5F7FA] text-gray-900 antialiased selection:bg-[#0070BA] selection:text-white">
        <PayPalProvider>
          {children}
        </PayPalProvider>
      </body>
    </html>
  );
}
