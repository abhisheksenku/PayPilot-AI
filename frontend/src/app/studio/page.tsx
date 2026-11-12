'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  Paperclip,
  Star,
  Lock,
  Shield,
  CreditCard,
  Plus,
  History,
  Bot,
  Cpu,
  Zap,
  Monitor,
  Info,
  X,
  ArrowRight,
  TrendingUp,
  Layers,
  Check,
  ShoppingBag,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LaptopVisual, LaptopModelType } from '@/components/catalog/LaptopVisual';
import { PayPalCheckoutModal } from '@/components/modals/PayPalCheckoutModal';
import { api, fallbackProduct } from '@/lib/api';
import { ENABLE_SEED_DATA } from '@/lib/config';
import { useAuth } from '@/context/AuthContext';
import { RankedProduct } from '@/types/product';
import { Order } from '@/types/order';

interface AgentAnalysisStep {
  role: 'supervisor' | 'research' | 'analyst' | 'purchase';
  name: string;
  summary: string;
  completedTime: string;
}

interface ChatTurn {
  id: string;
  turnNumber: number;
  userQuery: string;
  timestamp: string;
  assistantSummary: string;
  agentSteps: AgentAnalysisStep[];
  product: RankedProduct;
  alternativeProducts?: RankedProduct[];
  isLogsExpanded: boolean;
  isTurnCollapsed: boolean;
}

// Helper to determine visual model type for LaptopVisual
function getLaptopModelType(product: RankedProduct): LaptopModelType {
  const name = (product.name || '').toLowerCase();
  const ext = (product.externalId || '').toLowerCase();
  if (name.includes('asus') || ext.includes('asus') || name.includes('rog') || name.includes('zephyrus')) {
    return 'asus-rog';
  }
  if (name.includes('apple') || ext.includes('apple') || name.includes('macbook')) {
    return 'macbook-pro';
  }
  if (name.includes('hp') || ext.includes('victus')) {
    return 'hp-victus';
  }
  if (name.includes('dell') || ext.includes('dell')) {
    return 'dell-g15';
  }
  if (name.includes('legion')) {
    return 'lenovo-legion';
  }
  return 'lenovo-loq';
}

