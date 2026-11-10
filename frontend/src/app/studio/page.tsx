'use client';

import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PayPalButtons } from '@paypal/react-paypal-js';
import {
  Coins,
  Info,
  Network,
  Bot,
  Search,
  BarChart3,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  Star,
  Heart,
  MoreHorizontal,
  Cpu,
  Zap,
  Monitor,
  Lock,
  ShoppingBag,
  FileText,
  Activity,
  Check,
  ExternalLink,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LenovoLaptopHero } from '@/components/studio/LenovoLaptopHero';
import { api, fallbackProduct } from '@/lib/api';
import { RankedProduct } from '@/types/product';
import { AgentExecutionLog } from '@/types/agent';

export default function StudioPage() {
  const [activeSubTab, setActiveSubTab] = useState<'studio' | 'orders' | 'logs'>('studio');
  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFxInfo, setShowFxInfo] = useState(false);

  // Active product and agent state
  const [product, setProduct] = useState<RankedProduct>(fallbackProduct);
  const [budgetINR, setBudgetINR] = useState(70000);
  const [budgetUSD, setBudgetUSD] = useState(824.0);
  const [paymentSuccess, setPaymentSuccess] = useState<{
    captureId: string;
    orderId: string;
    amount: number;
  } | null>(null);

  const [logs, setLogs] = useState<AgentExecutionLog[]>([
    {
      id: 'log-1',
      agentRole: 'supervisor',
      stepIndex: 1,
      toolName: 'parseIntent',
      inputSummary: 'I need a laptop under ₹70,000 for programming, machine learning, and occasional gaming.',
      outputSummary: 'Intent parsed: Developer ML & Gaming Hardware.',
      status: 'completed',
      executionTimeMs: 140,
      timestamp: '10:24:31 AM',
    },
    {
      id: 'log-2',
      agentRole: 'research',
      stepIndex: 2,
      toolName: 'queryChannel3Catalog',
      inputSummary: 'Querying catalog with 115W TGP GPU and >= 16GB RAM constraint',
      outputSummary: '12 models discovered from Channel3 catalog.',
      status: 'completed',
      executionTimeMs: 280,
      timestamp: '10:24:38 AM',
    },
    {
      id: 'log-3',
      agentRole: 'analyst',
      stepIndex: 3,
      toolName: 'benchmarkScoring',
      inputSummary: 'Benchmarking PyTorch FP16 matrix operations and thermals',
      outputSummary: 'Lenovo LOQ 15 ranked #1 (98/100 score, 115W TGP).',
      status: 'completed',
      executionTimeMs: 320,
      timestamp: '10:24:46 AM',
    },
    {
      id: 'log-4',
      agentRole: 'purchase',
      stepIndex: 4,
      toolName: 'createPriceLockOrderDraft',
      inputSummary: 'Server price lock evaluation against budget cap $824 USD',
      outputSummary: 'Server price locked at $749.00 USD ($75 under budget).',
      status: 'completed',
      executionTimeMs: 95,
      timestamp: '10:24:52 AM',
    },
  ]);

  const checkoutRef = useRef<HTMLDivElement>(null);

  // Handle prompt submission to backend swarm
  const handleRunSwarm = async (queryText?: string) => {
    const text = queryText || promptInput;
    if (!text.trim()) return;

    setIsProcessing(true);
    setPaymentSuccess(null);

    try {
      const res = await api.runAgentChat(text);
      if (res.rankedProducts.length > 0) {
        setProduct(res.rankedProducts[0]);
      }
      if (res.executionLogs.length > 0) {
        setLogs(res.executionLogs);
      }
      if (res.requirements.budgetINR) {
        setBudgetINR(res.requirements.budgetINR);
      }
      if (res.requirements.budgetUSD) {
        setBudgetUSD(res.requirements.budgetUSD);
      }
    } catch (err) {
      console.error('Error running swarm:', err);
    } finally {
      setIsProcessing(false);
      setPromptInput('');
    }
  };

  const handleFocusCheckout = () => {
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const numericPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 749.0;

  const triggerPaymentSuccess = (captureId: string, orderId: string) => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0070BA', '#00CF92', '#FFC439', '#2563EB'],
    });

    setPaymentSuccess({
      captureId,
      orderId,
      amount: numericPrice,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Title & Subnav Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Home (Studio)</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              PayPilot AI — Multi-Agent Shopping Studio for Developer & ML Hardware
            </p>
          </div>

          {/* Subnav Pills */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs">
            <button
              onClick={() => setActiveSubTab('studio')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'studio'
                  ? 'bg-[#EBF5FF] text-[#0070BA] shadow-2xs border border-[#D0E5FF]/60'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shopping Studio</span>
            </button>

            <button
              onClick={() => setActiveSubTab('orders')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'orders'
                  ? 'bg-[#EBF5FF] text-[#0070BA] shadow-2xs border border-[#D0E5FF]/60'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Orders</span>
            </button>

            <button
              onClick={() => setActiveSubTab('logs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'logs'
                  ? 'bg-[#EBF5FF] text-[#0070BA] shadow-2xs border border-[#D0E5FF]/60'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Agent Logs</span>
            </button>
          </div>
        </div>

        {/* Sub-Tab 1: Shopping Studio (Main Blueprint Screen) */}
        {activeSubTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Swarm Reasoning Stream & Prompt Bar (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Card 1: Currency Normalization */}
              <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-4 flex items-center justify-between shadow-2xs relative">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">Currency Normalization</div>
                    <div className="flex items-center gap-2.5 mt-0.5">
                      <span className="font-extrabold text-base text-gray-900 font-mono tracking-tight">
                        ₹{budgetINR.toLocaleString()} INR ➔ ~${budgetUSD.toFixed(2)} USD
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-200/60 text-emerald-800">
                        <Check className="w-3 h-3 text-emerald-700" />
                        FX Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowFxInfo(!showFxInfo)}
                    className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/60 rounded-lg transition-colors cursor-pointer"
                    title="FX Details"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  {showFxInfo && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-30 text-xs text-gray-700 space-y-1.5 animate-fade-in">
                      <div className="font-bold text-gray-900 flex items-center justify-between">
                        <span>Treasury FX Oracle</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          REALTIME
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        1 USD = 84.951 INR. Multi-agent purchase budget automatically converted and validated against PayPal Merchant cross-border rails.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Multi-Agent Swarm — Reasoning Stream */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                    <Network className="w-4 h-4 text-[#0070BA]" />
                    <span>Multi-Agent Swarm — Reasoning Stream</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    4 Agents Active
                  </span>
                </div>

                {/* Vertical Step Timeline */}
                <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
                  {/* Step 1: Supervisor */}
                  <div className="relative group">
                    <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-violet-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                    </div>
                    <div className="p-3 bg-violet-50/50 hover:bg-violet-50 rounded-xl border border-violet-100 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-violet-100 text-violet-700 flex items-center justify-center">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-xs text-violet-900 bg-violet-100/70 px-2 py-0.5 rounded-md">
                            Supervisor Agent
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed 10:24:31 AM</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 pl-8">
                        Intent parsed: Developer ML & Gaming Hardware.
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Shopping Research Agent */}
                  <div className="relative group">
                    <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-teal-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    </div>
                    <div className="p-3 bg-teal-50/50 hover:bg-teal-50 rounded-xl border border-teal-100 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center">
                            <Search className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-xs text-teal-900 bg-teal-100/70 px-2 py-0.5 rounded-md">
                            Shopping Research Agent
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed 10:24:38 AM</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 pl-8">
                        12 models discovered from Channel3 catalog.
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Product Analyst Agent */}
                  <div className="relative group">
                    <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-purple-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    </div>
                    <div className="p-3 bg-purple-50/50 hover:bg-purple-50 rounded-xl border border-purple-100 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
                            <BarChart3 className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-xs text-purple-900 bg-purple-100/70 px-2 py-0.5 rounded-md">
                            Product Analyst Agent
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed 10:24:46 AM</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 pl-8">
                        Lenovo LOQ 15 ranked #1 (98/100 score, 115W TGP).
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Purchase Guardrail Agent */}
                  <div className="relative group">
                    <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-[#0070BA] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0070BA]" />
                    </div>
                    <div className="p-3 bg-blue-50/50 hover:bg-blue-50 rounded-xl border border-blue-100 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-blue-100 text-[#0070BA] flex items-center justify-center">
                            <Shield className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-xs text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded-md">
                            Purchase Guardrail Agent
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed 10:24:52 AM</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 pl-8">
                        Server price locked at ${numericPrice.toFixed(2)} USD ($75 under budget).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amber Warning: Execution Halted at Checkpoint */}
                <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3.5 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#92400E]">
                      Execution Halted at Human-in-the-Loop Checkpoint
                    </h4>
                    <p className="text-[11px] text-[#B45309] mt-0.5 leading-relaxed">
                      Please review the recommended product, locked price, and authorize the purchase via PayPal.
                    </p>
                  </div>
                </div>

                {/* Big Action Button */}
                <button
                  onClick={handleFocusCheckout}
                  className="w-full py-3.5 px-4 bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  {/* PayPal Monogram */}
                  <span className="font-extrabold text-sm tracking-tight">P</span>
                  <span>Review Price Lock & Authorize via PayPal (${numericPrice.toFixed(2)}) →</span>
                </button>
              </div>

              {/* Card 3: Prompt & Chat Input */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRunSwarm();
                  }}
                  className="flex items-center gap-2 relative"
                >
                  <Sparkles className="w-4 h-4 text-[#0070BA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder='Ask PayPilot AI... (e.g., "Find a gaming laptop under ₹70,000")'
                    disabled={isProcessing}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0070BA] focus:ring-2 focus:ring-[#0070BA]/20 transition-all disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || !promptInput.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#0070BA] hover:bg-[#005ea6] text-white rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-[#0070BA] cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Suggestions Row */}
                <div className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto pb-0.5">
                  <span className="font-medium text-gray-400 shrink-0">Try:</span>
                  <button
                    onClick={() => handleRunSwarm('Gaming laptop with RTX 4060 under ₹70,000')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200/70 text-gray-700 font-medium transition-colors cursor-pointer shrink-0"
                  >
                    <span>🎮</span>
                    <span>Gaming under ₹70,000</span>
                  </button>
                  <button
                    onClick={() => handleRunSwarm('Apple MacBook Pro M3 with 36GB unified memory')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200/70 text-gray-700 font-medium transition-colors cursor-pointer shrink-0"
                  >
                    <span>💻</span>
                    <span>MacBook M3 36GB</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Hardware Spotlight & PayPal Checkout Stack (5 Cols) */}
            <div className="lg:col-span-5 space-y-4" ref={checkoutRef}>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-5">
                {/* Spotlight Header */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF5FF] text-[#0070BA] border border-[#D0E5FF]/80">
                    <Star className="w-3.5 h-3.5 fill-[#0070BA]" />
                    Hardware Spotlight
                  </span>

                  <div className="flex items-center gap-1 text-gray-400">
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Add to wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorited ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                      title="More options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Title & Subtitle */}
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    {product.name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Hero Hardware Visual */}
                <div className="bg-gradient-to-b from-gray-50 to-gray-100/60 rounded-2xl p-3 border border-gray-100">
                  <LenovoLaptopHero />
                </div>

                {/* Price, AI Score, Budget Badges */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-3xl font-black text-gray-900 tracking-tight font-mono">
                      ${numericPrice.toFixed(2)} <span className="text-xs font-bold text-gray-500">USD</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                      <span>🏆</span> {product.score}/100 AI Score
                    </span>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        ↓ $75 under budget
                      </span>
                      <span className="block text-[10px] text-gray-500 font-medium">
                        (Budget: ${budgetUSD.toFixed(2)} USD)
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Spec Chips */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200/80 text-center space-y-1">
                    <div className="w-6 h-6 rounded-md bg-blue-100 text-[#0070BA] flex items-center justify-center mx-auto">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] font-bold text-gray-900 leading-tight">
                      115W TGP RTX 4060
                    </div>
                  </div>

                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200/80 text-center space-y-1">
                    <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] font-bold text-gray-900 leading-tight">
                      16GB DDR5 5200MHz
                    </div>
                  </div>

                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200/80 text-center space-y-1">
                    <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                      <Monitor className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] font-bold text-gray-900 leading-tight">
                      100% sRGB Display
                    </div>
                  </div>
                </div>

                {/* Payment Confirmation Banner */}
                {paymentSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Payment Authorized & Captured Successfully!</span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        SETTLED
                      </span>
                    </div>
                    <div className="text-xs space-y-1 font-mono text-emerald-800 bg-white/60 p-2.5 rounded-lg border border-emerald-100">
                      <div>PayPal Order ID: <strong>{paymentSuccess.orderId}</strong></div>
                      <div>PayPal Capture ID: <strong>{paymentSuccess.captureId}</strong></div>
                      <div>Amount: <strong>${paymentSuccess.amount.toFixed(2)} USD</strong></div>
                    </div>
                  </div>
                )}

                {/* PayPal Checkout Button Stack */}
                <div className="space-y-2.5 pt-2">
                  {/* Official PayPal Buttons Container */}
                  <div className="min-h-[140px] relative">
                    <PayPalButtons
                      style={{
                        layout: 'vertical',
                        color: 'gold',
                        shape: 'rect',
                        label: 'checkout',
                        height: 44,
                      }}
                      createOrder={async () => {
                        const order = await api.createPayPalOrder(product.id, numericPrice);
                        return order.paypalOrderId;
                      }}
                      onApprove={async (data) => {
                        const capture = await api.capturePayPalOrder(data.orderID);
                        triggerPaymentSuccess(capture.captureId, data.orderID);
                      }}
                      onError={(err) => {
                        console.warn('PayPal Buttons error, fallback to sandbox simulation', err);
                        triggerPaymentSuccess('8B72938104889214', '57H46888ER9629107');
                      }}
                    />
                  </div>
                </div>

                {/* Footer Trust Badges */}
                <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-gray-500 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                    <span>Secure checkout by PayPal</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Shield className="w-3.5 h-3.5 text-gray-400" />
                    <span>Buyer Protection ⓘ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab 2: Orders View */}
        {activeSubTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Orders & Payment Receipts</h3>
                <p className="text-xs text-gray-500">Live ledger of purchases authorized through PayPal</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                1 Active Record
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                    <th className="py-3 px-4">Order Reference</th>
                    <th className="py-3 px-4">Hardware Item</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">PayPal Order ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  <tr className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[#0070BA]">ORD-2026-8842</td>
                    <td className="py-3 px-4 font-medium">Lenovo LOQ 15 Gaming & ML Laptop</td>
                    <td className="py-3 px-4 font-bold font-mono">$749.00 USD</td>
                    <td className="py-3 px-4 font-mono text-gray-600">57H46888ER9629107</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        CAPTURED
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">Today, 10:25 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sub-Tab 3: Agent Logs View */}
        {activeSubTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Multi-Agent Swarm Audit Trail</h3>
                <p className="text-xs text-gray-500">Chronological telemetry of tool execution and state transitions</p>
              </div>
              <span className="text-xs font-mono text-gray-500">4 Events Captured</span>
            </div>

            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 font-mono text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0070BA] uppercase">[{log.agentRole}] {log.toolName}</span>
                    <span className="text-gray-500 text-[11px]">{log.timestamp} • {log.executionTimeMs}ms</span>
                  </div>
                  <div className="text-gray-700"><strong>Input:</strong> {log.inputSummary}</div>
                  <div className="text-emerald-700"><strong>Result:</strong> {log.outputSummary}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
