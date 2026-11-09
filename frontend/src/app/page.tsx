import React from 'react';
import Link from 'next/link';
import { Bot, ArrowRight, ShieldCheck, Cpu, Zap, CreditCard, Sparkles, Check, Terminal, Lock, Award, BarChart3, Database } from 'lucide-react';

export default function Home() {
  const samplePrompts = [
    'I need a laptop under ₹70,000 for programming, machine learning and occasional gaming',
    'Best ultrabook under $1300 with 32GB RAM and all-day battery life for coding',
    'High-end creator laptop with OLED display and RTX graphics for 3D animation',
  ];

  return (
    <div className="space-y-20 py-6">
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
        {/* Track Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111215] border border-[#23252B] text-xs font-mono text-[#8F94A0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E53535]" />
          <span className="text-white font-medium">PayPal AI Hackathon 2026</span>
          <span className="text-[#3A3D46]">/</span>
          <span className="text-[#E53535] font-semibold">Agentic Commerce Track</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
          Autonomous Multi-Agent Commerce on{' '}
          <span className="text-white underline decoration-[#E53535] decoration-4 underline-offset-8">
            PayPal Rails
          </span>
        </h1>

        {/* Value Proposition */}
        <p className="text-base sm:text-lg text-[#8F94A0] max-w-2xl mx-auto leading-relaxed">
          Describe any computing workload, budget, or hardware specifications in natural language. PayPilot AI evaluates real specifications via Channel3, calculates 0–100 benchmark matrices, and halts for your mandatory PayPal authorization.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/assistant"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#E53535] hover:bg-[#D32F2F] text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#E53535]/20 transition-all hover:scale-[1.02]"
          >
            <Bot className="w-4 h-4" />
            <span>Launch Shopping Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#111215] hover:bg-[#17181D] text-[#A3A8B5] hover:text-white text-xs font-mono font-semibold border border-[#23252B] transition-colors"
          >
            <span>Inspect AG Grid Ledger</span>
          </Link>
        </div>

        {/* Quick Sample Prompts */}
        <div className="pt-4 max-w-2xl mx-auto space-y-2">
          <div className="text-[10px] font-mono text-[#8F94A0] uppercase tracking-wider">
            Quick Simulation Prompts
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {samplePrompts.map((prompt, idx) => (
              <Link
                key={idx}
                href={`/assistant?q=${encodeURIComponent(prompt)}`}
                className="text-[11px] text-[#A3A8B5] hover:text-white bg-[#111215] hover:bg-[#17181D] hover:border-[#3E424E] border border-[#23252B] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#E53535] shrink-0" />
                <span className="truncate max-w-[280px] sm:max-w-none">{prompt}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          LIVE SWARM TELEMETRY & INTERACTIVE PREVIEW CARD
          ========================================================================= */}
      <section className="max-w-4xl mx-auto rounded-2xl bg-[#111215] border border-[#23252B] overflow-hidden shadow-fintech-card">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#23252B] bg-[#14151A] font-mono text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#E53535]" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Live Swarm Execution Lifecycle
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#8F94A0] text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>State Machine Deterministic</span>
          </div>
        </div>

        {/* Pipeline Preview Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="space-y-2.5 p-4 rounded-xl bg-[#0E0F12] border border-[#23252B]">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                01 / INTENT
              </span>
              <span className="text-[#8F94A0]">Supervisor Agent</span>
            </div>
            <div className="text-xs font-bold text-white">Natural Language to Spec Profile</div>
            <p className="text-[11px] text-[#8F94A0] leading-relaxed">
              Extracts target hardware criteria, translates currency (e.g., ₹70,000 $\to$ ~$824 USD), and identifies critical CUDA/VRAM requirements.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2.5 p-4 rounded-xl bg-[#0E0F12] border border-[#23252B]">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                02 / EVALUATION
              </span>
              <span className="text-[#8F94A0]">Product Analyst</span>
            </div>
            <div className="text-xs font-bold text-white">Deep Spec Ranking Matrix</div>
            <p className="text-[11px] text-[#8F94A0] leading-relaxed">
              Compares GPU TGP wattages, CPU benchmark single/multi-thread scores, and thermal headroom to generate an authoritative 0–100 suitability rating.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-2.5 p-4 rounded-xl bg-[#0E0F12] border border-[#23252B]">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                03 / PAYPAL CHECKPOINT
              </span>
              <span className="text-[#8F94A0]">Human-in-the-Loop</span>
            </div>
            <div className="text-xs font-bold text-white">Cryptographic Price Lock</div>
            <p className="text-[11px] text-[#8F94A0] leading-relaxed">
              Execution halts. The user inspects the immutable server price lock and authorizes checkout directly via official PayPal Sandbox buttons.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINTECH ENGINEERING PILLARS
          ========================================================================= */}
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#E53535]">
            Engineering & Safety Guardrails
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Built for Real Financial Security
          </h2>
          <p className="text-xs text-[#8F94A0] max-w-xl mx-auto">
            Autonomous agent capabilities balanced with deterministic fintech guardrails.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#111215] border border-[#23252B] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#17181D] border border-[#23252B] flex items-center justify-center text-[#E53535]">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Anti-Tampering Price Lock</h3>
            <p className="text-xs text-[#8F94A0] leading-relaxed">
              Order totals are verified directly against backend MySQL records before calling PayPal REST API v2. Client-side tampering is completely rejected.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#111215] border border-[#23252B] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#17181D] border border-[#23252B] flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Human-in-the-Loop Rails</h3>
            <p className="text-xs text-[#8F94A0] leading-relaxed">
              Agents research, rank, and draft orders, but are structurally prohibited from holding credentials or executing autonomous fund transfers.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#111215] border border-[#23252B] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#17181D] border border-[#23252B] flex items-center justify-center text-blue-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Real-Time AG Grid Ledger</h3>
            <p className="text-xs text-[#8F94A0] leading-relaxed">
              Enterprise data grid rendering live transactions, PayPal Order IDs, PayPal Capture IDs, and agent execution times directly from the database.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#111215] border border-[#23252B] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#17181D] border border-[#23252B] flex items-center justify-center text-purple-400">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Channel3 Hardware Feeds</h3>
            <p className="text-xs text-[#8F94A0] leading-relaxed">
              Integrated with Channel3 sponsor discovery feeds and validated against local high-performance hardware benchmarks.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CALL TO ACTION
          ========================================================================= */}
      <section className="max-w-4xl mx-auto p-8 rounded-2xl bg-[#111215] border border-[#23252B] text-center space-y-5">
        <h3 className="text-2xl font-bold text-white tracking-tight">
          Ready to Test the Agentic Commerce Flow?
        </h3>
        <p className="text-xs text-[#8F94A0] max-w-lg mx-auto leading-relaxed">
          Launch the shopping assistant, type any computing workload, and experience the full workflow from AI spec evaluation to verified PayPal Sandbox settlement.
        </p>
        <Link
          href="/assistant"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#E53535] hover:bg-[#D32F2F] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-[#E53535]/20 transition-all hover:scale-105"
        >
          <span>Open Shopping Assistant</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
