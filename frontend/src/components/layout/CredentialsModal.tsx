'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Code2, ShieldCheck, Terminal, Server } from 'lucide-react';

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const credentials = [
    {
      label: 'PayPal Sandbox Client ID',
      value: 'sb-43yup38484838_mock_sandbox_token',
      key: 'client-id',
    },
    {
      label: 'PayPal REST Orders v2 Endpoint',
      value: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      key: 'orders-v2',
    },
    {
      label: 'PayPal REST Payments Capture v2 Endpoint',
      value: 'https://api-m.sandbox.paypal.com/v2/payments/captures',
      key: 'captures-v2',
    },
    {
      label: 'PayPilot Swarm Escrow Webhook Listener',
      value: 'https://api.paypilot.ai/api/v1/paypal/webhook',
      key: 'webhook',
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
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">PayPal APIs & Credentials</h2>
              <p className="text-xs text-slate-400">Sandbox REST endpoints and client credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Credentials List */}
        <div className="space-y-3.5 my-4">
          {credentials.map((cred) => (
            <div
              key={cred.key}
              className="p-3 rounded-xl bg-[#080C15] border border-white/[0.06] space-y-1.5"
            >
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                {cred.label}
              </div>
              <div className="flex items-center justify-between bg-[#1E293B]/70 px-3 py-1.5 rounded-lg border border-white/[0.04]">
                <span className="font-mono text-xs text-slate-200 truncate max-w-[320px]">
                  {cred.value}
                </span>
                <button
                  onClick={() => handleCopy(cred.value, cred.key)}
                  className="flex items-center gap-1 text-[11px] font-mono text-[#00CFDE] hover:underline shrink-0 ml-2"
                >
                  {copiedKey === cred.key ? (
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
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="p-3 rounded-xl bg-[#1E293B]/60 border border-white/[0.06] text-xs text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Cryptographic Escrow Checkpoint is active on all orders.</span>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0070BA] hover:bg-[#005EA6] text-white text-xs font-semibold shadow-md transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
