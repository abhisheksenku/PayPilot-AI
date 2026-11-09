'use client';

import React from 'react';
import { 
  Terminal, 
  Search, 
  Cpu, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CreditCard,
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
        <div className="p-3.5 rounded-xl bg-[#080C15]/80 border border-white/[0.08] flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs shadow-sm">
              FX
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Currency Normalization
              </div>
              <div className="font-mono text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span>₹70,000 INR</span>
                <span className="text-slate-500">➔</span>
                <span className="text-emerald-400">~$824.00 USD</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1E293B] border border-white/[0.08] text-[11px] font-mono text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Real-time FX Parity</span>
          </div>
        </div>

        {/* Swarm Executive Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-paypal-blue animate-pulse" />
            <span className="font-mono font-bold uppercase tracking-wider text-white text-xs">
              Multi-Agent Swarm Telemetry
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">4 Stages Evaluated</span>
        </div>

        {/* 4 Specialized Agent Micro-Cards */}
        <div className="grid grid-cols-1 gap-2.5">
          {/* 1. Supervisor */}
          <div className="p-3.5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-white text-xs">Supervisor Agent</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
                INTENT PARSED
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Classified intent as <strong className="text-white">Developer Hardware Procurement</strong>. Flagged requirement for <strong className="text-white">CUDA tensor acceleration (NVIDIA GPU)</strong> for local PyTorch workflows with min. 16GB RAM.
            </p>
          </div>

          {/* 2. Research */}
          <div className="p-3.5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-xs">Shopping Research Agent</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                CHANNEL3 LIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Discovered 12 candidate models via the Channel3 verified catalog. Filtered out under-powered 45W and 60W throttled variants.
            </p>
          </div>

          {/* 3. Analyst */}
          <div className="p-3.5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white text-xs">Product Analyst Agent</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                RANK #1 • 98/100
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Selected <strong className="text-white">Lenovo LOQ 15</strong> as undisputed winner. It is the only option in this tier featuring an <strong className="text-white">unrestricted 115W TGP RTX 4060</strong> alongside 100% sRGB color calibration.
            </p>
          </div>

          {/* 4. Purchase & Escrow */}
          <div className="p-3.5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-xs">Purchase & Escrow Agent</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                PRICE LOCKED
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-0.5 font-sans">
              <span className="text-slate-300">Server Draft: <code className="text-white bg-[#1E293B] px-1.5 py-0.5 rounded text-xs font-mono">#ORD-2026-8842</code></span>
              <span className="font-mono font-bold text-white text-xs">$749.00 USD <span className="text-emerald-400 font-normal">($75 under cap)</span></span>
            </div>
          </div>
        </div>

        {/* Human-in-the-Loop Callout with Action Button */}
        <div className="p-4 rounded-xl bg-[#0D1527] border border-paypal-blue/30 space-y-3.5 shadow-fintech-card">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                <span>Human-in-the-Loop Checkpoint</span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Autonomous execution halted by security policy. The AI has drafted the order but cannot debit funds without your physical PayPal authorization.
              </p>
            </div>
          </div>

          {onOpenCheckout && (
            <button
              type="button"
              onClick={onOpenCheckout}
              className="w-full py-3 px-4 rounded-xl bg-[#0070BA] hover:bg-[#005EA6] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-fintech-glow transition-all hover:scale-[1.01] active:scale-[0.98]"
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
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      if (line.startsWith('### ')) {
        return (
          <h4 key={lineIdx} className="text-xs font-mono font-bold text-white uppercase tracking-wider mt-2.5 mb-1.5">
            {line.replace('### ', '')}
          </h4>
        );
      }

      if (line.startsWith('- ') || line.startsWith('• ')) {
        const text = line.substring(2);
        return (
          <div key={lineIdx} className="flex items-start gap-2 pl-1 py-0.5 text-xs text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-paypal-blue shrink-0 mt-1.5" />
            <span>{parseInlineFormatting(text)}</span>
          </div>
        );
      }

      return (
        <p key={lineIdx} className="text-xs leading-relaxed text-slate-200 py-0.5">
          {parseInlineFormatting(line)}
        </p>
      );
    });
  };

  const parseInlineFormatting = (text: string): React.ReactNode => {
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
          <code key={idx} className="px-1.5 py-0.5 rounded bg-[#1E293B] border border-white/[0.08] text-amber-300 font-mono text-[11px]">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return <div className="space-y-1">{renderFormattedText(content)}</div>;
};
