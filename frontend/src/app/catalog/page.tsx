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

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-[#111215] px-3.5 py-2 rounded-xl border border-[#23252B]">
          <ShieldCheck className="w-4 h-4" />
          <span>Server Price Integrity Active</span>
        </div>
      </div>

      {/* =========================================================================
          SEARCH & FILTER TOOLBAR
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tier Filters */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#111215] border border-[#23252B] font-mono text-xs overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
              activeFilter === 'all'
                ? 'bg-[#17181D] text-white font-bold border border-[#2D3039]'
                : 'text-[#8F94A0] hover:text-white'
            }`}
          >
            All Hardware ({products.length})
          </button>
          <button
            onClick={() => setActiveFilter('ml')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
              activeFilter === 'ml'
                ? 'bg-[#17181D] text-[#E53535] font-bold border border-[#2D3039]'
                : 'text-[#8F94A0] hover:text-white'
            }`}
          >
            ML & CUDA Laptops
          </button>
          <button
            onClick={() => setActiveFilter('creator')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
              activeFilter === 'creator'
                ? 'bg-[#17181D] text-purple-400 font-bold border border-[#2D3039]'
                : 'text-[#8F94A0] hover:text-white'
            }`}
          >
            Creator & Workstations
          </button>
          <button
            onClick={() => setActiveFilter('apple')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
              activeFilter === 'apple'
                ? 'bg-[#17181D] text-blue-400 font-bold border border-[#2D3039]'
                : 'text-[#8F94A0] hover:text-white'
            }`}
          >
            Apple Silicon M3
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8F94A0] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brand, CPU, GPU, or spec..."
            className="w-full pl-10 pr-4 py-2 bg-[#111215] border border-[#23252B] focus:border-[#E53535] rounded-xl text-xs text-white placeholder-[#8F94A0] outline-none font-mono"
          />
        </div>
      </div>

      {/* =========================================================================
          PRODUCT CARDS GRID
          ========================================================================= */}
      {loading ? (
        <div className="text-center py-24 text-[#8F94A0] font-mono text-xs">
          Querying Channel3 verified catalog feeds...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 text-[#8F94A0] text-sm">
          No hardware products found matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between p-5 rounded-2xl bg-[#111215] border border-[#23252B] hover:border-[#383C46] transition-all group shadow-fintech-card"
            >
              <div className="space-y-4">
                {/* Brand & Rating Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#17181D] text-[#8F94A0] border border-[#23252B]">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold text-white">{product.rating}</span>
                    <span className="text-[#8F94A0]">({product.reviewsCount})</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-[#E53535] transition-colors line-clamp-2 h-12">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
                  <span className="text-xs text-[#8F94A0]">{product.currency}</span>
                </div>

                {/* Spec Summary Chips */}
                {product.specifications && (
                  <div className="space-y-2 p-3.5 rounded-xl bg-[#0E0F12] border border-[#23252B] text-xs font-mono text-[#A3A8B5]">
                    {product.specifications.gpu && (
                      <div className="flex items-center gap-2 truncate">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{product.specifications.gpu}</span>
                      </div>
                    )}
                    {product.specifications.processor && (
                      <div className="flex items-center gap-2 truncate">
                        <Cpu className="w-3.5 h-3.5 text-[#E53535] shrink-0" />
                        <span className="truncate">{product.specifications.processor}</span>
                      </div>
                    )}
                    {product.specifications.ram && (
                      <div className="flex items-center gap-2 truncate">
                        <HardDrive className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{product.specifications.ram} • {product.specifications.storage}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="pt-4 mt-4 border-t border-[#23252B] flex items-center gap-2.5">
                <Link
                  href={`/assistant?q=${encodeURIComponent(`Evaluate ${product.name} against other models`)}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#17181D] hover:bg-[#202229] border border-[#23252B] text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Bot className="w-3.5 h-3.5 text-[#E53535]" />
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
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#E53535] hover:bg-[#D32F2F] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#E53535]/20 transition-all hover:scale-[1.02]"
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
