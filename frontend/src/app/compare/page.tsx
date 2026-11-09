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
    <div className="space-y-8 py-4">
      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#23252B]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111215] border border-[#23252B] text-xs font-mono text-[#8F94A0] mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#E53535]"></span>
            <span className="text-white font-medium">Product Analyst Matrix</span>
            <span className="text-[#3A3D46]">/</span>
            <span className="text-[#E53535] font-semibold">Side-by-Side Spec Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Multi-Attribute Hardware Spec Matrix
          </h1>
          <p className="text-xs sm:text-sm text-[#8F94A0] mt-1">
            Compare candidate hardware specifications, GPU TGP wattages, and benchmark matrices under strict server price locks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-[#111215] px-3.5 py-2 rounded-xl border border-[#23252B]">
          <ShieldCheck className="w-4 h-4" />
          <span>Anti-Tamper Lock Active</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-[#8F94A0] font-mono text-xs">
          Loading comparison matrix from verified catalog...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-[#8F94A0] text-sm">
          No candidate hardware models available for comparison.
        </div>
      ) : (
        /* =========================================================================
            COMPARISON MATRIX TABLE
            ========================================================================= */
        <div className="rounded-2xl border border-[#23252B] bg-[#111215] overflow-hidden shadow-fintech-card">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              {/* Product Cards Header Row */}
              <thead>
                <tr className="border-b border-[#23252B] bg-[#14151A]">
                  <th className="p-5 w-[25%] font-mono uppercase tracking-wider text-xs font-bold text-[#8F94A0] align-top">
                    <div className="space-y-1">
                      <div className="text-white">HARDWARE CANDIDATES</div>
                      <div className="text-[11px] font-normal text-[#8F94A0]">
                        Multi-Factor Scoring
                      </div>
                    </div>
                  </th>

                  {products.map((p, idx) => (
                    <th key={p.id} className="p-5 w-[25%] align-top border-l border-[#23252B]">
                      <div className="space-y-3">
                        {/* Recommendation Tag */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider ${
                              idx === 0
                                ? 'bg-[#E53535]/15 text-[#E53535] border border-[#E53535]/30 flex items-center gap-1.5'
                                : 'bg-[#17181D] text-[#8F94A0] border border-[#23252B]'
                            }`}
                          >
                            {idx === 0 && <Award className="w-3.5 h-3.5" />}
                            {idx === 0 ? '#1 Top Pick' : `Alternative #${idx + 1}`}
                          </span>
                          <span className="text-xs font-mono text-[#8F94A0]">{p.brand}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-white line-clamp-2 h-10">
                          {p.name}
                        </h3>

                        {/* Price */}
                        <div className="flex items-baseline gap-1.5 font-mono">
                          <span className="text-2xl font-bold text-white">${p.price.toFixed(2)}</span>
                          <span className="text-xs text-[#8F94A0]">USD</span>
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
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                            idx === 0
                              ? 'bg-[#E53535] hover:bg-[#D32F2F] text-white shadow-md shadow-[#E53535]/20'
                              : 'bg-[#17181D] hover:bg-[#202229] text-[#A3A8B5] hover:text-white border border-[#23252B]'
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
                    <tr className="bg-[#0E0F12] border-t border-b border-[#23252B]">
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
                        className="border-b border-[#23252B]/60 hover:bg-[#14151A] transition-colors"
                      >
                        {/* Spec Label */}
                        <td className="px-5 py-3.5 text-xs font-mono font-medium text-[#8F94A0]">
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
                              className={`px-5 py-3.5 text-xs font-mono border-l border-[#23252B] ${
                                isBest ? 'bg-[#14151A]/80 text-white font-medium' : 'text-[#8F94A0]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className={isBest ? 'text-white font-semibold' : ''}>
                                  {typeof row.getValue === 'function' ? (row.getValue as any)(p, pIdx) : val}
                                </span>
                                {isBest && (
                                  <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
