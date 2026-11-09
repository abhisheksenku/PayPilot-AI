/**
 * PayPilot AI - Centralized Mock Data & Simulation Engine
 * 
 * MASTER TOGGLE:
 * Set USE_MOCK_DATA = true for 100% offline, lightning-fast UI development & demos.
 * Set USE_MOCK_DATA = false to seamlessly route all calls to the live Express/MySQL backend.
 */

export const USE_MOCK_DATA = true;

// Helper to simulate realistic network micro-delay for smooth UI feel
export const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/* =========================================================================
   1. MOCK HARDWARE CATALOG & CANDIDATES
   ========================================================================= */

export interface MockProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  inStock: boolean;
  imageUrl: string;
  source: string;
  specifications: {
    processor: string;
    gpu: string;
    gpuWattage?: string;
    ram: string;
    storage: string;
    display: string;
    battery: string;
    weight: string;
    os: string;
    benchmarks?: {
      cpuScore: number;
      gpuScore: number;
      overallScore: number;
    };
  };
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'prod-lenovo-loq-15',
    name: 'Lenovo LOQ 15 Gaming & ML Workstation',
    brand: 'Lenovo',
    category: 'laptop',
    price: 749.00,
    currency: 'USD',
    rating: 4.8,
    reviewsCount: 342,
    stock: 14,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    source: 'Channel3 Verified Catalog',
    specifications: {
      processor: 'AMD Ryzen 7 7435HS (8 Cores, 16 Threads, up to 4.5 GHz)',
      gpu: 'NVIDIA GeForce RTX 4060 (8GB GDDR6)',
      gpuWattage: '115W Maximum Graphics Power (TGP)',
      ram: '16GB DDR5-5600MHz (Expandable to 64GB)',
      storage: '512GB PCIe Gen4 NVMe M.2 SSD',
      display: '15.6" FHD (1920x1080) IPS 144Hz, 100% sRGB, 350 nits',
      battery: '60Wh with Super Rapid Charge Pro (80% in 30 min)',
      weight: '2.40 kg (5.29 lbs)',
      os: 'Windows 11 Home',
      benchmarks: {
        cpuScore: 92,
        gpuScore: 98,
        overallScore: 98,
      },
    },
  },
  {
    id: 'prod-acer-nitro-v15',
    name: 'Acer Nitro V 15 Dev Edition',
    brand: 'Acer',
    category: 'laptop',
    price: 699.00,
    currency: 'USD',
    rating: 4.5,
    reviewsCount: 189,
    stock: 8,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    source: 'Channel3 Verified Catalog',
    specifications: {
      processor: 'Intel Core i5-13420H (8 Cores, 12 Threads, up to 4.6 GHz)',
      gpu: 'NVIDIA GeForce RTX 4050 (6GB GDDR6)',
      gpuWattage: '75W Maximum Graphics Power (TGP)',
      ram: '16GB DDR5-5200MHz',
      storage: '512GB PCIe Gen4 NVMe SSD',
      display: '15.6" FHD (1920x1080) 144Hz IPS, 65% sRGB',
      battery: '57Wh Li-ion',
      weight: '2.10 kg (4.63 lbs)',
      os: 'Windows 11 Home',
      benchmarks: {
        cpuScore: 88,
        gpuScore: 86,
        overallScore: 91,
      },
    },
  },
  {
    id: 'prod-asus-tuf-a15',
    name: 'ASUS TUF Gaming A15 Endurance Edition',
    brand: 'ASUS',
    category: 'laptop',
    price: 799.00,
    currency: 'USD',
    rating: 4.6,
    reviewsCount: 276,
    stock: 5,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    source: 'Channel3 Verified Catalog',
    specifications: {
      processor: 'AMD Ryzen 5 7535HS (6 Cores, 12 Threads, up to 4.55 GHz)',
      gpu: 'NVIDIA GeForce RTX 4050 (6GB GDDR6)',
      gpuWattage: '90W Maximum Graphics Power (TGP)',
      ram: '16GB DDR5-4800MHz',
      storage: '1TB PCIe Gen4 NVMe SSD',
      display: '15.6" FHD 144Hz, Adaptive-Sync, 250 nits',
      battery: '90Wh Monster Battery (Up to 8.5 hrs coding)',
      weight: '2.20 kg (4.85 lbs)',
      os: 'Windows 11 Home',
      benchmarks: {
        cpuScore: 84,
        gpuScore: 88,
        overallScore: 89,
      },
    },
  },
  {
    id: 'prod-macbook-air-m3',
    name: 'Apple MacBook Air 15" M3',
    brand: 'Apple',
    category: 'laptop',
    price: 1249.00,
    currency: 'USD',
    rating: 4.9,
    reviewsCount: 812,
    stock: 22,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    source: 'Channel3 Verified Catalog',
    specifications: {
      processor: 'Apple M3 Chip (8-Core CPU with 4 performance & 4 efficiency)',
      gpu: '10-Core Integrated Apple GPU (Hardware ray tracing)',
      gpuWattage: '28W Unified Thermal Envelope',
      ram: '16GB Unified Memory (100GB/s bandwidth)',
      storage: '512GB High-Speed NVMe Unified SSD',
      display: '15.3" Liquid Retina 2880x1864, 500 nits, P3 Wide Color, True Tone',
      battery: '66.5Wh (Up to 18 hours battery life)',
      weight: '1.51 kg (3.3 lbs)',
      os: 'macOS Sonoma',
      benchmarks: {
        cpuScore: 96,
        gpuScore: 82,
        overallScore: 94,
      },
    },
  },
  {
    id: 'prod-dell-xps-14',
    name: 'Dell XPS 14 Developer Edition',
    brand: 'Dell',
    category: 'laptop',
    price: 1499.00,
    currency: 'USD',
    rating: 4.7,
    reviewsCount: 145,
    stock: 7,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    source: 'Channel3 Verified Catalog',
    specifications: {
      processor: 'Intel Core Ultra 7 155H with Intel AI Boost NPU',
      gpu: 'NVIDIA GeForce RTX 4050 (6GB GDDR6)',
      gpuWattage: '60W Maximum Graphics Power (TGP)',
      ram: '32GB LPDDR5x-7467MHz',
      storage: '1TB PCIe Gen4 SSD',
      display: '14.5" 3.2K (3200x2000) OLED Touch 120Hz, 100% DCI-P3',
      battery: '69.5Wh ExpressCharge Capable',
      weight: '1.68 kg (3.7 lbs)',
      os: 'Ubuntu 24.04 LTS / Windows 11 Pro',
      benchmarks: {
        cpuScore: 94,
        gpuScore: 85,
        overallScore: 92,
      },
    },
  },
  {
    id: 'prod-thinkpad-p14s',
    name: 'Lenovo ThinkPad P14s Gen 5 Workstation',
    brand: 'Lenovo',
    category: 'laptop',
    price: 1199.00,
    currency: 'USD',
    rating: 4.8,
    reviewsCount: 92,
    stock: 11,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
    source: 'Channel3 Verified Catalog',
    specifications: {
      processor: 'AMD Ryzen 7 PRO 8840HS (8C/16T with Ryzen AI NPU)',
      gpu: 'AMD Radeon 780M Graphics',
      gpuWattage: '35W Configurable TDP',
      ram: '32GB DDR5-5600MHz Non-ECC',
      storage: '1TB M.2 2280 PCIe Gen4 Performance NVMe',
      display: '14.5" 3K (3072x1920) IPS, 120Hz, 100% DCI-P3, 430 nits',
      battery: '75Wh Extended Battery',
      weight: '1.61 kg (3.55 lbs)',
      os: 'Windows 11 Pro / Fedora Certified',
      benchmarks: {
        cpuScore: 95,
        gpuScore: 78,
        overallScore: 90,
      },
    },
  },
];

