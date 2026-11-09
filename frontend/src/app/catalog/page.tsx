'use client';

import React, { useEffect, useState } from 'react';
import { api, ProductItem } from '@/lib/api';
import { ShoppingBag, Search, Star, ShoppingCart, Cpu, HardDrive } from 'lucide-react';
import { CheckoutModal } from '@/components/assistant/CheckoutModal';

export default function CatalogPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: string;
    name: string;
    price: number;
    currency: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProducts = async (searchTerm?: string) => {
    setLoading(true);
    const data = await api.getProducts({ search: searchTerm });
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-xs font-semibold text-[#E53935] mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Verified Hardware Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Curated Laptops & Developer Workstations
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Backed by Channel3 discovery feeds & local high-performance database with anti-tampering price locks.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              loadProducts(e.target.value);
            }}
            placeholder="Search specs or brand..."
            className="w-full pl-10 pr-4 py-2 bg-[#1A1A1E] border border-[#2E2E36] focus:border-[#E53935] rounded-xl text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-24 text-zinc-500 font-mono text-xs">
          Loading catalog products...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-zinc-500 text-sm">
          No hardware products found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between p-6 rounded-3xl bg-[#141416] border border-[#26262A] hover:border-[#383840] transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">{product.rating}</span>
                    <span className="text-zinc-500 text-[10px]">({product.reviewsCount})</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-[#E53935] transition-colors line-clamp-2 mb-2">
                  {product.name}
                </h3>

                <div className="flex items-baseline gap-1.5 mb-4">
                  <span className="text-2xl font-black text-white">${product.price.toFixed(2)}</span>
                  <span className="text-xs text-zinc-400 font-mono">{product.currency}</span>
                </div>

                {/* Specs */}
                {product.specifications && (
                  <div className="space-y-2 p-3 rounded-xl bg-black/40 border border-zinc-800/80 text-[11px] text-zinc-300 mb-5">
                    {product.specifications.processor && (
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="line-clamp-1">{product.specifications.processor}</span>
                      </div>
                    )}
                    {product.specifications.ram && product.specifications.storage && (
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>
                          {product.specifications.ram} RAM • {product.specifications.storage}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
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
                className="w-full py-2.5 px-4 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E53935]/20 active:scale-[0.98] transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Prepare PayPal Checkout</span>
              </button>
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
