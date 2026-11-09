'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Bot, User, Sparkles, ShieldAlert, Activity, ChevronRight } from 'lucide-react';
import { api, ChatResponse, ExecutionLog } from '@/lib/api';
import { AgentPill } from '@/components/assistant/AgentPill';
import { ProductCard } from '@/components/assistant/ProductCard';
import { CheckoutModal } from '@/components/assistant/CheckoutModal';

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
        "👋 Hello! I am **PayPilot AI**, your autonomous shopping assistant powered by multi-agent intelligence and PayPal. Tell me what you're looking for, your budget, and how you intend to use it (e.g., *\"I need a laptop under ₹70,000 for programming, machine learning and occasional gaming\"*)!",
      activeAgent: 'supervisor',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<ExecutionLog[]>([]);
  const [showAuditDrawer, setShowAuditDrawer] = useState(false);

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
  }, [initialQuery]);

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

    // Multi-Agent visual timeline progression
    setActiveStep('Supervisor analyzing intent and parsing budget...');
    const t1 = setTimeout(() => {
      setActiveStep('Shopping Research querying catalog specifications...');
    }, 800);
    const t2 = setTimeout(() => {
      setActiveStep('Product Analyst calculating multi-attribute ranking matrix...');
    }, 1600);

    try {
      const response = await api.sendMessage({
        message: text,
        conversationId,
      });

      clearTimeout(t1);
      clearTimeout(t2);

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

      // If response requires approval and has products, pre-select top product
      if (response.requiresApproval && response.rankedProducts && response.rankedProducts.length > 0) {
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
        api.getExecutions(response.conversationId).then(setAuditLogs);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: `⚠️ Error executing request: ${err.message || 'Server communication issue'}`,
          activeAgent: 'supervisor',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsProcessing(false);
      setActiveStep(null);
    }
  };

  const handleSelectProduct = (productId: string) => {
    // Find product from recent messages
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.rankedProducts) {
        const found = msg.rankedProducts.find((p) => p.productId === productId);
        if (found) {
          setSelectedProduct({
            productId: found.productId,
            name: found.name,
            price: found.price,
            currency: found.currency,
          });
          setIsModalOpen(true);
          return;
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[900px] rounded-3xl bg-[#111111] border border-[#262626] shadow-2xl overflow-hidden relative">
      {/* Top Header / Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#242424] bg-[#161616]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E53935]/20 text-[#E53935] flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              PayPilot AI Shopping Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-[11px] text-zinc-400">Multi-Agent State Graph with Human-Auth Checkpoint</p>
          </div>
        </div>

        {/* Audit Drawer Toggle */}
        <button
          onClick={() => setShowAuditDrawer(!showAuditDrawer)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showAuditDrawer
              ? 'bg-[#E53935] text-white border-[#E53935]'
              : 'bg-[#1E1E22] text-zinc-300 border-[#2E2E34] hover:bg-[#28282E]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* Main Chat Feed & Optional Drawer */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-zinc-700 text-white'
                      : 'bg-gradient-to-br from-[#E53935] to-[#B71C1C] text-white shadow-md shadow-[#E53935]/30'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className={`space-y-3 max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Agent Pill if Assistant */}
                  {!isUser && msg.activeAgent && (
                    <div>
                      <AgentPill agentName={msg.activeAgent} />
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#E53935] text-white rounded-tr-none font-medium'
                        : 'bg-[#18181A] text-zinc-200 border border-[#2B2B2E] rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Render Product Cards if Analyst Returned Recommendations */}
                  {!isUser && msg.rankedProducts && msg.rankedProducts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 w-full">
                      {msg.rankedProducts.map((p) => (
                        <ProductCard
                          key={p.productId}
                          product={p}
                          onSelect={handleSelectProduct}
                          isSelected={selectedProduct?.productId === p.productId}
                        />
                      ))}
                    </div>
                  )}

                  {/* Mandatory Human Authorization Prompt Banner */}
                  {!isUser && msg.requiresApproval && (
                    <div className="p-4 rounded-2xl bg-red-950/30 border border-[#E53935] flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="w-5 h-5 text-[#E53935] shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            Mandatory Human Authorization Required
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            The AI has halted. Click below to review and authenticate via PayPal SDK.
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white text-xs font-bold shrink-0 shadow-lg shadow-[#E53935]/30 flex items-center gap-1.5"
                      >
                        <span>Authorize Payment</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <span className="text-[10px] text-zinc-500 block px-1">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}

          {/* Active Agent Step Thinking Indicator */}
          {isProcessing && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#18181C] border border-[#2E2E36] max-w-md animate-pulse">
              <Sparkles className="w-5 h-5 text-[#E53935] animate-spin" />
              <div className="text-xs text-zinc-300">
                <span className="font-bold text-white block">Orchestrating Multi-Agent Graph...</span>
                <span>{activeStep || 'Thinking...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Audit Trail Drawer (Right Side) */}
        {showAuditDrawer && (
          <div className="w-80 border-l border-[#262626] bg-[#141416] p-4 overflow-y-auto space-y-4 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Execution Audit Trail
              </h3>
              <span className="text-[10px] font-mono text-[#E53935] bg-[#E53935]/10 px-2 py-0.5 rounded border border-[#E53935]/30">
                MySQL 9.3
              </span>
            </div>

            <p className="text-[11px] text-zinc-400">
              Live records from <code className="text-zinc-200">agent_executions</code> table.
            </p>

            <div className="space-y-3">
              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  No tool calls logged yet. Ask a question to trigger the graph.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-black/40 border border-zinc-800 space-y-1 font-mono text-[11px]"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{log.toolName}</span>
                      <span className="text-emerald-400 text-[10px]">{log.executionTime}ms</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>Status:</span>
                      <span className="uppercase text-emerald-300 font-bold">{log.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-[#242424] bg-[#141414]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="e.g. I need a laptop under ₹70,000 for programming, machine learning and occasional gaming..."
            disabled={isProcessing}
            className="flex-1 bg-[#1A1A1E] border border-[#2E2E36] focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none transition-all disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isProcessing || !inputMessage.trim()}
            className="p-3 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white disabled:opacity-50 disabled:hover:bg-[#E53935] transition-all shadow-lg shadow-[#E53935]/25"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Human Authorization Checkout Modal */}
      {selectedProduct && (
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
          conversationId={conversationId}
          onPaymentSuccess={(captureId, orderId) => {
            setMessages((prev) => [
              ...prev,
              {
                id: String(Date.now()),
                role: 'assistant',
                content: `🎉 **Payment Verified & Completed!**\n\n• **Order ID:** \`${orderId}\`\n• **PayPal Capture ID:** \`${captureId}\`\n• **Amount:** $${selectedProduct.price.toFixed(2)} USD\n\nYour transaction has been securely captured via the official PayPal Sandbox API and recorded in your PayPilot dashboard!`,
                activeAgent: 'payment_verify',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }}
        />
      )}
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="text-zinc-500 text-xs text-center py-20 font-mono">
          Loading PayPilot Assistant...
        </div>
      }
    >
      <AssistantContent />
    </Suspense>
  );
}