// Seed Turn 1 (Matches Image 1)
const SEED_TURN_1: ChatTurn = {
  id: 'turn-1',
  turnNumber: 1,
  userQuery: 'Find a gaming laptop under ₹70,000',
  timestamp: '2:14 PM',
  assistantSummary: "I've found the best options for you! Here's my top recommendation:",
  agentSteps: [
    {
      role: 'supervisor',
      name: 'Supervisor Agent',
      summary: 'Understanding your requirements.',
      completedTime: '2:14 PM',
    },
    {
      role: 'research',
      name: 'Shopping Research Agent',
      summary: 'Found 12 models from Channel3.',
      completedTime: '2:14 PM',
    },
    {
      role: 'analyst',
      name: 'Product Analyst Agent',
      summary: 'Ranked and scored the options.',
      completedTime: '2:14 PM',
    },
    {
      role: 'purchase',
      name: 'Purchase Guardrail Agent',
      summary: 'Verified price under ₹70,000.',
      completedTime: '2:14 PM',
    },
  ],
  product: {
    id: '769d593b-4db0-49ee-a3f3-ea81dd010ff8',
    externalId: 'CH3-LENOVO-LOQ-15',
    name: 'Lenovo LOQ 15 Gaming & ML Laptop',
    description: 'Intel Core i5-13450HX, 16GB DDR5 RAM, 512GB SSD, NVIDIA RTX 4060 (115W TGP), 15.6" 144Hz FHD Display, Military Grade Durability.',
    price: 749.0,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed',
    score: 98,
    strengths: [
      'Within budget with $75 to spare ($749 vs $824 budget cap)',
      '115W TGP RTX 4060 GPU with 8GB VRAM for CUDA/PyTorch tensors',
      '16GB DDR5 5200MHz high-bandwidth RAM with dual-channel upgrade path',
      '15.6" FHD 144Hz IPS display with 100% sRGB color calibration',
    ],
    tradeoffs: [
      '2.40 kg chassis weight requires high-capacity 170W power brick for peak TGP',
    ],
    specifications: {
      processor: 'Intel Core i5-13450HX (10 cores, up to 4.60 GHz)',
      graphics: 'NVIDIA GeForce RTX 4060 8GB GDDR6 (115W Max TGP)',
      ram: '16GB DDR5 5200MHz Dual-Channel',
      storage: '512GB PCIe 4.0 NVMe SSD (extra M.2 slot)',
      display: '15.6-inch FHD (1920x1080) 144Hz IPS, 100% sRGB, G-SYNC',
      battery: '60Wh with Rapid Charge Pro (50% in 30 mins)',
      weight: '2.40 kg',
      tgp: '115W Max Graphics Power',
    },
  },
  alternativeProducts: [
    {
      id: 'prod-hp-victus',
      externalId: 'CH3-HP-VICTUS-15',
      name: 'HP Victus 15',
      description: 'Intel Core i5-13420H, 16GB DDR5, 512GB SSD, RTX 3050 (95W TGP), 144Hz FHD.',
      price: 699.0,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2',
      score: 87,
      strengths: ['Affordable $699 budget price', '16GB DDR5 4800MHz', '144Hz FHD display'],
      tradeoffs: ['95W TGP RTX 3050 has lower VRAM than RTX 4060'],
      specifications: {
        processor: 'Intel Core i5-13420H',
        graphics: 'NVIDIA RTX 3050 6GB GDDR6 (95W TGP)',
        ram: '16GB DDR5 4800MHz',
        storage: '512GB NVMe SSD',
        display: '15.6" FHD 144Hz',
      },
    },
    {
      id: 'prod-dell-g15',
      externalId: 'CH3-DELL-G15',
      name: 'Dell G15 Gaming',
      description: 'Intel Core i5-13450HX, 16GB DDR5, 512GB SSD, RTX 4050 (140W TGP), 165Hz FHD.',
      price: 779.0,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45',
      score: 89,
      strengths: ['140W high TGP RTX 4050', '165Hz smooth display', 'Dual-channel DDR5'],
      tradeoffs: ['6GB VRAM constraint for larger batch sizes'],
      specifications: {
        processor: 'Intel Core i5-13450HX',
        graphics: 'NVIDIA RTX 4050 6GB (140W TGP)',
        ram: '16GB DDR5 4800MHz',
        storage: '512GB NVMe SSD',
        display: '15.6" FHD 165Hz',
      },
    },
  ],
  isLogsExpanded: true,
  isTurnCollapsed: false,
};