/* =========================================================================
   2. MOCK MULTI-AGENT CHAT RESPONSES
   ========================================================================= */

export const MOCK_CHAT_SESSIONS = {
  defaultConversationId: 'conv-session-7891-hackathon',
  
  welcomeMessage: {
    id: 'msg-welcome',
    role: 'assistant' as const,
    activeAgent: 'supervisor',
    timestamp: 'Just now',
    content: `Welcome to **PayPilot AI**. I am your autonomous agentic shopping assistant built on official PayPal rails.

Describe your target hardware stack, budget, or workload in natural language (e.g., *"I need a laptop under ₹70,000 for programming, machine learning, and occasional gaming"*). 

My multi-agent swarm will evaluate candidate hardware, verify real-time specifications via Channel3, and prepare an immutable order with **mandatory human authorization** before any payment is initiated.`,
  },

  initialLaptopQueryResponse: {
    conversationId: 'conv-session-7891-hackathon',
    activeAgent: 'purchase',
    intent: 'hardware_procurement',
    agentResponse: `I analyzed your technical requirements and converted your budget of **₹70,000 INR** to **~$824 USD** at current real-time rates.

### 🧠 Swarm Evaluation Summary:
- **Supervisor Agent:** Classified intent as *Developer Hardware Procurement*. Flagged high-priority requirement for **CUDA tensor acceleration (NVIDIA GPU)** to support local ML/PyTorch workflows, paired with a minimum of **16GB high-bandwidth RAM**.
- **Shopping Research Agent:** Discovered 12 candidate models via the Channel3 verified catalog and filtered out under-powered 45W budget variants.
- **Product Analyst Agent:** Ranked the **Lenovo LOQ 15** at **98/100** as the undisputed winner. It is the only option in this tier featuring an **unrestricted 115W TGP RTX 4060 (8GB VRAM)** alongside 100% sRGB color calibration.
- **Purchase Agent & PayPal Guardrail:** Created a server-validated order draft (\`#ORD-2026-8842\`) locked strictly at **$749.00 USD** ($75 below your budget cap).

Execution is **halted at the Human-in-the-Loop checkpoint**. Click below to review the server price lock and authorize via official PayPal Sandbox buttons.`,
    requirements: {
      category: 'laptop',
      budget: 824,
      currency: 'USD',
      preferences: ['NVIDIA CUDA Acceleration', '16GB+ RAM', 'High TDP GPU', '144Hz+ Display'],
      useCase: 'Software development, Machine Learning (PyTorch/TensorFlow), and moderate gaming',
    },
    rankedProducts: [
      {
        productId: 'prod-lenovo-loq-15',
        name: 'Lenovo LOQ 15 Gaming & ML Workstation',
        price: 749.00,
        currency: 'USD',
        score: 98,
        rank: 1,
        strengths: [
          'Full-power 115W TGP RTX 4060 with 8GB dedicated VRAM & CUDA Tensor cores',
          'AMD Ryzen 7 7435HS (8 Cores, 16 Threads) for multi-threaded build compiles',
          '100% sRGB color-calibrated display with 144Hz refresh rate',
          'Dual M.2 Gen4 NVMe slots for future SSD expansion',
        ],
        tradeoffs: [
          'Chassis weight is 2.4kg — optimized for desktop workstation replacement',
          '60Wh battery yields ~3.5 hours on high compute loads',
        ],
        suitabilityReason:
          'Maximum possible ML/CUDA tensor throughput under $824 USD. 115W TGP RTX 4060 provides ~28% faster epoch training times than RTX 4050 alternatives.',
        imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
        specifications: {
          processor: 'AMD Ryzen 7 7435HS (8C/16T)',
          gpu: 'NVIDIA RTX 4060 8GB GDDR6 (115W TGP)',
          ram: '16GB DDR5-5600',
          storage: '512GB PCIe Gen4 NVMe',
          display: '15.6" FHD 144Hz 100% sRGB',
        },
      },
      {
        productId: 'prod-acer-nitro-v15',
        name: 'Acer Nitro V 15 Dev Edition',
        price: 699.00,
        currency: 'USD',
        score: 91,
        rank: 2,
        strengths: [
          '$50 cheaper than top pick ($125 under your ₹70k budget)',
          'Lightweight 2.1kg portable chassis',
          'Full Thunderbolt 4 external GPU / dock support',
        ],
        tradeoffs: [
          'RTX 4050 6GB VRAM restricts larger LLM batch sizes',
          'GPU capped at 75W TGP (lower compute ceiling)',
          'Display is 65% sRGB coverage',
        ],
        suitabilityReason:
          'Great value runner-up if budget preservation is prioritized, though 6GB VRAM is narrower for heavy neural network models.',
        imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
        specifications: {
          processor: 'Intel Core i5-13420H (8C/12T)',
          gpu: 'NVIDIA RTX 4050 6GB GDDR6 (75W TGP)',
          ram: '16GB DDR5-5200',
          storage: '512GB PCIe Gen4 NVMe',
          display: '15.6" FHD 144Hz IPS',
        },
      },
      {
        productId: 'prod-asus-tuf-a15',
        name: 'ASUS TUF Gaming A15 Endurance',
        price: 799.00,
        currency: 'USD',
        score: 89,
        rank: 3,
        strengths: [
          'Massive 90Wh battery (up to 8.5 hours coding off-grid)',
          '1TB PCIe NVMe SSD pre-installed',
          'MIL-STD-810H military-grade build durability',
        ],
        tradeoffs: [
          'RTX 4050 instead of 4060 graphics',
          'Display brightness limited to 250 nits',
        ],
        suitabilityReason:
          'Unmatched battery life and double the storage, but yields lower raw AI training compute compared to the Lenovo LOQ 15.',
        imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
        specifications: {
          processor: 'AMD Ryzen 5 7535HS (6C/12T)',
          gpu: 'NVIDIA RTX 4050 6GB GDDR6 (90W TGP)',
          ram: '16GB DDR5-4800',
          storage: '1TB PCIe Gen4 NVMe',
          display: '15.6" FHD 144Hz IPS',
        },
      },
    ],
    requiresApproval: true,
    draftOrderId: 'ORD-2026-8842',
    paypalOrderId: '5O190127TN364715T',
    approvalUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=5O190127TN364715T',
  },
};

