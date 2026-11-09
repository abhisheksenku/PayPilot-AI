import React from 'react';
import Link from 'next/link';
import { Bot, ArrowRight, ShieldCheck, Cpu, Zap, CreditCard, Sparkles, CheckCircle, Database } from 'lucide-react';

export default function Home() {
  const samplePrompts = [
    'I need a laptop under ₹70,000 for programming, machine learning and occasional gaming',
    'Best ultrabook under $1300 with 32GB RAM and all-day battery life for coding',
    'High-end creator laptop with OLED display and RTX graphics for 3D animation',
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-4">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] text-xs font-semibold text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-[#E53935] animate-pulse"></span>
          <span>PayPal AI Hackathon 2026</span>
          <span className="text-zinc-600">|</span>
          <span className="text-[#E53935] font-mono">Agentic Commerce Track</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          AI That Discovers, Evaluates, & Prepares{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E53935] via-[#FF5252] to-[#FF8A80]">
            PayPal Checkouts
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Describe your tech stack and budget in plain English. PayPilot AI's autonomous multi-agent engine evaluates real specifications, ranks genuine products, and halts for your mandatory PayPal authorization.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/assistant"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#E53935]/25 transition-all hover:scale-105"
          >
            <Bot className="w-4 h-4" />
            <span>Launch Shopping Assistant</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1A1A1A] hover:bg-[#242424] text-zinc-300 text-sm font-semibold border border-[#2E2E2E] transition-colors"
          >
            <span>View AG Grid Dashboard</span>
          </Link>
        </div>

        {/* Quick Sample Prompts */}
        <div className="pt-8">
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-3">
            Quick Try Prompts
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {samplePrompts.map((prompt, idx) => (
              <Link
                key={idx}
                href={`/assistant?q=${encodeURIComponent(prompt)}`}
                className="text-xs text-zinc-300 bg-[#161618] hover:bg-[#202024] hover:border-[#E53935]/50 border border-[#26262A] px-3.5 py-2 rounded-xl transition-all text-left flex items-center gap-2 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E53935] shrink-0 group-hover:scale-110" />
                <span className="line-clamp-1">{prompt}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Agent Architecture Visual Flow */}
      <section className="p-8 rounded-3xl bg-gradient-to-b from-[#141416] to-[#0E0E10] border border-[#242428] space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            How The Multi-Agent State Machine Works
          </h2>
          <p className="text-xs text-zinc-400">
            Strict human-in-the-loop governance: agents never charge without explicit user authorization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-[#1A1A1E] border border-[#2E2E34] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-purple-400">NODE 1 & 2</span>
              <h3 className="text-sm font-bold text-white">Supervisor & Memory</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Gemini extracts budget, currency conversions (e.g. ₹70k to $824), category, and use-case constraints.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-[#1A1A1E] border border-[#2E2E34] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400">NODE 3 & 4</span>
              <h3 className="text-sm font-bold text-white">Research & Analyst</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Retrieves genuine products from Channel3/MySQL, builds comparison matrix, and calculates multi-attribute scores.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-[#1A1A1E] border border-[#E53935] shadow-lg shadow-[#E53935]/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E53935]/20 text-[#E53935] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#E53935]">CHECKPOINT</span>
              <h3 className="text-sm font-bold text-white">Human Authorization</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Halts execution. The agent creates a PayPal Sandbox order and presents a secure human checkout button.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-[#1A1A1E] border border-[#2E2E34] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400">NODE 5 & 6</span>
              <h3 className="text-sm font-bold text-white">PayPal Capture & Audit</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Captures verified funds via PayPal Captures v2, validates server amounts, and logs to MySQL audit trail.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Integrity Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#141416] border border-[#242428] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#E53935] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Anti-Tampering Price Lock</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All order totals are verified directly against backend database pricing. Even if client-side parameters are modified, the server enforces strict price integrity.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#141416] border border-[#242428] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Multi-Attribute Ranking</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Our scoring algorithm evaluates CPU benchmarks, GPU tier, RAM capacity, SSD speed, and price-to-budget ratios to pinpoint the optimal match.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#141416] border border-[#242428] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Live PayPal Sandbox</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Connected to official PayPal Sandbox APIs with OAuth2 token caching, Orders v2, and Captures v2. Real checkout flow without simulated data.
          </p>
        </div>
      </section>
    </div>
  );
}