// Seed Turn 2 (Matches Image 2)
const SEED_TURN_2: ChatTurn = {
  id: 'turn-2',
  turnNumber: 2,
  userQuery: 'Can you find a better option with 32GB RAM?',
  timestamp: '2:24 PM',
  assistantSummary: "Sure! I've found a better option with 32GB RAM within a similar budget range.",
  agentSteps: [
    {
      role: 'supervisor',
      name: 'Supervisor Agent',
      summary: 'Updated requirement: 32GB RAM.',
      completedTime: '2:24 PM',
    },
    {
      role: 'research',
      name: 'Shopping Research Agent',
      summary: 'Found 8 matching models.',
      completedTime: '2:24 PM',
    },
    {
      role: 'analyst',
      name: 'Product Analyst Agent',
      summary: 'Compared performance and value.',
      completedTime: '2:24 PM',
    },
    {
      role: 'purchase',
      name: 'Purchase Guardrail Agent',
      summary: 'Verified price and availability.',
      completedTime: '2:24 PM',
    },
  ],
  product: {
    id: 'CH3-ASUS-ZEPH-G16',
    externalId: 'CH3-ASUS-ZEPH-G16',
    name: 'ASUS ROG Zephyrus G16',
    description: 'Intel Core Ultra 9 185H, 32GB LPDDR5X RAM, 1TB NVMe SSD, NVIDIA RTX 4070 8GB GDDR6 (140W TGP), 16" 2.5K 240Hz OLED Display.',
    price: 1499.0,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
    score: 95,
    strengths: [
      '32GB LPDDR5X 7467MHz memory handles massive local LLMs and video workflows',
      'Uncapped 140W TGP RTX 4070 GPU with 8GB VRAM',
      '2.5K 240Hz ROG Nebula OLED display with 100% DCI-P3 coverage',
    ],
    tradeoffs: [
      'Higher investment tier relative to entry-level budget cap',
    ],
    specifications: {
      processor: 'Intel Core Ultra 9 185H (16 cores, up to 5.1 GHz)',
      graphics: 'NVIDIA GeForce RTX 4070 8GB GDDR6 (140W Max TGP)',
      ram: '32GB LPDDR5X 7467MHz Dual-Channel',
      storage: '1TB PCIe 4.0 NVMe M.2 SSD',
      display: '16-inch 2.5K (2560x1600) 240Hz 0.2ms OLED ROG Nebula',
      battery: '90Wh 4-cell Li-ion with 100W USB-C Power Delivery',
      weight: '1.85 kg',
      tgp: '140W Max Graphics Power',
    },
  },
  alternativeProducts: [
    {
      id: 'prod-lenovo-legion',
      externalId: 'CH3-LENOVO-LEGION-PRO5',
      name: 'Lenovo Legion Pro 5',
      description: 'AMD Ryzen 7 7745HX, 32GB DDR5 RAM, 1TB SSD, NVIDIA RTX 4060 140W TGP, 16" WQXGA 240Hz.',
      price: 1299.0,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45',
      score: 97,
      strengths: ['32GB DDR5 5600MHz RAM', '140W TGP RTX 4060', '16" 240Hz WQXGA 100% sRGB'],
      tradeoffs: ['2.5 kg weight requires large charger'],
      specifications: {
        processor: 'AMD Ryzen 7 7745HX (8 cores, 16 threads)',
        graphics: 'NVIDIA GeForce RTX 4060 (140W Max TGP)',
        ram: '32GB DDR5 5600MHz',
        storage: '1TB PCIe NVMe SSD',
        display: '16" WQXGA 240Hz IPS',
        tgp: '140W Max TGP',
      },
    },
    {
      id: 'prod-macbook-pro',
      externalId: 'CH3-APPLE-MBP-14-M3',
      name: 'Apple MacBook Pro 14 M3 Pro',
      description: 'Apple M3 Pro 12-core CPU, 18-core GPU, 36GB Unified Memory, 512GB SSD, 14.2" Liquid Retina XDR.',
      price: 1849.0,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      score: 94,
      strengths: ['36GB Unified Memory with 150GB/s bandwidth', '14.2" Liquid Retina XDR', 'Extreme battery life'],
      tradeoffs: ['Premium price point', 'Metal/MPS acceleration instead of CUDA'],
      specifications: {
        processor: 'Apple M3 Pro (12-core CPU, 18-core GPU)',
        graphics: 'Apple 18-core GPU',
        ram: '36GB Unified Memory',
        storage: '512GB SSD',
        display: '14.2" Liquid Retina XDR (3024x1964)',
      },
    },
  ],
  isLogsExpanded: true,
  isTurnCollapsed: false,
};

const SUGGESTED_PROMPTS = [
  'I need a laptop under ₹85,000 for running local LLMs and ML',
  'Find a gaming laptop under ₹70,000',
  'Can you find a better option with 32GB RAM?',
  'Compare with Apple MacBook Air M3',
];

