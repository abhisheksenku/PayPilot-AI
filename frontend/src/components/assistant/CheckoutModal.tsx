'use client';

import React, { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { X, ShieldCheck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '@/lib/api';
import Link from 'next/link';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    productId: string;
    name: string;
    price: number;
    currency: string;
  };
  conversationId?: string;
  onPaymentSuccess?: (captureId: string, orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  conversationId,
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    captureId: string;
    orderId: string;
    amount: number;
  } | null>(null);
  const [internalOrderId, setInternalOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E53935', '#FFFFFF', '#16A34A'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#141414] border border-[#2B2B2B] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#242424]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E53935]/20 flex items-center justify-center text-[#E53935]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">PayPal Checkout Authorization</h3>
              <p className="text-xs text-zinc-400">Mandatory Human-in-the-Loop Approval</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {successData ? (
            /* Success State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-white">Payment Authorized & Captured!</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  PayPal Sandbox verified and recorded in PayPilot MySQL database.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Order ID:</span>
                  <span className="text-zinc-300 font-bold">{successData.orderId.substring(0, 16)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">PayPal Capture ID:</span>
                  <span className="text-emerald-400 font-bold">{successData.captureId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Amount Paid:</span>
                  <span className="text-white font-bold">${successData.amount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status:</span>
                  <span className="text-emerald-400 font-bold uppercase">COMPLETED (200 OK)</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <span>View in AG Grid Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Authorization State */
            <div className="space-y-5">
              {/* Anti-Tampering Guarantee Banner */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-300">Server-Side Price Guarantee</span>
                  <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                    Amount is strictly locked to database pricing. The AI cannot alter the charge without server validation.
                  </p>
                </div>
              </div>

              {/* Order Item Summary */}
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-sm font-bold text-white line-clamp-1">{product.name}</h5>
                    <p className="text-xs text-zinc-400">Qty: 1 item • Immediate Sandbox Fulfillment</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-white">${product.price.toFixed(2)}</span>
                    <span className="text-[10px] text-zinc-500 block font-mono">USD</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex justify-between text-xs font-bold">
                  <span className="text-zinc-300">Total Authorized Amount</span>
                  <span className="text-[#E53935] text-sm">${product.price.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Error Message if any */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* Official PayPal Buttons SDK */}
              <div className="relative pt-2">
                <PayPalButtons
                  style={{
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal',
                    height: 44,
                  }}
                  disabled={loading}
                  createOrder={async () => {
                    try {
                      setLoading(true);
                      setErrorMessage(null);

                      const orderRes = await api.createPayPalOrder({
                        productId: product.productId,
                        quantity: 1,
                        currency: 'USD',
                        conversationId,
                      });

                      setInternalOrderId(orderRes.orderId);
                      return orderRes.paypalOrderId;
                    } catch (err: any) {
                      setErrorMessage(err.message || 'Error creating PayPal Order');
                      setLoading(false);
                      throw err;
                    }
                  }}
                  onApprove={async (data) => {
                    try {
                      setLoading(true);
                      const captureRes = await api.capturePayPalOrder({
                        paypalOrderId: data.orderID,
                        orderId: internalOrderId || '',
                      });

                      setSuccessData({
                        captureId: captureRes.captureId,
                        orderId: captureRes.orderId,
                        amount: product.price,
                      });

                      triggerConfetti();
                      if (onPaymentSuccess) {
                        onPaymentSuccess(captureRes.captureId, captureRes.orderId);
                      }
                    } catch (err: any) {
                      setErrorMessage(err.message || 'Payment capture failed');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  onError={(err) => {
                    console.error('PayPal Buttons Error:', err);
                    setErrorMessage('An error occurred during PayPal checkout. Please retry.');
                    setLoading(false);
                  }}
                  onCancel={() => {
                    setErrorMessage('Payment authorization was cancelled.');
                    setLoading(false);
                  }}
                />
              </div>

              <div className="text-center text-[11px] text-zinc-500 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-zinc-400" />
                <span>Protected by PayPal 256-Bit SSL Sandbox Encryption</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
