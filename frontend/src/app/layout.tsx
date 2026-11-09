import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PayPalProvider } from '@/components/providers/PayPalProvider';

export const metadata: Metadata = {
  title: 'PayPilot AI — Autonomous Agentic Commerce Platform',
  description: 'AI-Powered Agentic Commerce with Multi-Agent Orchestration & PayPal Sandbox Checkout for the PayPal AI Hackathon 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#0D0D0D] text-zinc-100 antialiased selection:bg-[#E53935] selection:text-white">
        <PayPalProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
        </PayPalProvider>
      </body>
    </html>
  );
}
