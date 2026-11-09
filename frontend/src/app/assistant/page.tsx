'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Sparkles, Terminal, Activity, ArrowRight, ShieldCheck, Cpu, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { api, ChatResponse, ExecutionLog } from '@/lib/api';
import { AgentPill } from '@/components/assistant/AgentPill';
import { ProductCard } from '@/components/assistant/ProductCard';
import { CheckoutModal } from '@/components/assistant/CheckoutModal';
import { FormattedMessage } from '@/components/assistant/FormattedMessage';

interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  activeAgent?: string;
  rankedProducts?: ChatResponse['rankedProducts'];
  requiresApproval?: boolean;
  timestamp: string;
}

function AssistantContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [inputMessage, setInputMessage] = useState(initialQuery);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'PayPilot Swarm initialized. Describe your target computing requirements, use-case, and budget in natural language (e.g., *"I need a laptop under ₹70,000 for programming, machine learning and occasional gaming"*).',
      activeAgent: 'supervisor',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [auditLogs, setAuditLogs] = useState<ExecutionLog[]>([]);
  const [showAuditDrawer, setShowAuditDrawer] = useState(false);

  // Active products to display in the right canvas
  const [activeProducts, setActiveProducts] = useState<ChatResponse['rankedProducts']>([]);

  // Selected product for checkout modal
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: string;
    name: string;
    price: number;
    currency: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeStep]);

  // If initialQuery is present, automatically trigger once
  const initialQueryProcessed = useRef(false);
  useEffect(() => {
    if (initialQuery && !initialQueryProcessed.current) {
      initialQueryProcessed.current = true;
      handleSendMessage(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const quickPrompts = [
    'Under ₹70,000 for ML & gaming',
    'MacBook M3 with 16GB RAM for iOS dev',
    'Dell XPS 14 with 32GB RAM & OLED',
    'Ultra-budget coding laptop under $700',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isProcessing) return;

    // Add user message to stream
    const userMsg: MessageItem = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsProcessing(true);

    // Realistic multi-agent reasoning ticker
    setActiveStep('Supervisor Agent: parsing intent, currency & constraints...');
    setCurrentStepIndex(1);

    const t1 = setTimeout(() => {
      setActiveStep('Shopping Research: querying Channel3 verified catalog...');
      setCurrentStepIndex(2);
    }, 700);

    const t2 = setTimeout(() => {
      setActiveStep('Product Analyst: computing GPU TGP & benchmark matrix...');
      setCurrentStepIndex(3);
    }, 1400);

    const t3 = setTimeout(() => {
      setActiveStep('Purchase Agent: verifying server price lock & arming PayPal checkpoint...');
      setCurrentStepIndex(4);
    }, 2100);

    try {
      const response = await api.sendMessage({
        message: text,
        conversationId,
      });

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      setConversationId(response.conversationId);

      // Append assistant message
      const assistantMsg: MessageItem = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: response.agentResponse,
        activeAgent: response.activeAgent,
        rankedProducts: response.rankedProducts,
        requiresApproval: response.requiresApproval,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Set active products for the Right Canvas
      if (response.rankedProducts && response.rankedProducts.length > 0) {
        setActiveProducts(response.rankedProducts);
        // Pre-select top ranked
        const top = response.rankedProducts[0];
        setSelectedProduct({
          productId: top.productId,
          name: top.name,
          price: top.price,
          currency: top.currency,
        });
      }

      // Fetch audit logs
      if (response.conversationId) {
        const logs = await api.getExecutions(response.conversationId);
        setAuditLogs(logs);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: `⚠️ Error executing agent workflow: ${error.message || 'Service unavailable'}. Please try again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsProcessing(false);
      setActiveStep(null);
      setCurrentStepIndex(0);
    }
  };

  const handleSelectProduct = (productId: string) => {
    const prod = activeProducts?.find((p) => p.productId === productId);
    if (prod) {
      setSelectedProduct({
        productId: prod.productId,
        name: prod.name,
        price: prod.price,
        currency: prod.currency,
      });
      setIsModalOpen(true);
    }
  };

  const heroProduct = activeProducts?.[0];
  const runnerUps = activeProducts?.slice(1) || [];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-6.5rem)] rounded-2xl bg-[#090A0C] border border-[#23252B] overflow-hidden shadow-fintech-card">
      {/* =========================================================================
          LEFT PANEL (42%): CONVERSATIONAL WORKSPACE & AGENT TELEMETRY
          ========================================================================= */}
      <div className="flex flex-col w-full lg:w-[42%] border-b lg:border-b-0 lg:border-r border-[#23252B] bg-[#0E0F12]">
        {/* Left Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#23252B] bg-[#111215]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-mono font-bold text-white tracking-tight">AGENT WORKSPACE</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAuditDrawer(!showAuditDrawer)}
              className="px-3 py-1 rounded-md bg-[#17181D] hover:bg-[#202229] border border-[#23252B] text-xs font-mono text-[#8F94A0] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-[#E53535]" />
              <span>Audit Trail</span>
            </button>
            <button
              onClick={() => {
                setMessages([messages[0]]);
                setActiveProducts([]);
              }}
              title="Reset conversation"
              className="p-1.5 rounded-md hover:bg-[#17181D] text-[#8F94A0] hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Swarm Live Status Ticker */}
        <div className="px-4 py-2 border-b border-[#23252B] bg-[#14151A] flex items-center gap-2 overflow-x-auto">
          <AgentPill agentName="supervisor" isProcessing={currentStepIndex === 1} />
          <AgentPill agentName="research" isProcessing={currentStepIndex === 2} />
          <AgentPill agentName="analyst" isProcessing={currentStepIndex === 3} />
          <AgentPill agentName="purchase" isProcessing={currentStepIndex === 4} />
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}>
                <div className="flex items-center gap-2 px-1 text-xs font-mono text-[#8F94A0]">
                  <span className="font-semibold text-white">{isUser ? 'You' : 'PayPilot Swarm'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[96%] rounded-xl px-4 py-3.5 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#1D1F26] text-white border border-[#2D3039]'
                      : 'bg-[#111215] text-[#E5E7EB] border border-[#23252B] shadow-sm'
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <FormattedMessage
                      content={msg.content}
                      hasProductToCheckout={Boolean(activeProducts[0])}
                      onOpenCheckout={() => {
                        if (activeProducts[0]) {
                          setSelectedProduct(activeProducts[0]);
                          setIsModalOpen(true);
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {/* Active Reasoning Ticker */}
          {isProcessing && activeStep && (
            <div className="p-3.5 rounded-xl bg-[#14151A] border border-[#23252B] flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E53535] animate-ping" />
              <div className="font-mono text-xs text-[#A3A8B5] truncate">
                <span className="text-[#E53535] font-bold">[{currentStepIndex}/4]</span> {activeStep}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 pt-3 pb-2 border-t border-[#23252B] bg-[#0E0F12]">
          <div className="text-xs font-mono uppercase tracking-wider text-[#8F94A0] mb-2 font-semibold">
            Quick Prompts
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isProcessing}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-[#17181D] hover:bg-[#202229] hover:border-[#3E424E] border border-[#23252B] text-xs text-[#A3A8B5] hover:text-white transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#111215] border-t border-[#23252B]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-[#17181D] border border-[#23252B] focus-within:border-[#E53535]/60 rounded-xl px-3.5 py-2.5 transition-colors"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Describe specs, budget (₹ / $), and workload..."
              disabled={isProcessing}
              className="flex-1 bg-transparent text-sm text-white placeholder-[#8F94A0] outline-none"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isProcessing}
              className="p-2 rounded-lg bg-[#E53535] hover:bg-[#D32F2F] disabled:opacity-30 disabled:hover:bg-[#E53535] text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-xs font-mono text-[#8F94A0] px-1 mt-2">
            <span>Official PayPal Sandbox Rails</span>
            <span>Press Enter ↵ to send</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL (58%): DYNAMIC COMMERCE & SPEC EVALUATION CANVAS
          ========================================================================= */}
      <div className="flex-1 flex flex-col bg-[#090A0C] overflow-y-auto">
        {activeProducts.length === 0 ? (
          /* Idle / Discovery Canvas */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#17181D] border border-[#23252B] flex items-center justify-center text-[#E53535] shadow-lg">
              <Cpu className="w-7 h-7" />
            </div>

            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Autonomous Hardware Discovery Canvas
              </h3>
              <p className="text-xs text-[#8F94A0] leading-relaxed">
                When you submit a request, the multi-agent swarm retrieves candidate hardware from Channel3, calculates deep benchmark matrices, and spotlights the #1 match here with price guarantees.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-left">
              <div className="p-3 rounded-xl bg-[#111215] border border-[#23252B] space-y-1">
                <span className="text-[10px] font-mono text-[#E53535] font-bold">01 / DISCOVERY</span>
                <div className="text-xs font-bold text-white">Channel3 Catalog</div>
                <p className="text-[11px] text-[#8F94A0]">Live hardware specs with real TGP ratings.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#111215] border border-[#23252B] space-y-1">
                <span className="text-[10px] font-mono text-amber-400 font-bold">02 / ANALYSIS</span>
                <div className="text-xs font-bold text-white">Benchmark Matrix</div>
                <p className="text-[11px] text-[#8F94A0]">Weighted 0–100 multi-attribute suitability scores.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#111215] border border-[#23252B] space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">03 / GOVERNANCE</span>
                <div className="text-xs font-bold text-white">PayPal Checkpoint</div>
                <p className="text-[11px] text-[#8F94A0]">Mandatory human approval via PayPal SDK.</p>
              </div>
            </div>

            <button
              onClick={() => handleSendMessage('I need a laptop under ₹70,000 for programming, machine learning and occasional gaming')}
              className="px-5 py-2.5 rounded-xl bg-[#17181D] hover:bg-[#202229] border border-[#23252B] text-xs font-mono font-bold text-white flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E53535]" />
              <span>Simulate Benchmark Query (₹70,000 ML Laptop)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Active Results Canvas */
          <div className="p-6 space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#23252B]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white tracking-tight">Evaluated Hardware Portfolio</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#17181D] text-[#8F94A0] border border-[#23252B]">
                    {activeProducts.length} Models
                  </span>
                </div>
                <p className="text-xs text-[#8F94A0] mt-0.5">
                  Ranked against your multi-attribute workload parameters.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Anti-Tamper Lock Active
                </span>
              </div>
            </div>

            {/* HERO SPOTLIGHT: #1 Ranked Product */}
            {heroProduct && (
              <ProductCard
                product={heroProduct}
                onSelect={handleSelectProduct}
                isSelected={selectedProduct?.productId === heroProduct.productId}
                isHero={true}
              />
            )}

            {/* RUNNER-UP ALTERNATIVES */}
            {runnerUps.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8F94A0]">
                  Comparative Runner-Up Options
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {runnerUps.map((product) => (
                    <ProductCard
                      key={product.productId}
                      product={product}
                      onSelect={handleSelectProduct}
                      isSelected={selectedProduct?.productId === product.productId}
                      isHero={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          CHECKOUT MODAL (HUMAN-IN-THE-LOOP CHECKPOINT)
          ========================================================================= */}
      {selectedProduct && (
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
          conversationId={conversationId}
          onPaymentSuccess={(captureId, orderId) => {
            console.log('Payment success:', { captureId, orderId });
          }}
        />
      )}
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-[#8F94A0]">Initializing PayPilot Swarm...</div>}>
      <AssistantContent />
    </Suspense>
  );
}
