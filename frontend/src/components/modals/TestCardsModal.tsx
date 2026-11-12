'use client';

import React, { useState } from 'react';
import { X, Copy, Check, CreditCard, AlertCircle } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-gray-200 shadow-2xl p-6 text-gray-900 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0070BA]/10 border border-[#0070BA]/20 text-[#0070BA] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">PayPal Sandbox Test Cards</h2>
              <p className="text-sm text-gray-500">Official developer test credentials for live evaluation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="my-4 p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-sm text-[#92400E] flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#B45309]" />
          <span>
            These cards simulate successful captures on the official PayPal Sandbox without charging real currency.
          </span>
        </div>

        {/* Card List */}
        <div className="space-y-3.5">
          {testCards.map((card, idx) => (
            <div
              key={card.raw}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#0070BA] transition-all shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">{card.brand}</span>
                <span className="text-sm font-mono px-2.5 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700 font-medium">
                  {card.type}
                </span>
              </div>

              <div className="mt-2.5 flex items-center justify-between bg-white px-3.5 py-2.5 rounded-lg border border-gray-200">
                <span className="font-mono text-base font-bold tracking-wider text-gray-900">
                  {card.number}
                </span>
                <button
                  onClick={() => handleCopy(card.raw, `num-${idx}`)}
                  className="flex items-center gap-1.5 text-sm font-mono font-bold text-[#0070BA] hover:underline"
                >
                  {copiedKey === `num-${idx}` ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-2.5 flex items-center gap-5 text-sm font-mono text-gray-700">
                <span>
                  EXP: <strong className="text-gray-900">{card.exp}</strong>
                </span>
                <span>
                  CVV: <strong className="text-gray-900">{card.cvv}</strong>
                </span>
                <span>
                  ZIP: <strong className="text-gray-900">95131</strong>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#0070BA] hover:bg-[#005EA6] text-white text-sm font-semibold shadow-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
