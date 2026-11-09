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
    <div className="space-y-20 py-8 relative">
      {/* Ambient Radial Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-ambient-radial pointer-events-none -z-10" />

      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
        {/* Track Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-white/[0.1] text-xs font-mono text-slate-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#0070BA] animate-pulse" />
          <span className="text-white font-medium">PayPal AI Hackathon 2026</span>
          <span className="text-slate-600">/</span>
          <span className="text-[#00CFDE] font-semibold">Agentic Commerce Track</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Autonomous Multi-Agent Commerce on{' '}
          <span className="bg-gradient-to-r from-[#0070BA] via-[#2563EB] to-[#00CFDE] bg-clip-text text-transparent">
            PayPal Rails
          </span>
        </h1>

        {/* Value Proposition */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Describe any computing workload, budget, or hardware specifications in natural language. PayPilot AI evaluates real specifications via Channel3, calculates 0–100 benchmark matrices, and halts for your mandatory PayPal authorization.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            href="/assistant"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0070BA] hover:bg-[#005EA6] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-fintech-glow transition-all hover:scale-[1.02]"
          >
            <Bot className="w-4 h-4" />
            <span>Launch Shopping Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-slate-200 hover:text-white text-xs font-semibold border border-white/[0.08] transition-all"
          >
            <span>Inspect AG Grid Ledger</span>
          </Link>
        </div>

        {/* Quick Sample Prompts */}
        <div className="pt-4 max-w-2xl mx-auto space-y-2.5">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            Quick Simulation Prompts
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {samplePrompts.map((prompt, idx) => (
              <Link
                key={idx}
                href={`/assistant?q=${encodeURIComponent(prompt)}`}
                className="text-xs text-slate-300 hover:text-white bg-[#0F172A] hover:bg-[#1E293B] hover:border-paypal-blue/50 border border-white/[0.08] px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-paypal-blue shrink-0" />
                <span className="truncate max-w-[280px] sm:max-w-none">{prompt}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          LIVE SWARM TELEMETRY & INTERACTIVE PREVIEW CARD
          ========================================================================= */}
      <section className="max-w-4xl mx-auto rounded-2xl bg-[#0F172A] border border-white/[0.08] overflow-hidden shadow-fintech-card">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08] bg-[#0D1527] font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-paypal-blue" />
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              Live Swarm Execution Lifecycle
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Deterministic State Machine</span>
          </div>
        </div>

        {/* Pipeline Preview Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="space-y-3 p-4 rounded-xl bg-[#080C15]/70 border border-white/[0.06]">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                01 / INTENT
              </span>
              <span className="text-slate-400">Supervisor</span>
            </div>
            <div className="text-xs font-bold text-white">Natural Language to Spec Profile</div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Extracts target hardware criteria, translates currency (e.g., ₹70,000 $\to$ ~$824 USD), and identifies critical CUDA/VRAM requirements.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3 p-4 rounded-xl bg-[#080C15]/70 border border-white/[0.06]">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                02 / EVALUATION
              </span>
              <span className="text-slate-400">Analyst</span>
            </div>
            <div className="text-xs font-bold text-white">Deep Spec Ranking Matrix</div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Compares GPU TGP wattages, CPU compiling benchmarks, and thermal headroom to generate an authoritative 0–100 suitability rating.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-3 p-4 rounded-xl bg-[#080C15]/70 border border-white/[0.06]">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                03 / PAYPAL CHECKPOINT
              </span>
              <span className="text-slate-400">Guardrail</span>
            </div>
            <div className="text-xs font-bold text-white">Cryptographic Price Lock</div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
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
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-paypal-blue">
            Engineering & Safety Guardrails
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Built for Real Financial Security
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Autonomous agent capabilities balanced with deterministic fintech guardrails.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-3 hover:border-paypal-blue/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-white/[0.08] flex items-center justify-center text-paypal-blue shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Anti-Tampering Price Lock</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Order totals are verified directly against backend MySQL records before calling PayPal REST API v2. Client-side tampering is completely rejected.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-white/[0.08] flex items-center justify-center text-emerald-400 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Human-in-the-Loop Rails</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Agents research, rank, and draft orders, but are structurally prohibited from holding credentials or executing autonomous fund transfers.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-3 hover:border-indigo-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-white/[0.08] flex items-center justify-center text-indigo-400 shadow-sm">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Real-Time AG Grid Ledger</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise data grid rendering live transactions, PayPal Order IDs, PayPal Capture IDs, and agent execution times directly from the database.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-3 hover:border-purple-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-white/[0.08] flex items-center justify-center text-purple-400 shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Channel3 Hardware Feeds</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrated with Channel3 sponsor discovery feeds and validated against local high-performance hardware benchmarks.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CALL TO ACTION
          ========================================================================= */}
      <section className="max-w-4xl mx-auto p-8 rounded-2xl bg-[#0F172A] border border-white/[0.08] text-center space-y-5 shadow-fintech-card">
        <h3 className="text-2xl font-bold text-white tracking-tight">
          Ready to Test the Agentic Commerce Flow?
        </h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          Launch the shopping assistant, type any computing workload, and experience the full workflow from AI spec evaluation to verified PayPal Sandbox settlement.
        </p>
        <Link
          href="/assistant"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#0070BA] hover:bg-[#005EA6] text-white text-xs font-bold uppercase tracking-wider shadow-fintech-glow transition-all hover:scale-105"
        >
          <span>Open Shopping Assistant</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
