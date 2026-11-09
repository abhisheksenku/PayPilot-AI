import React from 'react';
import { Award, ShieldCheck, Check, ArrowRight, Zap, Cpu, HardDrive, Monitor } from 'lucide-react';

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
  isHero?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  isSelected,
  isHero = false,
}) => {
  const isTopRanked = product.rank === 1;

  if (isHero) {
    return (
      <div
        className={`relative rounded-2xl bg-[#111215] border transition-all duration-200 overflow-hidden ${
          isSelected
            ? 'border-[#E53535] ring-1 ring-[#E53535]/30'
            : isTopRanked
            ? 'border-[#2D3039] hover:border-[#3E424E]'
            : 'border-[#23252B] hover:border-[#2D3039]'
        }`}
      >
        {/* Top Status Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#23252B] bg-[#14151A]">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-[#E53535]/15 text-[#E53535] border border-[#E53535]/30">
              <Award className="w-3.5 h-3.5" />
              #1 Swarm Recommendation
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              Price Locked
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8F94A0]">Match Index</span>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1D1F26] border border-[#2B2E38]">
              <span className="text-sm font-mono font-bold text-white">{product.score}</span>
              <span className="text-xs font-mono text-[#8F94A0]">/100</span>
            </div>
          </div>
        </div>

        {/* Hero Body */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
            {/* Title & Price */}
            <div className="space-y-2 flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {product.name}
              </h3>
              {product.suitabilityReason && (
                <p className="text-sm text-[#A3A8B5] leading-relaxed">
                  {product.suitabilityReason}
                </p>
              )}
            </div>

            {/* Price Badge */}
            <div className="text-left lg:text-right shrink-0 bg-[#17181D] px-5 py-3.5 rounded-xl border border-[#23252B]">
              <div className="text-xs font-mono uppercase tracking-wider text-[#8F94A0]">
                Server Verified Price
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-mono font-black text-white">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-[#8F94A0]">USD</span>
              </div>
            </div>
          </div>

          {/* Specs Matrix Chips */}
          {product.specifications && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.specifications.processor && (
                <div className="p-3 rounded-xl bg-[#17181D] border border-[#23252B] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#8F94A0]">
                    <Cpu className="w-3.5 h-3.5 text-[#E53535]" />
                    <span>CPU</span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate" title={product.specifications.processor}>
                    {product.specifications.processor}
                  </div>
                </div>
              )}
              {product.specifications.gpu && (
                <div className="p-3 rounded-xl bg-[#17181D] border border-[#23252B] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#8F94A0]">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>GPU & TGP</span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate" title={product.specifications.gpu}>
                    {product.specifications.gpu}
                  </div>
                </div>
              )}
              {product.specifications.ram && (
                <div className="p-3 rounded-xl bg-[#17181D] border border-[#23252B] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#8F94A0]">
                    <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                    <span>RAM</span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate">
                    {product.specifications.ram}
                  </div>
                </div>
              )}
              {product.specifications.display && (
                <div className="p-3 rounded-xl bg-[#17181D] border border-[#23252B] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#8F94A0]">
                    <Monitor className="w-3.5 h-3.5 text-purple-400" />
                    <span>Display</span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate" title={product.specifications.display}>
                    {product.specifications.display}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Strengths & Honest Trade-offs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Strengths */}
            <div className="space-y-2.5 p-4 rounded-xl bg-[#14151A] border border-[#23252B]">
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                Key Benchmark Strengths
              </div>
              <ul className="space-y-2">
                {product.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-[#D1D5DB] flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trade-offs */}
            <div className="space-y-2.5 p-4 rounded-xl bg-[#14151A] border border-[#23252B]">
              <div className="text-xs font-mono font-bold text-[#A3A8B5] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Considerations & Trade-offs
              </div>
              <ul className="space-y-2">
                {product.tradeoffs.map((tro, idx) => (
                  <li key={idx} className="text-xs text-[#8F94A0] flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-400/80 mt-0.5">•</span>
                    <span>{tro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#23252B]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#8F94A0]">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Halted at Human Checkpoint</span>
            </div>

            <button
              onClick={() => onSelect(product.productId)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#E53535] hover:bg-[#D32F2F] text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#E53535]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Authorize Checkout via PayPal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standard Alternative Card
  return (
    <div
      className={`flex flex-col justify-between rounded-xl bg-[#111215] border p-4 transition-all duration-200 ${
        isSelected
          ? 'border-[#E53535] ring-1 ring-[#E53535]/30'
          : 'border-[#23252B] hover:border-[#2D3039]'
      }`}
    >
      <div className="space-y-3">
        {/* Top Info */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#17181D] text-[#8F94A0] border border-[#23252B]">
            Alternative #{product.rank}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#8F94A0]">
            <span>Score:</span>
            <span className="font-bold text-white text-sm">{product.score}</span>
          </div>
        </div>

        {/* Title & Price */}
        <div>
          <h4 className="text-sm font-bold text-white line-clamp-1 mb-1">
            {product.name}
          </h4>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
            <span className="text-xs text-[#8F94A0]">USD</span>
          </div>
        </div>

        {/* Top Specs */}
        {product.specifications && (
          <div className="text-xs text-[#A3A8B5] space-y-1.5 bg-[#14151A] p-3 rounded-lg border border-[#23252B]">
            <div className="truncate">
              <span className="text-white font-semibold">GPU:</span> {product.specifications.gpu}
            </div>
            <div className="truncate">
              <span className="text-white font-semibold">CPU:</span> {product.specifications.processor}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-[#23252B] flex items-center justify-between">
        <span className="text-xs font-mono text-[#8F94A0]">
          {product.price < 749 ? `-$${(749 - product.price).toFixed(0)} vs Top Pick` : `+$${(product.price - 749).toFixed(0)}`}
        </span>
        <button
          onClick={() => onSelect(product.productId)}
          className="px-3.5 py-1.5 rounded-lg bg-[#17181D] hover:bg-[#202229] hover:text-white text-xs font-mono font-semibold text-[#A3A8B5] border border-[#23252B] transition-colors"
        >
          Select Option
        </button>
      </div>
    </div>
  );
};
