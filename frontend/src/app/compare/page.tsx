'use client';

import React, { useEffect, useState } from 'react';
import { api, ProductItem } from '@/lib/api';
import { Layers, Check, ShoppingCart, Award } from 'lucide-react';
import { CheckoutModal } from '@/components/assistant/CheckoutModal';

export default function ComparePage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: string;
    name: string;
    price: number;
    currency: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api.getProducts().then((data) => {
      // Pick top 3 for side-by-side comparison
      setProducts(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  const specFeatures = [
    { label: 'Processor (CPU)', key: 'processor' },
    { label: 'Graphics (GPU)', key: 'gpu' },
    { label: 'Memory (RAM)', key: 'ram' },
    { label: 'Storage (SSD)', key: 'storage' },
    { label: 'Display & Refresh Rate', key: 'display' },
    { label: 'Operating System', key: 'os' },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-xs font-semibold text-[#E53935] mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>AI Multi-Attribute Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Side-by-Side Product Spec Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Compare genuine hardware specifications and performance metrics with anti-tamper price locks.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500 font-mono text-xs">
          Loading comparison matrix from catalog...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 text-sm">
          No products currently available for comparison.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-[#262626] bg-[#121214] shadow-2xl">
          <table className="w-full border-collapse text-left text-xs">
            {/* Header row with product cards */}
            <thead>
              <tr className="border-b border-[#242426]">
                <th className="p-6 bg-[#18181C] w-1/4 text-zinc-400 font-mono uppercase tracking-wider text-[11px] align-top">
                  Specifications
                </th>
                {products.map((p, idx) => (
                  <th key={p.id} className="p-6 w-1/4 align-top">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            idx === 0
                              ? 'bg-[#E53935] text-white shadow-md shadow-[#E53935]/30 flex items-center gap-1'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {idx === 0 && <Award className="w-3 h-3" />}
                          {idx === 0 ? 'AI Top Recommendation' : `Option #${idx + 1}`}
                        </span>
                        <span className="text-zinc-500 text-[10px] uppercase font-mono">{p.brand}</span>
                      </div>

                      <h3 className="text-sm font-bold text-white line-clamp-2 h-10">
                        {p.name}
                      </h3>

                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-white">${p.price.toFixed(2)}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">USD</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedProduct({
                            productId: p.id,
                            name: p.name,
                            price: p.price,
                            currency: p.currency,
                          });
                          setIsModalOpen(true);
                        }}
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          idx === 0
                            ? 'bg-[#E53935] hover:bg-[#C62828] text-white shadow-lg shadow-[#E53935]/20'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Select & Checkout</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Spec rows */}
            <tbody className="divide-y divide-[#222226]">
              {specFeatures.map((spec) => (
                <tr key={spec.key} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4 pl-6 bg-[#16161A]/50 font-semibold text-zinc-300">
                    {spec.label}
                  </td>
                  {products.map((p) => {
                    const val = p.specifications?.[spec.key] || 'Standard';
                    return (
                      <td key={p.id} className="p-4 text-zinc-300">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{val}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Checkout Modal */}
      {selectedProduct && (
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
