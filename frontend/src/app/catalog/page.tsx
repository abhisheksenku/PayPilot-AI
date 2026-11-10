'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { fallbackProduct } from '@/lib/api';
import { Cpu, Zap, Star } from 'lucide-react';
import Link from 'next/link';

export default function CatalogPage() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Product Catalog</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Pre-indexed and benchmarked hardware models from Channel3 verified merchants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-4 hover:border-[#0070BA] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0070BA] bg-[#EBF5FF] px-2.5 py-0.5 rounded-full">
                Top Rated #1
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500" /> 98/100
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-gray-900 text-base">{fallbackProduct.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{fallbackProduct.description}</p>
            </div>

            <div className="space-y-1.5 text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#0070BA]" />
                <span>Intel i5-13450HX • RTX 4060 (115W TGP)</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>16GB DDR5 5200MHz • 512GB NVMe</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xl font-black text-gray-900 font-mono">${Number(fallbackProduct.price).toFixed(2)} USD</span>
              <Link
                href="/studio"
                className="px-4 py-2 bg-[#0070BA] hover:bg-[#005ea6] text-white text-xs font-bold rounded-lg transition-colors"
              >
                Inspect in Studio →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
