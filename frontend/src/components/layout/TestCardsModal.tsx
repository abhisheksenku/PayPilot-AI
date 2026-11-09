'use client';

import React, { useState } from 'react';
import { X, Copy, Check, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';

interface TestCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestCardsModal: React.FC<TestCardsModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const testCards = [
    {
      brand: 'Visa (PayPal Sandbox)',
      number: '4111 1111 1111 1111',
      raw: '4111111111111111',
      exp: '12/28',
      cvv: '123',
      type: 'Standard 3D Secure / Debit',
    },
    {
      brand: 'Mastercard (PayPal Sandbox)',
      number: '5555 5555 5555 4444',
      raw: '5555555555554444',
      exp: '08/29',
      cvv: '888',
      type: 'Credit Card / Auto-capture',
    },
    {
      brand: 'American Express (Sandbox)',
      number: '3782 822463 10005',
      raw: '378282246310005',
      exp: '05/27',
      cvv: '1005',
      type: 'Direct Escrow Buyer',
    },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0F172A] border border-white/[0.1] shadow-2xl p-6 text-white font-sans animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0070BA]/20 border border-[#0070BA]/40 text-[#0070BA] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">PayPal Sandbox Test Cards</h2>
              <p className="text-xs text-slate-400">Official developer test credentials for live evaluation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="my-4 p-3 rounded-xl bg-[#FFC439]/10 border border-[#FFC439]/20 text-xs text-[#FFC439] flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            These cards simulate successful captures on the official PayPal Sandbox without charging real currency.
          </span>
        </div>

        {/* Card List */}
        <div className="space-y-3">
          {testCards.map((card, idx) => (
            <div
              key={card.raw}
              className="p-3.5 rounded-xl bg-[#080C15] border border-white/[0.06] hover:border-[#0070BA]/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{card.brand}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-slate-300">
                  {card.type}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between bg-[#1E293B]/70 px-3 py-1.5 rounded-lg border border-white/[0.04]">
                <span className="font-mono text-xs font-semibold tracking-wider text-slate-200">
                  {card.number}
                </span>
                <button
                  onClick={() => handleCopy(card.raw, `num-${idx}`)}
                  className="flex items-center gap-1 text-[11px] font-mono text-[#00CFDE] hover:underline"
                >
                  {copiedKey === `num-${idx}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-2 flex items-center gap-4 text-[11px] font-mono text-slate-400">
                <span>
                  EXP: <strong className="text-white">{card.exp}</strong>
                </span>
                <span>
                  CVV: <strong className="text-white">{card.cvv}</strong>
                </span>
                <span>
                  ZIP: <strong className="text-white">95131 (San Jose)</strong>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0070BA] hover:bg-[#005EA6] text-white text-xs font-semibold shadow-md transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
