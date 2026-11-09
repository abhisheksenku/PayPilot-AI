import React from 'react';
import { Star, Check, AlertCircle, ShoppingCart, Award } from 'lucide-react';

export interface ProductCardProps {
  product: {
    productId: string;
    name: string;
    price: number;
    currency: string;
    score: number;
    rank: number;
    strengths: string[];
    tradeoffs: string[];
    suitabilityReason?: string;
    imageUrl?: string | null;
    specifications?: Record<string, any> | null;
  };
  onSelect: (productId: string) => void;
  isSelected?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  isSelected,
}) => {
  const isTopRanked = product.rank === 1;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 ${
        isTopRanked
          ? 'bg-gradient-to-b from-[#1E1E1E] to-[#141414] border-[#E53935] shadow-xl shadow-[#E53935]/10'
          : 'bg-[#18181B] border-[#2E2E32] hover:border-zinc-500'
      } ${isSelected ? 'ring-2 ring-[#E53935]' : ''}`}
    >
      {/* Top Banner Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isTopRanked
                ? 'bg-[#E53935] text-white shadow-md shadow-[#E53935]/40'
                : 'bg-[#27272A] text-zinc-300'
            }`}
          >
            {isTopRanked && <Award className="w-3.5 h-3.5" />}
            #{product.rank} {isTopRanked ? 'AI Top Match' : 'Alternative'}
          </span>
        </div>

        {/* AI Score Badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/40 border border-zinc-700/50">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-mono font-bold text-white">
            {product.score}
            <span className="text-zinc-500 text-[10px]">/100</span>
          </span>
        </div>
      </div>

      {/* Product Title & Price */}
      <div className="mb-4">
        <h4 className="text-base font-bold text-white tracking-tight line-clamp-2 mb-1.5">
          {product.name}
        </h4>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-zinc-400 font-mono">USD</span>
        </div>
      </div>

      {/* Specifications pills if available */}
      {product.specifications && (
        <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 rounded-xl bg-black/40 border border-zinc-800 text-[11px]">
          {product.specifications.ram && (
            <div className="text-zinc-400">
              <span className="text-zinc-500">RAM:</span> {product.specifications.ram}
            </div>
          )}
          {product.specifications.gpu && (
            <div className="text-zinc-400">
              <span className="text-zinc-500">GPU:</span> {product.specifications.gpu}
            </div>
          )}
          {product.specifications.processor && (
            <div className="text-zinc-400">
              <span className="text-zinc-500">CPU:</span> {product.specifications.processor}
            </div>
          )}
          {product.specifications.storage && (
            <div className="text-zinc-400">
              <span className="text-zinc-500">Storage:</span> {product.specifications.storage}
            </div>
          )}
        </div>
      )}

      {/* Strengths and Trade-offs */}
      <div className="space-y-2 mb-5 flex-1">
        {product.strengths?.slice(0, 2).map((s, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-emerald-400">
            <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="text-zinc-300 leading-tight">{s}</span>
          </div>
        ))}

        {product.tradeoffs?.slice(0, 1).map((t, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-amber-400">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="text-zinc-400 leading-tight">{t}</span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button
        onClick={() => onSelect(product.productId)}
        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
          isTopRanked
            ? 'bg-[#E53935] hover:bg-[#C62828] text-white shadow-lg shadow-[#E53935]/25 active:scale-[0.98]'
            : 'bg-[#27272A] hover:bg-[#323238] text-white active:scale-[0.98]'
        }`}
      >
        <ShoppingCart className="w-4 h-4" />
        <span>Select & Review Checkout</span>
      </button>
    </div>
  );
};
