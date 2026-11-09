'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { api, ProductItem } from '@/lib/api';
import { ShoppingBag, Search, Star, ShoppingCart, Cpu, HardDrive, ShieldCheck, Zap, Monitor, ArrowRight, Bot } from 'lucide-react';
import { CheckoutModal } from '@/components/assistant/CheckoutModal';
import Link from 'next/link';

export default function CatalogPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'ml' | 'apple' | 'creator'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: string;
    name: string;
    price: number;
    currency: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    const data = await api.getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filtered catalog
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Tier tab
      if (activeFilter === 'ml') {
        const hasNvidia = (p.specifications?.gpu || '').toLowerCase().includes('rtx');
        if (!hasNvidia) return false;
      } else if (activeFilter === 'apple') {
        if (p.brand.toLowerCase() !== 'apple') return false;
      } else if (activeFilter === 'creator') {
        const isCreator =
          p.name.toLowerCase().includes('creator') ||
          p.name.toLowerCase().includes('xps') ||
          p.name.toLowerCase().includes('thinkpad');
        if (!isCreator) return false;
      }

      // Search query
      if (search) {
        const q = search.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchCpu = (p.specifications?.processor || '').toLowerCase().includes(q);
        const matchGpu = (p.specifications?.gpu || '').toLowerCase().includes(q);
        return matchName || matchBrand || matchCpu || matchGpu;
      }

      return true;
    });
  }, [products, activeFilter, search]);

  return (
    <div className="space-y-8 py-4">
      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#23252B]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111215] border border-[#23252B] text-xs font-mono text-[#8F94A0] mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#E53535]"></span>
            <span className="text-white font-medium">Channel3 Discovery Feeds</span>
            <span className="text-[#3A3D46]">/</span>
            <span className="text-[#E53535] font-semibold">Verified Hardware Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Curated Laptops & Workstations
          </h1>
          <p className="text-xs sm:text-sm text-[#8F94A0] mt-1">
            Genuine hardware specifications, verified GPU TGP ratings, and zero-tamper server price locks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-[#0F172A] px-3.5 py-2 rounded-xl border border-white/[0.08]">
          <ShieldCheck className="w-4 h-4" />
          <span>Server Price Integrity Active</span>
        </div>
      </div>

      {/* =========================================================================
          SEARCH & FILTER TOOLBAR
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tier Filters */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0F172A] border border-white/[0.08] font-mono text-xs overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-medium ${
              activeFilter === 'all'
                ? 'bg-[#1E293B] text-white font-bold border border-white/[0.12] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Hardware ({products.length})
          </button>
          <button
            onClick={() => setActiveFilter('ml')}
            className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-medium ${
              activeFilter === 'ml'
                ? 'bg-[#1E293B] text-[#00CFDE] font-bold border border-white/[0.12] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ML & CUDA Laptops
          </button>
          <button
            onClick={() => setActiveFilter('creator')}
            className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-medium ${
              activeFilter === 'creator'
                ? 'bg-[#1E293B] text-purple-400 font-bold border border-white/[0.12] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Creator & Workstations
          </button>
          <button
            onClick={() => setActiveFilter('apple')}
            className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-medium ${
              activeFilter === 'apple'
                ? 'bg-[#1E293B] text-blue-400 font-bold border border-white/[0.12] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Apple Silicon M3
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brand, CPU, GPU, or spec..."
            className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-white/[0.08] focus:border-paypal-blue rounded-xl text-xs text-white placeholder-slate-400 outline-none font-mono transition-all"
          />
        </div>
      </div>

      {/* =========================================================================
          PRODUCT CARDS GRID
          ========================================================================= */}
      {loading ? (
        <div className="text-center py-24 text-slate-400 font-mono text-xs">
          Querying Channel3 verified catalog feeds...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 text-slate-400 text-sm font-sans">
          No hardware products found matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between p-5 rounded-2xl bg-[#0F172A] border border-white/[0.08] hover:border-paypal-blue/40 transition-all group shadow-sm"
            >
              <div className="space-y-4">
                {/* Brand & Rating Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#1E293B] text-slate-300 border border-white/[0.08]">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold text-white">{product.rating}</span>
                    <span className="text-slate-400">({product.reviewsCount})</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-paypal-blue transition-colors line-clamp-2 h-12 font-sans">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
                  <span className="text-xs text-slate-400">{product.currency}</span>
                </div>

                {/* Spec Summary Chips */}
                {product.specifications && (
                  <div className="space-y-2 p-3.5 rounded-xl bg-[#080C15]/70 border border-white/[0.06] text-xs font-mono text-slate-300">
                    {product.specifications.gpu && (
                      <div className="flex items-center gap-2 truncate">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{product.specifications.gpu}</span>
                      </div>
                    )}
                    {product.specifications.processor && (
                      <div className="flex items-center gap-2 truncate">
                        <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{product.specifications.processor}</span>
                      </div>
                    )}
                    {product.specifications.ram && (
                      <div className="flex items-center gap-2 truncate">
                        <HardDrive className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{product.specifications.ram} • {product.specifications.storage}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center gap-2.5">
                <Link
                  href={`/assistant?q=${encodeURIComponent(`Evaluate ${product.name} against other models`)}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-white/[0.08] text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Bot className="w-3.5 h-3.5 text-paypal-blue" />
                  <span>Ask Swarm</span>
                </Link>

                <button
                  onClick={() => {
                    setSelectedProduct({
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      currency: product.currency,
                    });
                    setIsModalOpen(true);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#0070BA] hover:bg-[#005EA6] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-fintech-glow transition-all hover:scale-[1.02]"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Checkout</span>
                </button>
              </div>
            </div>
          ))}
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