/* =========================================================================
   3. MOCK EXECUTION AUDIT LOGS (SWARM REASONING TRACE)
   ========================================================================= */

export const MOCK_EXECUTION_LOGS = [
  {
    id: 'exec-101',
    conversationId: 'conv-session-7891-hackathon',
    toolName: 'SupervisorAgent::parseIntentAndBudget',
    status: 'SUCCESS',
    executionTime: 218,
    createdAt: '2026-11-09T05:58:12.110Z',
    input: { rawPrompt: 'I need a laptop under ₹70,000 for programming, machine learning and occasional gaming' },
    output: { category: 'laptop', parsedBudgetINR: 70000, targetUSD: 824.15, primaryUseCase: 'Machine Learning / Dev' },
  },
  {
    id: 'exec-102',
    conversationId: 'conv-session-7891-hackathon',
    toolName: 'ShoppingResearchAgent::queryChannel3Catalog',
    status: 'SUCCESS',
    executionTime: 412,
    createdAt: '2026-11-09T05:58:12.330Z',
    input: { category: 'laptop', maxPriceUSD: 824.15, minGpuTier: 'RTX_40_SERIES' },
    output: { candidatesFound: 12, returnedCount: 3, catalogSyncTimestamp: '2026-11-09T05:50:00Z' },
  },
  {
    id: 'exec-103',
    conversationId: 'conv-session-7891-hackathon',
    toolName: 'ProductAnalystAgent::calculateBenchmarkMatrix',
    status: 'SUCCESS',
    executionTime: 345,
    createdAt: '2026-11-09T05:58:12.750Z',
    input: { weights: { gpuCompute: 0.45, cpuCompile: 0.25, displayAccuracy: 0.15, thermalTgp: 0.15 } },
    output: { winner: 'prod-lenovo-loq-15', score: 98, runnerUpScore: 91, deltaPercentage: '+7.69%' },
  },
  {
    id: 'exec-104',
    conversationId: 'conv-session-7891-hackathon',
    toolName: 'PurchaseAgent::prepareServerLockedOrder',
    status: 'HALTED_AWAITING_USER_APPROVAL',
    executionTime: 189,
    createdAt: '2026-11-09T05:58:13.100Z',
    input: { productId: 'prod-lenovo-loq-15', lockedAmount: 749.00, currency: 'USD' },
    output: {
      draftOrderId: 'ORD-2026-8842',
      paypalOrderId: '5O190127TN364715T',
      antiTamperHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      governanceStatus: 'HUMAN_AUTHORIZATION_REQUIRED',
    },
  },
];

