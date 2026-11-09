import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-[#262626] bg-[#0F0F0F] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-300">PayPilot AI</span>
          <span>•</span>
          <span>PayPal AI Hackathon 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Zero Client Pricing Tampering Guarantee
          </span>
          <span>•</span>
          <span>Powered by PayPal Orders v2 & Google Gemini</span>
        </div>
      </div>
    </footer>
  );
};
