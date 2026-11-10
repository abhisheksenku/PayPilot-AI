import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PayPilot AI — Autonomous Agentic Commerce on PayPal Rails',
  description: 'PayPal AI Hackathon 2026 — Agentic Commerce Track',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F5F7FA] text-gray-900 antialiased selection:bg-[#0070BA] selection:text-white">
        {children}
      </body>
    </html>
  );
}