/* =========================================================================
   4. MOCK AG GRID DASHBOARD ORDERS & AUDIT TRAIL
   ========================================================================= */

export const MOCK_ORDERS = [
  {
    id: 'ord-8842-loq15',
    userId: 'usr-dev-abhi',
    productId: 'prod-lenovo-loq-15',
    quantity: 1,
    unitPrice: 749.00,
    totalAmount: 749.00,
    currency: 'USD',
    status: 'COMPLETED' as const,
    paypalOrderId: '5O190127TN364715T',
    paypalCaptureId: '8B340219UX492811A',
    createdAt: '2026-11-09T05:42:19.000Z',
    Product: MOCK_PRODUCTS[0],
  },
  {
    id: 'ord-8839-xps14',
    userId: 'usr-creator-sarah',
    productId: 'prod-dell-xps-14',
    quantity: 1,
    unitPrice: 1499.00,
    totalAmount: 1499.00,
    currency: 'USD',
    status: 'COMPLETED' as const,
    paypalOrderId: '9K448102PA991044C',
    paypalCaptureId: '1L908472BV219033P',
    createdAt: '2026-11-09T04:15:32.000Z',
    Product: MOCK_PRODUCTS[4],
  },
  {
    id: 'ord-8831-macm3',
    userId: 'usr-frontend-alex',
    productId: 'prod-macbook-air-m3',
    quantity: 1,
    unitPrice: 1249.00,
    totalAmount: 1249.00,
    currency: 'USD',
    status: 'COMPLETED' as const,
    paypalOrderId: '2F773918LA301988K',
    paypalCaptureId: '4H119022TC556109M',
    createdAt: '2026-11-08T22:30:10.000Z',
    Product: MOCK_PRODUCTS[3],
  },
  {
    id: 'ord-8825-tufa15',
    userId: 'usr-gamer-rahul',
    productId: 'prod-asus-tuf-a15',
    quantity: 1,
    unitPrice: 799.00,
    totalAmount: 799.00,
    currency: 'USD',
    status: 'AUTHORIZED' as const,
    paypalOrderId: '4M330194QR581290W',
    paypalCaptureId: 'PENDING_CAPTURE',
    createdAt: '2026-11-08T19:12:44.000Z',
    Product: MOCK_PRODUCTS[2],
  },
  {
    id: 'ord-8819-nitrov15',
    userId: 'usr-student-priya',
    productId: 'prod-acer-nitro-v15',
    quantity: 1,
    unitPrice: 699.00,
    totalAmount: 699.00,
    currency: 'USD',
    status: 'COMPLETED' as const,
    paypalOrderId: '7X198302LK491028D',
    paypalCaptureId: '3V449018NY772910R',
    createdAt: '2026-11-08T16:04:18.000Z',
    Product: MOCK_PRODUCTS[1],
  },
];
