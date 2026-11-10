'use client';

import React, { useState } from 'react';
import { Key, Shield, Copy, Check, ExternalLink, X } from 'lucide-react';

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CredentialsModal({ isOpen, onClose }: CredentialsModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const credentials = [
    {
      label: 'PayPal Sandbox Client ID',
      value: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'BAAVk7P6q2_0X5aK_Q4V8HnZ99L64aU3EaB-6Xg1Yk1J2d8F4n_5S1z7v2L-1_gK',
      description: 'Public sandbox client identifier powering the PayPal JS SDK v6 buttons.',
      masked: false,
    },
    {
      label: 'PayPal Sandbox Secret',
      value: 'E****************************************************************-w',
      description: 'Used by the backend for OAuth2 Bearer token generation to /v2/checkout/orders.',
      masked: true,
    },
    {
      label: 'Backend REST API Endpoint',
      value: 'http://localhost:5000/api',
      description: 'Node.js Express backend serving health, catalog, agent swarms, and PayPal order proxy.',
      masked: false,
    },
    {
      label: 'PayPal Webhook URL (Simulated)',
      value: 'http://localhost:5000/api/webhooks/paypal',
      description: 'Listens for PAYMENT.CAPTURE.COMPLETED and CHECKOUT.ORDER.APPROVED events.',
      masked: false,
    },
  ];

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F5F7FA] border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0070BA]/10 text-[#0070BA] flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">API Credentials & PayPal Sandbox Config</h3>
              <p className="text-xs text-gray-500">Official PayPal Developer portal test environment keys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Connected to PayPal Sandbox REST API v2. Active merchant account:{' '}
              <strong className="font-semibold">Abhishek UthukotaSriram</strong>.
            </span>
          </div>

          <div className="space-y-3">
            {credentials.map((cred) => (
              <div key={cred.label} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">{cred.label}</span>
                  <button
                    onClick={() => handleCopy(cred.label, cred.value)}
                    className="flex items-center gap-1 text-[11px] font-medium text-[#0070BA] hover:text-[#005ea6] transition-colors"
                  >
                    {copiedKey === cred.label ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-xs text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200 truncate select-all">
                  {cred.value}
                </div>
                <p className="text-[11px] text-gray-500">{cred.description}</p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-[#0070BA] flex items-center justify-between">
            <span>Learn more about PayPal JS SDK v6 features & capabilities</span>
            <a
              href="https://developer.paypal.com/docs/multiparty/checkout/standard/integrate/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold hover:underline"
            >
              Docs <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 bg-[#F5F7FA] border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