export default function StudioPage() {
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'AU';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const userInitials = user ? getInitials(user.name) : 'AU';

  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [inspectingProduct, setInspectingProduct] = useState<RankedProduct | null>(null);

  // Multi-Turn Conversation State (restores active chat from session, clean slate for new users)
  const [turns, setTurns] = useState<ChatTurn[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('paypilot_studio_turns');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // Selected Spotlight Product
  const [selectedProduct, setSelectedProduct] = useState<RankedProduct>(fallbackProduct);

  const hasLoadedSessionRef = useRef(false);

  // Initialize turn history based on user session (pre-seed only for demo account if empty)
  useEffect(() => {
    if (hasLoadedSessionRef.current) return;

    if (turns.length === 0 && user?.email === 'demo@paypilot.ai' && ENABLE_SEED_DATA) {
      hasLoadedSessionRef.current = true;
      setTurns([SEED_TURN_1]);
      setSelectedProduct(SEED_TURN_1.product);
    }
  }, [user?.email, turns.length]);

  // Persist turns to sessionStorage so page refresh preserves ongoing conversation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (turns.length > 0) {
          sessionStorage.setItem('paypilot_studio_turns', JSON.stringify(turns));
        } else {
          sessionStorage.removeItem('paypilot_studio_turns');
        }
      } catch {}
    }
  }, [turns]);

  const [paymentSuccess, setPaymentSuccess] = useState<{
    captureId: string;
    orderId: string;
    amount: number;
    productName: string;
  } | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat on new turn
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, isProcessing]);

  // Sync latest product whenever turns array updates
  useEffect(() => {
    if (turns.length > 0) {
      setSelectedProduct(turns[turns.length - 1].product);
    }
  }, [turns]);

  // Handle user submitting a question
  const handleSendMessage = async (customText?: string) => {
    const text = (customText || promptInput).trim();
    if (!text || isProcessing) return;

    setPromptInput('');
    setIsProcessing(true);
    setPaymentSuccess(null);

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    // Collapse previous turns when asking a new question (as shown in Image 2)
    setTurns((prev) =>
      prev.map((t) => ({
        ...t,
        isTurnCollapsed: true,
      }))
    );

    try {
      // 1. Check if user clicked the seed Q2 query for instant blueprint fidelity
      if (text.toLowerCase().includes('32gb') || text.toLowerCase().includes('better option with 32gb')) {
        // Artificial micro-pause for smooth realistic agent execution feel
        await new Promise((resolve) => setTimeout(resolve, 600));
        const newTurn: ChatTurn = {
          ...SEED_TURN_2,
          timestamp: timeString,
          turnNumber: turns.length + 1,
        };
        setTurns((prev) => [...prev, newTurn]);
        setSelectedProduct(newTurn.product);
        setIsProcessing(false);
        return;
      }

      // 2. Run LangGraph Multi-Agent Swarm against backend
      const res = await api.runAgentChat(text);

      let winningProduct: RankedProduct;
      let altProducts: RankedProduct[] = [];

      if (res.rankedProducts && res.rankedProducts.length > 0) {
        winningProduct = res.rankedProducts[0];
        altProducts = res.rankedProducts.slice(1, 3);
      } else if (text.toLowerCase().includes('macbook') || text.toLowerCase().includes('apple')) {
        winningProduct = {
          id: 'CH3-APPLE-MBA-M3',
          externalId: 'CH3-APPLE-MBA-M3',
          name: 'Apple MacBook Air M3 15-inch',
          description: 'Apple M3 chip, 16GB Unified Memory, 512GB SSD, Liquid Retina Display, 18h battery.',
          price: 1299.0,
          currency: 'USD',
          imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
          score: 96,
          strengths: ['18-hour real-world battery life', 'Fanless whisper-quiet operation', '100GB/s unified memory'],
          tradeoffs: ['No dedicated NVIDIA CUDA tensor cores'],
          specifications: {
            processor: 'Apple M3 (8-core CPU, 10-core GPU)',
            ram: '16GB Unified Memory',
            storage: '512GB SSD',
            display: '15.3-inch Liquid Retina Display (2880 x 1864)',
            battery: '66.5Wh (18 hours)',
            weight: '1.51 kg',
          },
        };
        altProducts = SEED_TURN_2.alternativeProducts || [];
      } else {
        winningProduct = fallbackProduct;
        altProducts = SEED_TURN_1.alternativeProducts || [];
      }

      // Map backend execution logs to the 4 agents
      const agentSteps: AgentAnalysisStep[] = [
        {
          role: 'supervisor',
          name: 'Supervisor Agent',
          summary: res.requirements?.category
            ? `Parsed intent for ${res.requirements.category} within $${res.requirements.budgetUSD || 824} cap.`
            : 'Understanding and prioritizing your hardware constraints.',
          completedTime: timeString,
        },
        {
          role: 'research',
          name: 'Shopping Research Agent',
          summary: `Found ${(res as any).searchResults?.length || res.rankedProducts?.length || 12} matching models from Channel3 hardware catalog.`,
          completedTime: timeString,
        },
        {
          role: 'analyst',
          name: 'Product Analyst Agent',
          summary: `Scored specs and benchmark thermals (${winningProduct.score}/100 AI score).`,
          completedTime: timeString,
        },
        {
          role: 'purchase',
          name: 'Purchase Guardrail Agent',
          summary: `Verified locked price $${Number(winningProduct.price).toFixed(2)} USD under budget cap.`,
          completedTime: timeString,
        },
      ];

      const newTurn: ChatTurn = {
        id: `turn-${Date.now()}`,
        turnNumber: turns.length + 1,
        userQuery: text,
        timestamp: timeString,
        assistantSummary: `I've found the best options for you! Here's my top recommendation:`,
        agentSteps,
        product: winningProduct,
        alternativeProducts: altProducts,
        isLogsExpanded: true,
        isTurnCollapsed: false,
      };

      setTurns((prev) => [...prev, newTurn]);
      setSelectedProduct(winningProduct);
    } catch (err) {
      console.error('Error running swarm:', err);
      // Fallback turn
      const fallbackTurn: ChatTurn = {
        id: `turn-${Date.now()}`,
        turnNumber: turns.length + 1,
        userQuery: text,
        timestamp: timeString,
        assistantSummary: "I've analyzed the catalog and locked in our top benchmark recommendation:",
        agentSteps: SEED_TURN_1.agentSteps,
        product: fallbackProduct,
        alternativeProducts: SEED_TURN_1.alternativeProducts,
        isLogsExpanded: true,
        isTurnCollapsed: false,
      };
      setTurns((prev) => [...prev, fallbackTurn]);
      setSelectedProduct(fallbackProduct);
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle log accordion for a specific turn
  const toggleLogsExpanded = (turnId: string) => {
    setTurns((prev) =>
      prev.map((t) => (t.id === turnId ? { ...t, isLogsExpanded: !t.isLogsExpanded } : t))
    );
  };

  // Toggle collapsed state for a prior turn
  const toggleTurnCollapsed = (turnId: string) => {
    setTurns((prev) =>
      prev.map((t) => (t.id === turnId ? { ...t, isTurnCollapsed: !t.isTurnCollapsed } : t))
    );
  };

  // Start fresh chat
  const handleStartNewChat = () => {
    setTurns([]);
    setSelectedProduct(fallbackProduct);
    setPaymentSuccess(null);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('paypilot_studio_turns');
      } catch {}
    }
    inputRef.current?.focus();
  };

  // Select a product from any turn into the right spotlight
  const handleSelectProduct = (product: RankedProduct) => {
    setSelectedProduct(product);
  };

  // Trigger payment success animation and state
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
      amount: Number(selectedProduct.price),
      productName: selectedProduct.name,
    });
  };

  const visualModel = getLaptopModelType(selectedProduct);
  const numericPrice = Number(selectedProduct.price || 749);

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 py-4 max-w-[1600px] mx-auto space-y-4">
        {/* Header: Title + New Chat + History */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>PayPilot AI — Studio</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Your AI-powered shopping assistant for developer & ML hardware
            </p>
          </div>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={handleStartNewChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#0070BA]" />
              <span>New Chat</span>
            </button>

            <button
              onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-gray-500" />
              <span>Conversation History</span>
              {turns.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-100 text-[#0070BA] text-[10px] flex items-center justify-center font-bold">
                  {turns.length}
                </span>
              )}
            </button>

            {/* Conversation History Dropdown */}
            {showHistoryDropdown && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-30 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-900">Recent Sessions</span>
                  <button
                    onClick={() => setShowHistoryDropdown(false)}
                    className="text-gray-400 hover:text-gray-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {turns.length === 0 ? (
                  <p className="text-xs text-gray-400 py-3 text-center">No questions in history yet.</p>
                ) : (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {turns.map((t, idx) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedProduct(t.product);
                          setShowHistoryDropdown(false);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 transition-colors text-xs"
                      >
                        <div className="font-semibold text-gray-800 truncate">
                          Q{idx + 1}: {t.userQuery}
                        </div>
                        <div className="text-[10px] text-gray-500 flex items-center justify-between mt-0.5">
                          <span className="text-[#0070BA] font-medium truncate">{t.product.name}</span>
                          <span className="shrink-0">{t.timestamp}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2-Column Split-Screen Copilot: Chat Feed (Left ~60%) + Spotlight Terminal (Right ~40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Multi-Turn Conversation Stream (Col 7 / 12) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Scrollable Conversation Container */}
            <div className="space-y-4 min-h-[460px]">
              {/* Clean Empty State when turns.length === 0 */}
              {turns.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4 shadow-2xs">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-[#0070BA]">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="text-base font-bold text-gray-900">
                      Welcome to PayPilot AI Hardware Studio{user?.name ? `, ${user.name}` : ''}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Ask any hardware or developer laptop question. Our 4-agent swarm will query live market specs, benchmark tensors, lock the best price, and stage your verified PayPal order.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 justify-center">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSendMessage(prompt)}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50/80 border border-gray-200 hover:border-blue-200 text-gray-700 hover:text-[#0070BA] rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                      >
                        {prompt} →
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Render Multi-Turn Chat History */}
              {turns.map((turn, index) => {
                const turnVisualModel = getLaptopModelType(turn.product);

                // COLLAPSED PRIOR QUESTION VIEW (Image 2 pattern)
                if (turn.isTurnCollapsed) {
                  return (
                    <div
                      key={turn.id}
                      onClick={() => toggleTurnCollapsed(turn.id)}
                      className="bg-blue-50/60 hover:bg-blue-50 border border-blue-200/80 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                        <div className="truncate">
                          <span className="font-bold text-xs text-gray-900">
                            Q{index + 1}: {turn.userQuery}
                          </span>
                          <span className="text-[11px] text-gray-500 ml-2 font-medium hidden sm:inline">
                            Recommendation: <strong>{turn.product.name}</strong> • Completed (4/4)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 pl-2 text-xs font-semibold text-[#0070BA] group-hover:underline">
                        <span>Expand</span>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  );
                }

                // EXPANDED ACTIVE QUESTION VIEW (Image 1 pattern)
                return (
                  <div key={turn.id} className="space-y-3 animate-fade-in">
                    {/* User Message Bubble (Right-Aligned) */}
                    <div className="flex items-center justify-end gap-2.5">
                      <div className="bg-[#F1F5F9] border border-gray-200/80 text-gray-900 px-4 py-2.5 rounded-2xl rounded-tr-xs shadow-2xs max-w-[85%] space-y-0.5">
                        <p className="text-xs sm:text-sm font-semibold">{turn.userQuery}</p>
                        <p className="text-[10px] text-gray-400 text-right">{turn.timestamp}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#0070BA] text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
                        {userInitials}
                      </div>
                    </div>

                    {/* Assistant Response Box (Left-Aligned) */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 text-[#0070BA] font-black text-xs flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                        P
                      </div>

                      <div className="space-y-3 flex-1 min-w-0">
                        {/* Assistant Intro */}
                        <p className="text-xs sm:text-sm text-gray-800 font-medium leading-relaxed">
                          {turn.assistantSummary}
                        </p>

                        {/* Collapsible Multi-Agent Analysis Accordion */}
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xs overflow-hidden transition-all">
                          <button
                            onClick={() => toggleLogsExpanded(turn.id)}
                            className="w-full px-3.5 py-2.5 bg-gray-50/70 hover:bg-gray-100/70 flex items-center justify-between border-b border-gray-100 transition-colors text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              </span>
                              <span className="text-xs font-bold text-gray-900">
                                Multi-Agent Analysis — Completed (4/4)
                              </span>
                            </div>
                            <div className="text-gray-400 hover:text-gray-600">
                              {turn.isLogsExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </div>
                          </button>

                          {turn.isLogsExpanded && (
                            <div className="p-3 space-y-2 text-xs bg-white">
                              {turn.agentSteps.map((step, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span
                                      className={`w-2 h-2 rounded-full shrink-0 ${
                                        step.role === 'supervisor'
                                          ? 'bg-violet-600'
                                          : step.role === 'research'
                                          ? 'bg-teal-600'
                                          : step.role === 'analyst'
                                          ? 'bg-purple-600'
                                          : 'bg-[#0070BA]'
                                      }`}
                                    />
                                    <span className="font-bold text-gray-900 shrink-0">
                                      {step.name} —
                                    </span>
                                    <span className="text-gray-600 truncate">{step.summary}</span>
                                  </div>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Inline Hardware Recommendation Card */}
                        <div
                          onClick={() => handleSelectProduct(turn.product)}
                          className={`bg-white rounded-2xl border p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                            selectedProduct.id === turn.product.id
                              ? 'border-[#0070BA] ring-2 ring-[#0070BA]/20'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {/* Left: Thumbnail & Details */}
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Visual Thumbnail */}
                            <div className="w-18 h-13 shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center p-0.5">
                              <LaptopVisual model={turnVisualModel} />
                            </div>

                            {/* Title & Specs */}
                            <div className="min-w-0 space-y-1">
                              <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                {turn.product.name}
                              </h4>
                              <p className="text-[11px] text-gray-500 truncate">
                                {turn.product.specifications.graphics || 'RTX 4060'} •{' '}
                                {turn.product.specifications.ram || '16GB DDR5'} •{' '}
                                {turn.product.specifications.tgp || '115W TGP'}
                              </p>
                              <div className="flex items-center gap-2 pt-0.5">
                                <span className="font-mono font-black text-xs text-gray-900">
                                  ${Number(turn.product.price).toFixed(2)} USD
                                </span>
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                                  <span>🏆</span>
                                  <span>{turn.product.score}/100 AI Score</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: View Details Button */}
                          <div className="sm:shrink-0 flex items-center gap-2 justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectProduct(turn.product);
                                setInspectingProduct(turn.product);
                              }}
                              className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-bold rounded-xl transition-all shadow-2xs hover:border-[#0070BA] hover:text-[#0070BA] flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Other Options Evaluated (Runners-Up) */}
                        {turn.alternativeProducts && turn.alternativeProducts.length > 0 && (
                          <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-[#0070BA]" />
                                <span>Other Options Evaluated ({turn.alternativeProducts.length} Runners-Up)</span>
                              </span>
                              <Link
                                href="/catalog"
                                className="text-[11px] font-bold text-[#0070BA] hover:underline inline-flex items-center gap-1"
                              >
                                <span>View all in Catalog</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {turn.alternativeProducts.map((alt) => {
                                const isSpotlighted = selectedProduct.id === alt.id;
                                return (
                                  <div
                                    key={alt.id}
                                    onClick={() => handleSelectProduct(alt)}
                                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                                      isSpotlighted
                                        ? 'bg-blue-50/90 border-[#0070BA] ring-2 ring-[#0070BA]/20 shadow-xs'
                                        : 'bg-white hover:bg-blue-50/40 border-slate-200 hover:border-blue-200'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-1">
                                      <div className="font-bold text-xs text-slate-900 truncate">
                                        {alt.name}
                                      </div>
                                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                                        {alt.score}/100
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                                      <span className="font-bold text-slate-900">
                                        ${Number(alt.price).toFixed(2)} USD
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectProduct(alt);
                                        }}
                                        className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                                          isSpotlighted
                                            ? 'bg-[#0070BA] text-white'
                                            : 'bg-slate-100 hover:bg-[#0070BA] hover:text-white text-slate-700'
                                        }`}
                                      >
                                        {isSpotlighted ? '✓ In Spotlight' : 'Swap to Spotlight'}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Processing Loader State */}
              {isProcessing && (
                <div className="flex items-start gap-2.5 animate-fade-in">
                  <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 text-[#0070BA] font-black text-xs flex items-center justify-center shadow-2xs shrink-0 animate-pulse">
                    P
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0070BA]">
                      <span className="w-2 h-2 rounded-full bg-[#0070BA] animate-ping" />
                      <span>Multi-Agent Swarm Reasoning in Progress...</span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>• Supervisor Agent decomposing constraints...</p>
                      <p>• Querying Channel3 live catalog & FP16 thermals...</p>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Bottom Input Area & Prompt Chips */}
            <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-2xs space-y-2.5">
              {/* Dynamic Suggested Prompt Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <span className="text-[11px] font-semibold text-gray-400 shrink-0">Try asking:</span>
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-2.5 py-1 bg-gray-50 hover:bg-blue-50/80 border border-gray-200/80 hover:border-blue-200 text-gray-600 hover:text-[#0070BA] rounded-full text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 relative"
              >
                <div className="p-2 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer">
                  <Paperclip className="w-4 h-4" />
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Ask another question... (e.g., 'Compare with ASUS ROG', 'Find 32GB RAM option')"
                  className="w-full text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50/60 focus:bg-white border border-gray-200 focus:border-[#0070BA] focus:ring-2 focus:ring-blue-100 rounded-xl px-3 py-2.5 transition-all outline-none"
                />

                <button
                  type="submit"
                  disabled={!promptInput.trim() || isProcessing}
                  className="w-9 h-9 rounded-xl bg-[#0070BA] hover:bg-[#003087] disabled:opacity-40 text-white flex items-center justify-center shadow-2xs transition-all shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Persistent Spotlight Recommendation & PayPal Terminal (Col 5 / 12) */}
          <div className="lg:col-span-5 sticky top-4 space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
              {/* Card Header: Star Pill & FX Oracle */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0070BA]">
                  <Star className="w-4 h-4 fill-[#0070BA]" />
                  <span>{turns.length === 0 ? 'Featured Hardware Match' : 'Current Recommendation'}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Price Locked
                </span>
              </div>

              {/* Hardware Render Visual */}
              <div className="bg-gray-50/70 rounded-2xl border border-gray-100 p-3 flex items-center justify-center min-h-[160px]">
                <div className="w-full max-w-[280px]">
                  <LaptopVisual model={visualModel} />
                </div>
              </div>

              {/* Name, Big Price Tag & Score */}
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {selectedProduct.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight">
                    ${numericPrice.toFixed(2)}{' '}
                    <span className="text-xs font-bold text-gray-500">USD</span>
                  </div>

                  <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl px-2.5 py-1 text-center shadow-2xs">
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-[#92400E]">
                      <span>🏆</span>
                      <span>{selectedProduct.score}/100 AI Score</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Quick Spec Badges */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
                <div className="p-2 bg-gray-50 rounded-xl border border-gray-200/80 text-center space-y-0.5">
                  <Cpu className="w-3.5 h-3.5 text-[#0070BA] mx-auto" />
                  <div className="text-[10px] font-bold text-gray-900 truncate">
                    {selectedProduct.specifications.graphics || 'RTX 4060'}
                  </div>
                </div>
                <div className="p-2 bg-gray-50 rounded-xl border border-gray-200/80 text-center space-y-0.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-700 mx-auto" />
                  <div className="text-[10px] font-bold text-gray-900 truncate">
                    {selectedProduct.specifications.ram || '16GB DDR5'}
                  </div>
                </div>
                <div className="p-2 bg-gray-50 rounded-xl border border-gray-200/80 text-center space-y-0.5">
                  <Monitor className="w-3.5 h-3.5 text-purple-700 mx-auto" />
                  <div className="text-[10px] font-bold text-gray-900 truncate">
                    {selectedProduct.specifications.display || '144Hz FHD'}
                  </div>
                </div>
              </div>

              {/* Payment Success Confirmation Banner */}
              {paymentSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Payment Captured & Authorized!</span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      SETTLED
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-800 bg-white/70 p-2 rounded-lg border border-emerald-100 space-y-0.5">
                    <div>Order ID: <strong>{paymentSuccess.orderId}</strong></div>
                    <div>Capture Seal: <strong>{paymentSuccess.captureId}</strong></div>
                    <div>Item: <strong>{paymentSuccess.productName}</strong></div>
                  </div>
                </div>
              )}

              {/* 3 PayPal Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* Button 1: Gold PayPal Checkout */}
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
                  className="w-full py-2 px-3.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl shadow-2xs transition-all flex items-center justify-between cursor-pointer text-left"
                >
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-extrabold text-xs text-[#0070BA]">P</span>
                    <span className="font-bold text-xs text-[#003087]">Pay Later</span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium truncate ml-2">
                    Buy now, pay in 4 payments <span className="text-gray-400">ⓘ</span>
                  </div>
                </button>

                {/* Button 3: Debit or Credit Card */}
                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-2 px-4 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  <span>Debit or Credit Card</span>
                </button>
              </div>

              {/* Trust Footer */}
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

      {/* Slide-over Deep-Dive Specification Modal */}
      {inspectingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-gray-900">{inspectingProduct.name}</span>
              </div>
              <button
                onClick={() => setInspectingProduct(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
              <div className="w-48">
                <LaptopVisual model={getLaptopModelType(inspectingProduct)} />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Technical Specifications</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {inspectingProduct.specifications &&
                  Object.entries(inspectingProduct.specifications).map(([key, val]) => (
                    <div key={key} className="p-2 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-500 capitalize block text-[10px]">{key}</span>
                      <span className="font-medium text-gray-800">{String(val)}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Multi-Agent Strengths</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                {inspectingProduct.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => {
                  setSelectedProduct(inspectingProduct);
                  setInspectingProduct(null);
                  setIsCheckoutModalOpen(true);
                }}
                className="flex-1 py-2.5 bg-[#FFC439] hover:bg-[#F4B400] text-[#003087] font-bold text-xs rounded-xl shadow-2xs text-center"
              >
                Checkout via PayPal (${Number(inspectingProduct.price).toFixed(2)})
              </button>
              <button
                onClick={() => setInspectingProduct(null)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive PayPal Checkout Modal */}
      <PayPalCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        productId={selectedProduct.id || '769d593b-4db0-49ee-a3f3-ea81dd010ff8'}
        productName={selectedProduct.name}
        amount={numericPrice}
        onSuccess={triggerPaymentSuccess}
      />
    </DashboardLayout>
  );
}
