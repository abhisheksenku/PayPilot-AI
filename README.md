# 🚀 PayPilot AI

> **Autonomous AI-Powered Agentic Commerce Platform**  
> Built for the **PayPal AI Hackathon 2026** — *Agentic Commerce Track*

PayPilot AI transforms modern ecommerce through an autonomous multi-agent system governed by **strict human-in-the-loop authorization**. Instead of browsing hundreds of online storefronts, users describe their purchasing requirements, use cases, and budget in natural language. A coordinated swarm of AI agents discovers genuine products, evaluates technical specifications, ranks top options, drafts orders, and halts for user authorization before capturing payments securely via the official **PayPal Sandbox Orders v2 & Captures v2 APIs**.

---

## 🌟 Key Features

1. **Autonomous Multi-Agent Orchestration**:
   - **Supervisor Agent**: Understands natural language, classifies intent, and extracts structured requirements (converts local currencies like ₹70,000 to USD).
   - **Memory Agent**: Contextualizes multi-turn conversations across sessions.
   - **Shopping Research Agent**: Queries Channel3 API and local high-performance catalog.
   - **Product Analyst Agent**: Evaluates CPU benchmarks, GPU tier, RAM, SSD speed, and builds multi-attribute ranking matrices (scores 0–100).
   - **Purchase Agent**: Prepares verified orders and triggers official PayPal Sandbox checkouts.
   - **Payment Verification Agent**: Verifies capture receipts, enforces idempotency, and logs immutable audit trails.

2. **Mandatory Human-in-the-Loop Governance**:
   - AI agents **never** independently charge payments.
   - The workflow halts at the authorization checkpoint and requires physical user interaction with the official `<PayPalButtons />` SDK.

3. **Anti-Tampering Price Lock**:
   - Order amounts are validated server-side against backend database pricing. Even if client-side parameters are modified, the server enforces strict price integrity.

4. **Real-Time AG Grid Transaction Dashboard**:
   - Enterprise data grid rendering live transactions, PayPal Order IDs, PayPal Capture IDs, and agent execution times directly from MySQL 9.3.

5. **Bespoke Fintech Visual Identity**:
   - Modern **Black, White, and Red** theme (`#111111`, `#1A1A1A`, `#E53935`, `#FFFFFF`) built with Next.js 14 App Router, Tailwind CSS, and Lucide Icons.

---

## 🏗️ Multi-Agent Architecture

```
User Prompt (e.g. "I need a laptop under ₹70,000 for ML and gaming")
                          │
                          ▼
             [Node 1: Memory Agent]
             (Retrieves session history)
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
    (Agent halts execution -> displays PayPal SDK Button)
                          │
                          ▼
         User Clicks PayPal Button & Authenticates
                          │
                          ▼
      [Node 5 & 6: Purchase & Payment Verification]
  (Calls PayPal Captures v2 -> Verifies Server Price Match)
                          │
                          ▼
       [MySQL 9.3 Transaction & Execution Audit Trail]
   (Reflected in Real-Time AG Grid Dashboard & Confetti Receipt)
```

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, AG Grid Community, Canvas Confetti
- **Payments:** Official PayPal JavaScript SDK (`@paypal/react-paypal-js`), PayPal REST APIs v2 (Orders v2 & Captures v2), PayPal Sandbox
- **Backend:** Node.js, Express.js, TypeScript, Sequelize ORM
- **Database:** MySQL 9.3 (`paypilot_ai` schema, 8 tables)
- **Artificial Intelligence:** Google Gemini (`gemini-3.5-flash-lite`) Native Fetch Adapter
- **Product Discovery:** Channel3 Integration + High-Performance Catalog Fallback

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** v20+ or v24+
- **MySQL Server** 8.0+ or 9.0+ running on `127.0.0.1:3306`

### 2. Configure Environment Variables
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

Inside `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
```

### 3. Launch the Application
Run both backend and frontend simultaneously:
```bash
npm run dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **Health Diagnostics:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Live Demo Walkthrough for Judges

1. Open **[http://localhost:3000](http://localhost:3000)** in your browser.
2. Click **"Launch Shopping Assistant"** or navigate to `/assistant`.
3. Enter a prompt like:
   > *"I need a laptop under ₹70,000 for programming, machine learning and occasional gaming"*
4. Observe the **Supervisor Agent** convert ₹70,000 to ~$824 USD, and watch the **Product Analyst Agent** recommend the **Lenovo LOQ 15 Gaming & ML Laptop** with score 98/100.
5. Click **"Select & Review Checkout"**:
   - The **Human Authorization Modal** appears with a strict anti-tampering server price guarantee ($749.00 USD).
6. Click the yellow **PayPal** button in the modal:
   - Log into PayPal Sandbox (using any Sandbox Personal buyer account).
   - Click **Complete Purchase**.
7. The payment is immediately captured via PayPal Captures v2, triggering celebration confetti and displaying your live **PayPal Capture ID**.
8. Navigate to **[http://localhost:3000/dashboard](http://localhost:3000/dashboard)**:
   - See your completed transaction reflected in real time inside the **AG Grid Dashboard**.

---

## 📜 License
MIT License - Copyright (c) 2026 PayPilot AI Team
