# 🚀 PayPilot AI

> **Autonomous AI-Powered Agentic Commerce Platform on Official PayPal Rails**  
> *Built for the **PayPal AI Hackathon 2026** — Agentic Commerce Track*  
> 🔗 **GitHub Repository:** [https://github.com/abhisheksenku/PayPilot-AI](https://github.com/abhisheksenku/PayPilot-AI)

PayPilot AI transforms modern ecommerce through an autonomous multi-agent system governed by **strict human-in-the-loop authorization**. Instead of browsing dozens of online storefronts and deciphering complex spec sheets, users describe their computing requirements, use cases, and budget in natural language. A coordinated swarm of AI agents discovers genuine hardware via Channel3, evaluates technical specifications (GPU TGP wattage, CPU multithreading), ranks top options, drafts orders, and halts for user authorization before capturing payments securely via official **PayPal Sandbox Orders v2 & Captures v2 APIs**.

---

## 🏆 Hackathon Alignment & Judging Criteria

| Objective | How PayPilot AI Delivers |
| :--- | :--- |
| **1. Meaningful AI (Beyond Chatbots)** | A deterministic multi-agent state machine (Supervisor, Research, Analyst, Purchase nodes) that extracts technical constraints, performs real-time currency conversions (₹70,000 $\to$ ~$824 USD), and runs multi-attribute benchmark formulas. |
| **2. Meaningful PayPal Integration** | Integrated with official **PayPal REST APIs v2** (`/v2/checkout/orders` & `/v2/payments/captures`) and the official `@paypal/react-paypal-js` SDK, returning verified PayPal Capture IDs (`8B...`) and Order IDs (`5O...`). |
| **3. Real-World Problem Solved** | Eliminates the 4-hour technical ordeal of researching hardware specs, thermal throttling, and misleading GPU wattages across retail sites, reducing it to a 30-second conversational purchase. |
| **4. Working End-to-End Product** | Full-stack monorepo with 7 interactive pages, MySQL 9.3 schema (8 relational tables), and a **Dual-Mode Engine** (`USE_MOCK_DATA`) for 100% resilient judging demos. |
| **5. Innovation & Financial Governance** | Solves the core dilemma of Agentic Commerce via the **Mandatory Human-in-the-Loop Checkpoint**: agents have full autonomy to prepare and evaluate, but zero authority to charge funds without user biometric/credential approval. |

---

## 🏗️ Multi-Agent Architecture & Flow

```
User Prompt (e.g. "I need a laptop under ₹70,000 for ML and gaming")
                          │
                          ▼
             [Node 1: Memory Agent]
             (Retrieves multi-turn session context)
                          │
                          ▼
            [Node 2: Supervisor Agent (Gemini)]
   (Extracts: category="laptop", budget=$824 USD, useCase="ML & gaming")
                          │
                          ▼
        [Node 3: Shopping Research Agent (Channel3)]
       (Retrieves real candidate hardware specifications)
                          │
                          ▼
        [Node 4: Product Analyst Agent (Gemini)]
      (Scores candidates: Lenovo LOQ 15 -> 98/100 Top Pick)
                          │
                          ▼
        [MANDATORY HUMAN-IN-THE-LOOP CHECKPOINT]
     (Agent execution halts -> Cryptographic Price Lock Armed)
                          │
                          ▼
          User Clicks PayPal Button & Authenticates
                          │
                          ▼
       [Node 5 & 6: Purchase & Payment Verification]
   (Calls PayPal Captures v2 -> Verifies Server Price Integrity)
                          │
                          ▼
        [MySQL 9.3 Transaction & Execution Audit Trail]
    (Reflected in Institutional AG Grid Ledger & Confetti Receipt)
```

---

## 🌟 Key Capabilities

1. **Split-Screen Command Studio (`/assistant`)**:
   - **Left Panel (42%)**: Conversational reasoning feed with live 4-stage swarm progress ticker (`[1/4] Supervisor` $\to$ `[2/4] Research` $\to$ `[3/4] Analyst` $\to$ `[4/4] Purchase`).
   - **Right Panel (58%)**: Dynamic hardware canvas spotlighting the #1 recommended match with specs matrix, honest strengths vs. trade-offs, and runner-up comparative delta chips.

2. **Fintech Escrow Authorization Checkpoint (`CheckoutModal`)**:
   - Cryptographic server price lock seal (`MATCHED`).
   - Itemized hardware invoice with immutable hash.
   - Official `<PayPalButtons />` SDK container + instant 1-click **Fast Demo Capture** fallback.

3. **Anti-Tampering Server Price Lock**:
   - Order amounts are verified server-side against backend database pricing. Even if client-side parameters are modified, the server enforces strict price integrity before dispatching to PayPal.

4. **Institutional AG Grid Ledger (`/dashboard`)**:
   - Enterprise data grid rendering live transactions, PayPal Order IDs, copyable PayPal Capture IDs, execution latency, and CSV export.

5. **Multi-Attribute Spec Matrix (`/compare`)**:
   - Direct side-by-side evaluation of GPU TGP wattages, CPU benchmark multithreading, and expandability.

6. **Dual-Mode Engine (`USE_MOCK_DATA`)**:
   - In `frontend/src/lib/mockData.ts`, toggle `USE_MOCK_DATA = true` for a 100% offline, lightning-fast demo. Set to `false` to connect directly to the live Express/MySQL backend.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, AG Grid Community, Canvas Confetti
- **Payments:** Official PayPal JavaScript SDK (`@paypal/react-paypal-js`), PayPal REST APIs v2 (Orders v2 & Captures v2), PayPal Sandbox
- **Backend:** Node.js, Express.js, TypeScript, Sequelize ORM
- **Database:** MySQL 9.3 (`paypilot_ai` schema, 8 tables)
- **Artificial Intelligence:** Google Gemini (`gemini-3.5-flash-lite`) Native Fetch Adapter
- **Product Discovery:** Channel3 Integration + High-Performance Catalog Fallback
- **Design System:** "Precision Obsidian & Surgical Red" (`#090A0C`, `#111215`, `#17181D`, `#23252B`, `#E53535`)

---

## ⚡ Quick Start

### 1. Option A: Instant Demo Mode (No Database Setup Needed)
The frontend comes pre-configured with the centralized mock engine (`USE_MOCK_DATA = true`):
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to experience the full interactive workflow.

---

### 2. Option B: Full-Stack Live Backend Mode (MySQL + Live PayPal Sandbox)

#### Configure Environment Variables:
Inside `backend/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=paypilot_ai

PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret

GEMINI_API_KEY=your_gemini_api_key
CHANNEL3_API_KEY=your_channel3_api_key
```

Inside `frontend/src/lib/mockData.ts`:
```typescript
export const USE_MOCK_DATA = false; // Connects to live Express backend
```

#### Run Monorepo Concurrently:
```bash
npm run dev
```

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend REST API:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **Diagnostics Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Live Demo Walkthrough for Judges

1. Open **[http://localhost:3000](http://localhost:3000)** to view the executive showcase and Swarm Lifecycle.
2. Click **"Launch Shopping Studio"** (or go to `/assistant`).
3. Click the sample prompt:
   > *"I need a laptop under ₹70,000 for programming, machine learning and occasional gaming"*
4. Watch the multi-agent progress ticker:
   - **Supervisor**: Parses intent and converts ₹70,000 to ~$824 USD.
   - **Shopping Research**: Queries Channel3 verified catalog.
   - **Product Analyst**: Evaluates benchmarks and spotlights the **Lenovo LOQ 15 (115W TGP RTX 4060)** at **98/100** with trade-offs.
5. Click **"Authorize Checkout via PayPal"**:
   - The **Escrow Modal** appears with the server price guarantee ($749.00 USD).
   - Click the yellow **PayPal** button (or click **"Simulate Instant Authorization"** for fast demo).
6. Confetti triggers, displaying the verified **PayPal Capture ID**.
7. Navigate to **[http://localhost:3000/dashboard](http://localhost:3000/dashboard)**:
   - Inspect the completed transaction in the **AG Grid Ledger** and export the audit CSV.

---

## 📜 License
MIT License - Copyright (c) 2026 PayPilot AI Team — PayPal AI Hackathon 2026
