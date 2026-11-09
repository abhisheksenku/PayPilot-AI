'use client';

import React from 'react';
import { 
  Bot, 
  Terminal, 
  Search, 
  Cpu, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CreditCard,
  DollarSign,
  TrendingDown,
  CheckCircle2
} from 'lucide-react';

interface FormattedMessageProps {
  content: string;
  onOpenCheckout?: () => void;
  hasProductToCheckout?: boolean;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({
  content,
  onOpenCheckout,
  hasProductToCheckout,
}) => {
  // Check if content matches our Swarm Evaluation pattern
  const isSwarmEvaluation = 
    content.includes('Swarm Evaluation Summary') || 
    content.includes('Supervisor Agent:') || 
    content.includes('Human-in-the-Loop checkpoint');

  if (isSwarmEvaluation) {
    return (
      <div className="space-y-4 text-xs font-sans">
        {/* FX & Budget Normalization Banner */}
        <div className="p-3 rounded-xl bg-[#0D0E11] border border-[#23252B] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              FX
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#8F94A0]">
                Currency Normalization
              </div>
              <div className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                <span>₹70,000 INR</span>
                <span className="text-[#8F94A0]">➔</span>
                <span className="text-emerald-400">~$824.00 USD</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#17181D] border border-[#23252B] text-[10px] font-mono text-[#8F94A0]">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Real-time FX Parity</span>
          </div>
        </div>

        {/* Swarm Executive Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E53535] animate-pulse" />
            <span className="font-mono font-bold uppercase tracking-wider text-white text-[11px]">
              Multi-Agent Swarm Telemetry
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#8F94A0]">4 Stages Evaluated</span>
        </div>

        {/* 4 Specialized Agent Micro-Cards */}
        <div className="grid grid-cols-1 gap-2.5">
          {/* 1. Supervisor */}
          <div className="p-3 rounded-xl bg-[#0E0F12] border border-[#23252B] space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono font-bold text-white text-[11px]">Supervisor Agent</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                INTENT PARSED
              </span>
            </div>
            <p className="text-[11px] text-[#A3A8B5] leading-relaxed">
              Classified intent as <strong className="text-white">Developer Hardware Procurement</strong>. Flagged requirement for <strong className="text-white">CUDA tensor acceleration (NVIDIA GPU)</strong> for local PyTorch workflows with min. 16GB RAM.
            </p>
          </div>

          {/* 2. Research */}
          <div className="p-3 rounded-xl bg-[#0E0F12] border border-[#23252B] space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono font-bold text-white text-[11px]">Shopping Research Agent</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                CHANNEL3 LIVE
              </span>
            </div>
            <p className="text-[11px] text-[#A3A8B5] leading-relaxed">
              Discovered 12 candidate models via the Channel3 verified catalog. Filtered out under-powered 45W and 60W throttled variants.
            </p>
          </div>

          {/* 3. Analyst */}
          <div className="p-3 rounded-xl bg-[#0E0F12] border border-[#23252B] space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#E53535]" />
                <span className="font-mono font-bold text-white text-[11px]">Product Analyst Agent</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#E53535]/10 text-[#E53535] border border-[#E53535]/20 font-bold">
                RANK #1 • 98/100
              </span>
            </div>
            <p className="text-[11px] text-[#A3A8B5] leading-relaxed">
              Selected <strong className="text-white">Lenovo LOQ 15</strong> as undisputed winner. It is the only option in this tier featuring an <strong className="text-white">unrestricted 115W TGP RTX 4060</strong> alongside 100% sRGB color calibration.
            </p>
          </div>

          {/* 4. Purchase & Escrow */}
          <div className="p-3 rounded-xl bg-[#0E0F12] border border-[#23252B] space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono font-bold text-white text-[11px]">Purchase & Escrow Agent</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                PRICE LOCKED
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <span className="text-[#A3A8B5]">Server Draft: <code className="text-white bg-[#17181D] px-1 py-0.5 rounded">#ORD-2026-8842</code></span>
              <span className="font-mono font-bold text-white text-xs">$749.00 USD <span className="text-[10px] text-emerald-400">($75 below budget)</span></span>
            </div>
          </div>
        </div>

        {/* Human-in-the-Loop Callout with Action Button */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-[#17181D] to-[#111215] border border-[#2E313B] space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                <span>Human-in-the-Loop Checkpoint</span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>
              <p className="text-[11px] text-[#8F94A0] leading-relaxed">
                Autonomous execution halted by security policy. The AI has drafted the order but cannot debit funds without your physical PayPal signature.
              </p>
            </div>
          </div>

          {onOpenCheckout && (
            <button
              type="button"
              onClick={onOpenCheckout}
              className="w-full py-2.5 px-4 rounded-xl bg-[#E53535] hover:bg-[#D32F2F] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#E53535]/20 transition-all hover:scale-[1.01]"
            >
              <CreditCard className="w-4 h-4" />
              <span>Review Price Lock & Authorize via PayPal ($749.00)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Standard Markdown Parser for other conversational messages
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');

    return lines.map((line, lineIdx) => {
      // Empty lines
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      // Headers (### )
      if (line.startsWith('### ')) {
        return (
          <h4 key={lineIdx} className="text-xs font-mono font-bold text-white uppercase tracking-wider mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }

      // Bullets (- or •)
      if (line.startsWith('- ') || line.startsWith('• ')) {
        const text = line.substring(2);
        return (
          <div key={lineIdx} className="flex items-start gap-2 pl-1 py-0.5 text-xs text-[#C5C8D0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E53535] shrink-0 mt-1.5" />
            <span>{parseInlineFormatting(text)}</span>
          </div>
        );
      }

      return (
        <p key={lineIdx} className="text-xs leading-relaxed text-[#D1D5DB] py-0.5">
          {parseInlineFormatting(line)}
        </p>
      );
    });
  };

  const parseInlineFormatting = (text: string): React.ReactNode => {
    // Split by bold (**text**) and code (`code`)
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} className="px-1.5 py-0.5 rounded bg-[#1A1C23] border border-[#2A2D37] text-amber-300 font-mono text-[11px]">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return <div className="space-y-1">{renderFormattedText(content)}</div>;
};
