import type { Metadata } from 'next';
import './globals.css';
import { PayPalProvider } from '@/components/providers/PayPalProvider';
import { PayPalShell } from '@/components/layout/PayPalShell';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'PayPilot AI — PayPal Developer Portal & Autonomous Shopping Swarm',
  description: 'AI-Powered Agentic Commerce with Multi-Agent Orchestration & PayPal Sandbox Checkout for the PayPal AI Hackathon 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#080C15] text-white antialiased selection:bg-[#0070BA] selection:text-white">
        <PayPalProvider>
          <PayPalShell>
            {children}
            <Footer />
          </PayPalShell>
        </PayPalProvider>
      </body>
    </html>
  );
}
