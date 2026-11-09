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
        className={`relative rounded-2xl bg-[#0F172A] border transition-all duration-200 overflow-hidden shadow-fintech-card ${
          isSelected
            ? 'border-paypal-blue ring-2 ring-paypal-blue/30'
            : isTopRanked
            ? 'border-white/[0.12] hover:border-paypal-blue/50'
            : 'border-white/[0.08] hover:border-white/[0.16]'
        }`}
      >
        {/* Top Status Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0D1527]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[#0070BA]/20 text-[#00CFDE] border border-[#0070BA]/40 shadow-sm">
              <Award className="w-3.5 h-3.5 text-paypal-blue" />
              #1 Swarm Recommendation
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              Price Locked
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Match Index</span>
            <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#1E293B] border border-white/[0.08]">
              <span className="text-sm font-mono font-bold text-white">{product.score}</span>
              <span className="text-xs font-mono text-slate-400">/100</span>
            </div>
          </div>
        </div>

        {/* Hero Body */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
            {/* Title & Description */}
            <div className="space-y-2 flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {product.name}
              </h3>
              {product.suitabilityReason && (
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {product.suitabilityReason}
                </p>
              )}
            </div>

            {/* Price Badge */}
            <div className="text-left lg:text-right shrink-0 bg-[#1E293B]/80 px-5 py-3.5 rounded-xl border border-white/[0.08] shadow-sm">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Server Verified Price
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-mono font-black text-white">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">USD</span>
              </div>
            </div>
          </div>

          {/* Specs Matrix Chips */}
          {product.specifications && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.specifications.processor && (
                <div className="p-3.5 rounded-xl bg-[#1E293B]/60 border border-white/[0.06] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    <span>CPU</span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate" title={product.specifications.processor}>
                    {product.specifications.processor}
                  </div>
                </div>
              )}
              {product.specifications.gpu && (
                <div className="p-3.5 rounded-xl bg-[#1E293B]/60 border border-white/[0.06] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>GPU & TGP</span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate" title={product.specifications.gpu}>
                    {product.specifications.gpu}
                  </div>
                </div>
              )}
              {product.specifications.ram && (
                <div className="p-3.5 rounded-xl bg-[#1E293B]/60 border border-white/[0.06] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                    <span>RAM</span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate">
                    {product.specifications.ram}
                  </div>
                </div>
              )}
              {product.specifications.display && (
                <div className="p-3.5 rounded-xl bg-[#1E293B]/60 border border-white/[0.06] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
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
            <div className="space-y-3 p-4 rounded-xl bg-[#080C15]/70 border border-white/[0.06]">
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                Key Benchmark Strengths
              </div>
              <ul className="space-y-2">
                {product.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-200 flex items-start gap-2 leading-relaxed font-sans">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trade-offs */}
            <div className="space-y-3 p-4 rounded-xl bg-[#080C15]/70 border border-white/[0.06]">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Considerations & Trade-offs
              </div>
              <ul className="space-y-2">
                {product.tradeoffs.map((tro, idx) => (
                  <li key={idx} className="text-xs text-slate-400 flex items-start gap-2 leading-relaxed font-sans">
                    <span className="text-amber-400/80 mt-0.5">•</span>
                    <span>{tro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Halted at Human Checkpoint</span>
            </div>

            <button
              onClick={() => onSelect(product.productId)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0070BA] hover:bg-[#005EA6] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-fintech-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
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
      className={`flex flex-col justify-between rounded-xl bg-[#0F172A] border p-5 transition-all duration-200 shadow-sm ${
        isSelected
          ? 'border-paypal-blue ring-2 ring-paypal-blue/30'
          : 'border-white/[0.08] hover:border-white/[0.16]'
      }`}
    >
      <div className="space-y-3.5">
        {/* Top Info */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-lg bg-[#1E293B] text-slate-300 border border-white/[0.08]">
            Alternative #{product.rank}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>Score:</span>
            <span className="font-bold text-white text-sm">{product.score}</span>
          </div>
        </div>

        {/* Title & Price */}
        <div>
          <h4 className="text-sm font-bold text-white line-clamp-1 mb-1 font-sans">
            {product.name}
          </h4>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
            <span className="text-xs text-slate-400">USD</span>
          </div>
        </div>

        {/* Top Specs */}
        {product.specifications && (
          <div className="text-xs text-slate-300 space-y-1.5 bg-[#080C15]/70 p-3 rounded-lg border border-white/[0.06]">
            <div className="truncate">
              <span className="text-white font-semibold">GPU:</span> {product.specifications.gpu}
            </div>
            <div className="truncate">
              <span className="text-white font-semibold">CPU:</span> {product.specifications.processor}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-white/[0.08] flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400">
          {product.price < 749 ? `-$${(749 - product.price).toFixed(0)} vs Top Pick` : `+$${(product.price - 749).toFixed(0)}`}
        </span>
        <button
          onClick={() => onSelect(product.productId)}
          className="px-3.5 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] hover:text-white text-xs font-mono font-semibold text-slate-200 border border-white/[0.08] transition-colors"
        >
          Select Option
        </button>
      </div>
    </div>
  );
};
