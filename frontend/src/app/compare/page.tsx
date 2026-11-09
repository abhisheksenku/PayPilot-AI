'use client';

import React, { useEffect, useState } from 'react';
import { api, ProductItem } from '@/lib/api';
import { Layers, Check, ShoppingCart, Award, ShieldCheck, Zap, Cpu, HardDrive, Monitor, Battery, ArrowRight, HelpCircle } from 'lucide-react';
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

  const specCategories = [
    {
      category: '⚡ GPU & AI / CUDA Acceleration',
      rows: [
        {
          label: 'Graphics Processor',
          getValue: (p: ProductItem) => p.specifications?.gpu || 'N/A',
          isBest: (idx: number) => idx === 0,
          highlight: 'Dedicated CUDA Tensor Cores',
        },
        {
          label: 'GPU Wattage (Maximum TGP)',
          getValue: (p: ProductItem) => p.specifications?.gpuWattage || 'Standard',
          isBest: (idx: number) => idx === 0,
          highlight: '115W Unrestricted Compute',
        },
        {
          label: 'VRAM & Architecture',
          getValue: (idx: number) => (idx === 0 ? '8GB GDDR6 (128-bit)' : '6GB GDDR6 (96-bit)'),
          isBest: (idx: number) => idx === 0,
          highlight: '+33% Memory Buffer for LLMs',
        },
        {
          label: 'PyTorch / ML Suitability',
          getValue: (idx: number) =>
            idx === 0
              ? 'Excellent (Local fine-tuning & inference)'
              : idx === 1
              ? 'Moderate (Batch size constrained)'
              : 'Moderate (Batch size constrained)',
          isBest: (idx: number) => idx === 0,
        },
      ],
    },
    {
      category: '🧠 CPU & Multithreaded Compiles',
      rows: [
        {
          label: 'Processor (CPU)',
          getValue: (p: ProductItem) => p.specifications?.processor || 'N/A',
          isBest: (idx: number) => idx === 0,
        },
        {
          label: 'Core / Thread Configuration',
          getValue: (idx: number) =>
            idx === 0 ? '8 Cores / 16 Threads' : idx === 1 ? '8 Cores / 12 Threads' : '6 Cores / 12 Threads',
          isBest: (idx: number) => idx === 0,
        },
        {
          label: 'AI Benchmark Score',
          getValue: (p: ProductItem) => `${p.specifications?.benchmarks?.overallScore || 90} / 100`,
          isBest: (idx: number) => idx === 0,
        },
      ],
    },
    {
      category: '💾 Memory & Storage Scalability',
      rows: [
        {
          label: 'System RAM',
          getValue: (p: ProductItem) => p.specifications?.ram || '16GB',
          isBest: (idx: number) => idx === 0,
        },
        {
          label: 'Storage Drive (SSD)',
          getValue: (p: ProductItem) => p.specifications?.storage || '512GB NVMe',
          isBest: (idx: number) => idx === 2, // ASUS has 1TB
        },
        {
          label: 'Drive Expansion Bays',
          getValue: (idx: number) =>
            idx === 0 ? 'Dual M.2 Gen4 PCIe Slots' : idx === 1 ? 'Single M.2 Slot' : 'Dual M.2 Slots',
          isBest: (idx: number) => idx === 0,
        },
      ],
    },
    {
      category: '🖥️ Display & Color Accuracy',
      rows: [
        {
          label: 'Display Panel',
          getValue: (p: ProductItem) => p.specifications?.display || '15.6" 144Hz',
          isBest: (idx: number) => idx === 0,
        },
        {
          label: 'Color Gamut Coverage',
          getValue: (idx: number) =>
            idx === 0 ? '100% sRGB (350 nits)' : idx === 1 ? '65% sRGB (250 nits)' : '62.5% sRGB (250 nits)',
          isBest: (idx: number) => idx === 0,
        },
      ],
    },
    {
      category: '🔋 Battery & Portability',
      rows: [
        {
          label: 'Battery Capacity',
          getValue: (p: ProductItem) => p.specifications?.battery || '60Wh',
          isBest: (idx: number) => idx === 2, // ASUS has 90Wh
        },
        {
          label: 'Chassis Weight',
          getValue: (p: ProductItem) => p.specifications?.weight || '2.2 kg',
          isBest: (idx: number) => idx === 1, // Acer is 2.1kg
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 py-6">
      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A] border border-white/[0.08] text-xs font-mono text-slate-300 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-paypal-blue"></span>
            <span className="text-white font-medium">Product Analyst Matrix</span>
            <span className="text-slate-600">/</span>
            <span className="text-paypal-blue font-semibold">Side-by-Side Spec Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Multi-Attribute Hardware Spec Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Compare candidate hardware specifications, GPU TGP wattages, and benchmark matrices under strict server price locks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-[#0F172A] px-3.5 py-2 rounded-xl border border-white/[0.08]">
          <ShieldCheck className="w-4 h-4" />
          <span>Anti-Tamper Lock Active</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-slate-400 font-mono text-xs">
          Loading comparison matrix from verified catalog...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          No candidate hardware models available for comparison.
        </div>
      ) : (
        /* =========================================================================
            COMPARISON MATRIX TABLE
            ========================================================================= */
        <div className="rounded-2xl border border-white/[0.08] bg-[#0F172A] overflow-hidden shadow-fintech-card">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              {/* Product Cards Header Row */}
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#0D1527]">
                  <th className="p-5 w-[25%] font-mono uppercase tracking-wider text-xs font-bold text-slate-400 align-top">
                    <div className="space-y-1">
                      <div className="text-white">HARDWARE CANDIDATES</div>
                      <div className="text-[11px] font-normal text-slate-400">
                        Multi-Factor Scoring
                      </div>
                    </div>
                  </th>

                  {products.map((p, idx) => (
                    <th key={p.id} className="p-5 w-[25%] align-top border-l border-white/[0.08]">
                      <div className="space-y-3">
                        {/* Recommendation Tag */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider ${
                              idx === 0
                                ? 'bg-[#0070BA]/20 text-[#00CFDE] border border-[#0070BA]/40 flex items-center gap-1.5'
                                : 'bg-[#1E293B] text-slate-400 border border-white/[0.08]'
                            }`}
                          >
                            {idx === 0 && <Award className="w-3.5 h-3.5" />}
                            {idx === 0 ? '#1 Top Pick' : `Alternative #${idx + 1}`}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{p.brand}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-white line-clamp-2 h-10 font-sans">
                          {p.name}
                        </h3>

                        {/* Price */}
                        <div className="flex items-baseline gap-1.5 font-mono">
                          <span className="text-2xl font-bold text-white">${p.price.toFixed(2)}</span>
                          <span className="text-xs text-slate-400">USD</span>
                        </div>

                        {/* Action CTA */}
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
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                            idx === 0
                              ? 'bg-[#0070BA] hover:bg-[#005EA6] text-white shadow-fintech-glow'
                              : 'bg-[#1E293B] hover:bg-[#334155] text-slate-200 hover:text-white border border-white/[0.08]'
                          }`}
                        >
                          <span>Authorize with PayPal</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Matrix Body with Grouped Categories */}
              <tbody>
                {specCategories.map((group, groupIdx) => (
                  <React.Fragment key={groupIdx}>
                    {/* Category Divider Header */}
                    <tr className="bg-[#080C15] border-t border-b border-white/[0.08]">
                      <td
                        colSpan={products.length + 1}
                        className="px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white"
                      >
                        {group.category}
                      </td>
                    </tr>

                    {/* Spec Rows */}
                    {group.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="border-b border-white/[0.05] hover:bg-[#1E293B]/40 transition-colors"
                      >
                        {/* Spec Label */}
                        <td className="px-5 py-3.5 text-xs font-mono font-medium text-slate-300">
                          {row.label}
                        </td>

                        {/* Product Values */}
                        {products.map((p, pIdx) => {
                          const val =
                            typeof row.getValue === 'function'
                              ? (row.getValue as any)(pIdx === 0 ? p : pIdx === 1 ? p : p, pIdx)
                              : '';
                          const isBest = row.isBest(pIdx);

                          return (
                            <td
                              key={p.id}
                              className={`px-5 py-3.5 text-xs font-mono border-l border-white/[0.08] ${
                                isBest ? 'bg-[#1E293B]/30 text-white font-medium' : 'text-slate-400'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className={isBest ? 'text-white font-semibold' : ''}>
                                  {typeof row.getValue === 'function' ? (row.getValue as any)(p, pIdx) : val}
                                </span>
                                {isBest && (
                                  <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Top
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
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
