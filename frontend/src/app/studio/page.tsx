'use client';

import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
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
  CreditCard,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LenovoLaptopHero } from '@/components/studio/LenovoLaptopHero';
import { PayPalCheckoutModal } from '@/components/modals/PayPalCheckoutModal';
import { api, fallbackProduct } from '@/lib/api';
import { ENABLE_SEED_DATA } from '@/lib/config';
import { RankedProduct } from '@/types/product';
import { AgentExecutionLog } from '@/types/agent';
import { Order } from '@/types/order';

const INITIAL_LOGS: AgentExecutionLog[] = [
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
];

export default function StudioPage() {
  const [activeSubTab, setActiveSubTab] = useState<'studio' | 'orders' | 'logs'>('studio');
  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFxInfo, setShowFxInfo] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Active product and agent state
  const [product, setProduct] = useState<RankedProduct>(fallbackProduct);
  const [budgetINR, setBudgetINR] = useState(70000);
  const [budgetUSD, setBudgetUSD] = useState(824.0);
  const [studioOrders, setStudioOrders] = useState<Order[]>([]);
  const [paymentSuccess, setPaymentSuccess] = useState<{
    captureId: string;
    orderId: string;
    amount: number;
  } | null>(null);

  const numericPrice =
    typeof product.price === 'number'
      ? product.price
      : parseFloat(String(product.price)) || 749.0;

  const [logs, setLogs] = useState<AgentExecutionLog[]>(ENABLE_SEED_DATA ? INITIAL_LOGS : []);

  const checkoutRef = useRef<HTMLDivElement>(null);

  const fetchOrders = () => {
    api.getOrders().then((orders) => {
      if (orders && Array.isArray(orders)) {
        setStudioOrders(orders);
      }
    }).catch(() => {});
  };

  // Fetch initial product catalog & orders from backend on mount
  useEffect(() => {
    api.getProducts().then((prods) => {
      if (prods && prods.length > 0) {
        const lenovo = prods.find((p) => p.name.includes('Lenovo')) || prods[0];
        setProduct((prev) => ({
          ...prev,
          id: lenovo.id,
          externalId: lenovo.externalId,
          name: lenovo.name,
          price: typeof lenovo.price === 'string' ? parseFloat(lenovo.price) : lenovo.price,
          description: lenovo.description || prev.description,
          imageUrl: lenovo.imageUrl || prev.imageUrl,
          specifications: lenovo.specifications || prev.specifications,
        }));
      }
    }).catch(() => {});
    fetchOrders();
  }, []);

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
    fetchOrders();
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 pt-3 pb-4 max-w-[1600px] mx-auto space-y-3.5">
        {/* Page Header Bar (Immediately below navbar, no dead space) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
              Home (Studio)
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-500 -mt-0.5">
              PayPilot AI — Multi-Agent Shopping Studio for Developer & ML Hardware
            </p>
          </div>

          {/* Subnav Pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs self-start sm:self-auto">
            <button
              onClick={() => setActiveSubTab('studio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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

        {/* Sub-Tab 1: Shopping Studio (Main Balanced 2-Column Grid) */}
        {activeSubTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Left Column: Swarm Reasoning Stream & Prompt Bar (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
              {/* Card 1: Currency Normalization */}
              <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between shadow-2xs relative shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                    <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-xs font-bold text-gray-800">Currency Normalization</div>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <span className="font-extrabold text-sm sm:text-base text-gray-900 font-mono tracking-tight">
                        ₹{budgetINR.toLocaleString()} INR ➔ ~${budgetUSD.toFixed(2)} USD
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-200/60 text-emerald-800">
                        <Check className="w-3 h-3 text-emerald-700" />
                        FX Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative shrink-0">
                  <button
                    onClick={() => setShowFxInfo(!showFxInfo)}
                    className="p-1 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/60 rounded-lg transition-colors cursor-pointer"
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
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 mb-3">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-xs sm:text-sm">
                      <Network className="w-4 h-4 text-[#0070BA]" />
                      <span>Multi-Agent Swarm — Reasoning Stream</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {logs.length > 0 ? `${logs.length} Agents Logged` : 'Swarm Standby'}
                    </span>
                  </div>

                  {/* Vertical Step Timeline or Standby Prompt */}
                  {logs.length === 0 ? (
                    <div className="py-8 px-4 text-center space-y-3 bg-gray-50/70 rounded-xl border border-dashed border-gray-200 my-2">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0070BA] flex items-center justify-center mx-auto">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-gray-900">Multi-Agent Swarm Ready</h4>
                        <p className="text-[11px] text-gray-500 max-w-xs mx-auto leading-relaxed">
                          Submit a hardware shopping query or click one of the prompt chips below to trigger live LangGraph reasoning across Supervisor, Channel3, Analyst, and PayPal Purchase agents.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRunSwarm('I need a laptop under ₹70,000 for programming, machine learning and occasional gaming')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0070BA] hover:bg-[#003087] text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Run Sample Query</span>
                      </button>
                    </div>
                  ) : (
                    <div className="relative pl-5 sm:pl-6 space-y-2.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-blue-100">
                      {logs.map((log, idx) => {
                        const isSupervisor = log.agentRole === 'supervisor';
                        const isResearch = log.agentRole === 'research';
                        const isAnalyst = log.agentRole === 'analyst';

                        const colorClasses = isSupervisor
                          ? {
                              border: 'border-violet-500',
                              dot: 'bg-violet-600',
                              cardBg: 'bg-violet-50/40 hover:bg-violet-50 border-violet-100',
                              iconBg: 'bg-violet-100 text-violet-700',
                              badge: 'text-violet-900 bg-violet-100/70',
                              title: 'Supervisor Agent',
                            }
                          : isResearch
                          ? {
                              border: 'border-teal-500',
                              dot: 'bg-teal-600',
                              cardBg: 'bg-teal-50/40 hover:bg-teal-50 border-teal-100',
                              iconBg: 'bg-teal-100 text-teal-700',
                              badge: 'text-teal-900 bg-teal-100/70',
                              title: 'Shopping Research Agent',
                            }
                          : isAnalyst
                          ? {
                              border: 'border-purple-500',
                              dot: 'bg-purple-600',
                              cardBg: 'bg-purple-50/40 hover:bg-purple-50 border-purple-100',
                              iconBg: 'bg-purple-100 text-purple-700',
                              badge: 'text-purple-900 bg-purple-100/70',
                              title: 'Product Analyst Agent',
                            }
                          : {
                              border: 'border-[#0070BA]',
                              dot: 'bg-[#0070BA]',
                              cardBg: 'bg-blue-50/40 hover:bg-blue-50 border-blue-100',
                              iconBg: 'bg-blue-100 text-[#0070BA]',
                              badge: 'text-blue-900 bg-blue-100/70',
                              title: 'Purchase Guardrail Agent',
                            };

                        const StepIcon = isSupervisor ? Bot : isResearch ? Search : isAnalyst ? BarChart3 : Shield;

                        return (
                          <div key={log.id || idx} className="relative group">
                            <div className={`absolute -left-5 sm:-left-6 top-1.5 w-4 h-4 rounded-full bg-white border-2 ${colorClasses.border} flex items-center justify-center`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${colorClasses.dot}`} />
                            </div>
                            <div className={`p-2.5 rounded-xl border transition-colors ${colorClasses.cardBg}`}>
                              <div className="flex items-center justify-between mb-0.5">
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-5 h-5 rounded-md flex items-center justify-center ${colorClasses.iconBg}`}>
                                    <StepIcon className="w-3 h-3" />
                                  </div>
                                  <span className={`font-bold text-[11px] px-2 py-0.5 rounded-md ${colorClasses.badge}`}>
                                    {colorClasses.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-700">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Completed {log.timestamp || '10:24 AM'}</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-700 pl-7">
                                {log.outputSummary || log.inputSummary}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Bottom Actions of Swarm Card */}
                {logs.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    {/* Amber Warning Checkpoint */}
                    <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-2.5 sm:p-3 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#B45309] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-[#92400E]">
                          Execution Halted at Human-in-the-Loop Checkpoint
                        </h4>
                        <p className="text-[11px] text-[#B45309] mt-0.5 leading-relaxed">
                          Please review the recommended product, locked price, and authorize the purchase via PayPal.
                        </p>
                      </div>
                    </div>

                    {/* Big Blue CTA Button */}
                    <button
                      onClick={() => setIsCheckoutModalOpen(true)}
                      className="w-full py-2.5 px-4 bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span className="font-black text-sm tracking-tight">P</span>
                      <span>Review Price Lock & Authorize via PayPal (${numericPrice.toFixed(2)}) →</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Card 3: Prompt & Chat Input */}
              <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-3.5 shadow-2xs space-y-2.5 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRunSwarm();
                  }}
                  className="flex items-center gap-2 relative"
                >
                  <Sparkles className="w-4 h-4 text-[#0070BA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder='Ask PayPilot AI... (e.g., "Find a gaming laptop under ₹70,000")'
                    disabled={isProcessing}
                    className="w-full pl-9 pr-11 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0070BA] focus:ring-2 focus:ring-[#0070BA]/20 transition-all disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || !promptInput.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#0070BA] hover:bg-[#005ea6] text-white rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-[#0070BA] cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Suggestions Row */}
                <div className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto pb-0.5">
                  <span className="font-medium text-gray-400 shrink-0 text-[11px]">Try:</span>
                  <button
                    onClick={() => handleRunSwarm('Gaming laptop with RTX 4060 under ₹70,000')}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gray-100 hover:bg-gray-200/70 text-gray-700 text-[11px] font-medium transition-colors cursor-pointer shrink-0"
                  >
                    <span>🎮</span>
                    <span>Gaming under ₹70,000</span>
                  </button>
                  <button
                    onClick={() => handleRunSwarm('Apple MacBook Pro M3 with 36GB unified memory')}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gray-100 hover:bg-gray-200/70 text-gray-700 text-[11px] font-medium transition-colors cursor-pointer shrink-0"
                  >
                    <span>💻</span>
                    <span>MacBook M3 36GB</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Hardware Spotlight & PayPal Checkout Stack (5 Cols - Full Height Match) */}
            <div className="lg:col-span-5 flex flex-col" ref={checkoutRef}>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-2xs h-full flex flex-col justify-between space-y-3.5">
                {/* Top Section */}
                <div className="space-y-3">
                  {/* Spotlight Header Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF5FF] text-[#0070BA] border border-[#D0E5FF]/80">
                      <Star className="w-3.5 h-3.5 fill-[#0070BA]" />
                      Hardware Spotlight
                    </span>

                    <div className="flex items-center gap-1 text-gray-400">
                      <button
                        onClick={() => setIsFavorited(!isFavorited)}
                        className="p-1 rounded-lg hover:bg-gray-100 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Add to wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isFavorited ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>
                      <button
                        className="p-1 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                        title="More options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Product Title & Subtitle */}
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
                      {product.name}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* SIDE-BY-SIDE HERO LAYOUT (Exact Match to Blueprint) */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1">
                    {/* Left Column: Hero Hardware Visual (~60% width) */}
                    <div className="sm:col-span-7 flex items-center justify-center">
                      <LenovoLaptopHero />
                    </div>

                    {/* Right Column: Price & Badges (~40% width) */}
                    <div className="sm:col-span-5 flex flex-col justify-center space-y-2">
                      {/* Big Price Tag */}
                      <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-mono">
                        ${numericPrice.toFixed(2)}{' '}
                        <span className="text-xs font-bold text-gray-500 block sm:inline">USD</span>
                      </div>

                      {/* Gold 98/100 AI Score Badge Card */}
                      <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl px-2.5 py-1.5 text-center shadow-2xs">
                        <div className="inline-flex items-center justify-center gap-1 text-xs font-bold text-[#92400E]">
                          <span>🏆</span>
                          <span>{product.score}/100 AI Score</span>
                        </div>
                      </div>

                      {/* Green Budget Badge Card */}
                      <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl px-2.5 py-1.5 text-center shadow-2xs">
                        <div className="text-xs font-bold text-emerald-800">
                          ↓ $75 under budget
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium">
                          (Budget: ${budgetUSD.toFixed(2)} USD)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Spec Chips Row */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
                    <div className="p-2 bg-gray-50 rounded-xl border border-gray-200/80 text-center space-y-0.5">
                      <div className="w-5 h-5 rounded-md bg-blue-100 text-[#0070BA] flex items-center justify-center mx-auto">
                        <Cpu className="w-3 h-3" />
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-bold text-gray-900 leading-tight">
                        115W TGP RTX 4060
                      </div>
                    </div>

                    <div className="p-2 bg-gray-50 rounded-xl border border-gray-200/80 text-center space-y-0.5">
                      <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                        <Zap className="w-3 h-3" />
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-bold text-gray-900 leading-tight">
                        16GB DDR5 5200MHz
                      </div>
                    </div>

                    <div className="p-2 bg-gray-50 rounded-xl border border-gray-200/80 text-center space-y-0.5">
                      <div className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                        <Monitor className="w-3 h-3" />
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-bold text-gray-900 leading-tight">
                        100% sRGB Display
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Payment Success Banner + 3 PayPal Buttons + Trust Badges */}
                <div className="space-y-2 pt-1">
                  {/* Payment Confirmation Banner */}
                  {paymentSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Payment Authorized & Captured!</span>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          SETTLED
                        </span>
                      </div>
                      <div className="text-[11px] space-y-0.5 font-mono text-emerald-800 bg-white/70 p-2 rounded-lg border border-emerald-100">
                        <div>PayPal Order ID: <strong>{paymentSuccess.orderId}</strong></div>
                        <div>Capture ID: <strong>{paymentSuccess.captureId}</strong></div>
                        <div>Amount: <strong>${paymentSuccess.amount.toFixed(2)} USD</strong></div>
                      </div>
                    </div>
                  )}

                  {/* 3 PayPal Buttons */}
                  <div className="space-y-2">
                    {/* Button 1: Official Gold PayPal Checkout */}
                    <button
                      onClick={() => setIsCheckoutModalOpen(true)}
                      className="w-full py-2.5 px-4 bg-[#FFC439] hover:bg-[#F4B400] text-[#003087] font-extrabold text-xs sm:text-sm rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#E0A800]/50"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
                        <path
                          d="M7 2h6.5c3.5 0 6 2.3 5.3 5.8-.7 3.5-3.4 5.4-6.8 5.4H9.2L7.6 22H3.7L7 2z"
                          fill="#003087"
                        />
                        <path
                          d="M10 8h6.2c3.1 0 5.4 2.1 4.8 5.3-.6 3.1-3 4.9-6.1 4.9H12l-1.3 7H7l3-17.2z"
                          fill="#0070BA"
                        />
                      </svg>
                      <span>PayPal <span className="font-bold text-gray-900">Checkout</span></span>
                    </button>

                    {/* Button 2: Pay Later */}
                    <button
                      onClick={() => setIsCheckoutModalOpen(true)}
                      className="w-full py-2.5 px-3.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl shadow-2xs transition-all flex items-center justify-between cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-extrabold text-xs text-[#0070BA]">P</span>
                        <span className="font-bold text-xs text-[#003087]">Pay Later</span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-medium truncate ml-2">
                        Buy now, pay in 4 interest-free payments <span className="text-gray-400">ⓘ</span>
                      </div>
                    </button>

                    {/* Button 3: Debit or Credit Card */}
                    <button
                      onClick={() => setIsCheckoutModalOpen(true)}
                      className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-gray-600" />
                      <span>Debit or Credit Card</span>
                    </button>
                  </div>

                  {/* Footer Trust Badges */}
                  <div className="flex items-center justify-center gap-5 pt-2 text-[11px] text-gray-500 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Lock className="w-3 h-3 text-gray-400" />
                      <span>Secure checkout by PayPal</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Shield className="w-3 h-3 text-gray-400" />
                      <span>Buyer Protection ⓘ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab 2: Orders View */}
        {activeSubTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Orders & Payment Receipts</h3>
                <p className="text-xs text-gray-500">Live ledger of purchases authorized through PayPal</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                {studioOrders.length > 0
                  ? `${studioOrders.length} Active Record${studioOrders.length > 1 ? 's' : ''}`
                  : ENABLE_SEED_DATA
                  ? '1 Active Record'
                  : '0 Active Records'}
              </span>
            </div>

            <div className="overflow-x-auto">
              {studioOrders.length === 0 && !ENABLE_SEED_DATA ? (
                <div className="py-12 text-center text-xs text-gray-500 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-gray-700">No live orders recorded yet</p>
                  <p className="text-gray-400">Complete an order via PayPal in the Studio tab to see real ledger entries here.</p>
                </div>
              ) : (
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
                    {studioOrders.length > 0 ? (
                      studioOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono font-semibold text-[#0070BA]">
                            ORD-{ord.id.slice(0, 8).toUpperCase()}
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {ord.Product?.name || 'Lenovo LOQ 15 Gaming & ML Laptop'}
                          </td>
                          <td className="py-3 px-4 font-bold font-mono">
                            ${Number(ord.totalAmount || 749).toFixed(2)} USD
                          </td>
                          <td className="py-3 px-4 font-mono text-gray-600">
                            {ord.paypalOrderId || ord.id}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {ord.status || 'CAPTURED'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-US', {
                              month: 'short',
                              day: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))
                    ) : (
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
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Sub-Tab 3: Agent Logs View */}
        {activeSubTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Multi-Agent Swarm Audit Trail</h3>
                <p className="text-xs text-gray-500">Chronological telemetry of tool execution and state transitions</p>
              </div>
              <span className="text-xs font-mono text-gray-500">
                {logs.length} Event{logs.length === 1 ? '' : 's'} Captured
              </span>
            </div>

            {logs.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500 space-y-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                  <Activity className="w-4 h-4" />
                </div>
                <p className="font-semibold text-gray-700">No agent telemetry logged yet</p>
                <p className="text-gray-400">Trigger a prompt in the Studio tab to stream live multi-agent execution events.</p>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>

      {/* Interactive PayPal Checkout Modal */}
      <PayPalCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        productId={product.id || '769d593b-4db0-49ee-a3f3-ea81dd010ff8'}
        productName={product.name}
        amount={numericPrice}
        onSuccess={triggerPaymentSuccess}
      />
    </DashboardLayout>
  );
}
