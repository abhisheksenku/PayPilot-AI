# 🏆 PayPilot AI — Buildathon Submission Package

> **Submission Guide for the Google DeepMind × Google Cloud Startup Buildathon India 2026**  
> *Track: Agentic AI & Intelligent Commerce*  
> *Repository:* [https://github.com/abhisheksenku/PayPilot-AI](https://github.com/abhisheksenku/PayPilot-AI)

---

## 1. Submission Fields (Copy & Paste Ready)

### Project Title
**PayPilot AI — Intelligent Purchasing Agent with User-Controlled Financial Authorization**

### Tagline (One Sentence / 140 chars)
An intelligent purchasing agent that researches, evaluates, and executes complex hardware purchases with user-controlled financial authorization.

### Target Vertical
Developer & Machine Learning Hardware (Laptops, Workstations, Local LLM Compute).

---

### Inspiration
Procuring specialized computing hardware—such as laptops for machine learning, local LLM inference, and software engineering—is a high-consideration, high-regret process. Shoppers spend hours cross-referencing spec sheets, deciphering deceptive GPU wattage ratings (e.g. an unrestricted 115W/140W TGP vs. a throttled 45W mobile variant), and worrying about soldered RAM limits across dozens of retail browser tabs.

At the same time, modern AI commerce agents fall into two dangerous extremes:
1. **Passive Toy Chatbots:** Conversational tools that merely regurgitate Amazon affiliate links without any evaluation or checkout execution power.
2. **Unconstrained Auto-Buyers:** Reckless autonomous scripts that store raw payment credentials and execute charges without oversight—a major regulatory and financial compliance liability.

We built **PayPilot AI** to bridge this gap: giving AI agents full autonomy to discover, benchmark, and stage orders, while enforcing a **strict Human-in-the-Loop financial boundary powered by official PayPal rails**.

---

### What It Does
PayPilot AI converts complex natural-language hardware constraints into verified, server-validated transactions:

1. **Natural Language Understanding:** The user specifies their workload and budget in plain English (*"I need a laptop under ₹85,000 for running local LLMs, machine learning experiments, and software development"*).
2. **Currency & Constraint Normalization:** The Supervisor Agent (powered by Google Gemini) normalizes local currency (₹85,000 INR $\to$ ~\$1,000 USD) and extracts technical constraints.
3. **Hardware Discovery:** The Shopping Research Agent queries candidate hardware models matching the budget cap.
4. **Deep Hardware Benchmarking:** The Product Analyst Agent scores candidates from 0 to 100 based on GPU TGP wattage, VRAM bandwidth, thermal headroom, and upgradeability, explaining honest trade-offs.
5. **Server-Side Price Validation:** The Purchase Agent re-validates the product's price directly against backend database records, strictly preventing client-side price tampering.
6. **Mandatory Human-in-the-Loop Authorization:** AI execution deterministically **halts**. The user inspects the price lock and physically authorizes the purchase via the official PayPal checkout button.
7. **Settlement & Audit Ledger:** Payment is captured via PayPal Sandbox REST API v2, returning real PayPal Capture IDs (`8B...` / `C-...`), logging an immutable transaction in MySQL, and rendering an itemized digital receipt.

---

### How We Built It
- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, and Canvas Confetti. Designed in the official PayPal Developer Console Light Theme with a responsive Split-Screen Copilot layout.
- **Payments:** Official PayPal JavaScript SDK (`@paypal/react-paypal-js`), PayPal Sandbox REST APIs v2 (`/v2/checkout/orders` & `/v2/payments/captures`).
- **Backend:** Node.js, Express.js, TypeScript, Sequelize ORM.
- **Database:** MySQL 8/9 (`paypilot_ai` schema, 8 relational tables for users, conversations, messages, products, orders, transactions, agent executions, and approvals).
- **Artificial Intelligence:** Google Gemini (`gemini-3.5-flash` with resilient cascade to `gemini-3.5-flash-lite`) with Google Search Grounding for real-time web verification, structured constraint extraction, and comparative technical synthesis, coordinated by a multi-agent state machine.
- **Fail-Safe Resilience:** Built-in `NEXT_PUBLIC_ENABLE_SEED_DATA` environment toggle supporting both pure live MySQL/PayPal mode and demo visual blueprint mode.

---

### Authentication & Evaluation Scope Note
> **For Evaluators:** To enable immediate evaluation without onboarding friction, user context is pre-scoped to an authenticated **Single-Tenant Developer Session (`AU / Abhishek UthukotaSriram`)** connected to pre-configured PayPal Sandbox merchant rails.

---

### Challenges We Overcame
1. **The Financial Autonomy Dilemma:** Structuring an agent that feels proactive without violating financial compliance. We solved this by treating payments as an explicit Human-in-the-Loop escrow checkpoint rather than an autonomous background charge.
2. **Preventing Price Tampering:** Ensuring client-side parameters cannot be manipulated to alter checkout totals. The server re-validates the product UUID directly against the database at the moment of PayPal order creation.
3. **Hardware Spec Normalization:** Translating diverse manufacturer spec sheets into actionable AI benchmark scores (e.g., correlating GPU TGP wattage to PyTorch matrix multiplication speed).

---

### Accomplishments We're Proud Of
- Designing a **Split-Screen Studio Copilot** where conversational reasoning lives alongside a persistent hardware recommendation and checkout terminal.
- Multi-turn conversation handling where previous questions automatically collapse into summary pills, keeping the screen focused.
- Real end-to-end integration with official **PayPal Orders v2 & Captures v2** printing genuine PayPal capture seals on completion.
- Zero-error TypeScript monorepo with 100% type safety across frontend and backend.

---

## 2. Two-Minute Video Demo Script (Second-by-Second)

| Time | Screen Action | Voiceover Script |
| :---: | :--- | :--- |
| **0:00 - 0:25** | Open **[http://localhost:3000](http://localhost:3000)** (`/studio`). Show split-screen layout. | *"Welcome to PayPilot AI. We built this for the Google DeepMind × Google Cloud Startup Buildathon to solve a critical challenge in Agentic Commerce: How do you give AI agents purchasing intelligence without risking unauthorized financial spending?"* |
| **0:25 - 0:50** | Click prompt chip: *"I need a laptop under ₹85,000 for running local LLMs and ML"*. | *"Instead of browsing dozens of retail tabs and deciphering confusing specs, I simply state my workload and budget. Our multi-agent swarm immediately begins execution: the Supervisor normalizes ₹85,000 INR to $1,000 USD, our Research agent queries the catalog, and our Analyst evaluates specs."* |
| **0:50 - 1:15** | Right dock populates. Highlight **Hero Spotlight Card (Lenovo LOQ 15)**, **115W TGP**, and **98/100 score**. Ask follow-up question for 32GB RAM. | *"Notice our Product Analyst evaluates GPU TGP wattage—spotlighting that the Lenovo LOQ has an unrestricted 115W TGP RTX 4060, making it vastly superior for tensor operations than throttled 45W alternatives. When I ask for a 32GB RAM option, Question 1 collapses and the ASUS ROG Zephyrus immediately takes the spotlight."* |
| **1:15 - 1:40** | Click **"PayPal Checkout"**. Modal opens. Point to **Server Price Validation**. Click **Authorize**. Confetti pops! | *"Here is our core innovation: The Human-in-the-Loop Checkpoint. The AI agent deterministically halts. It cannot charge my card autonomously. The price is validated server-side against our database records. I physically authorize the payment via official PayPal Sandbox rails. The capture executes and returns our verified PayPal Capture ID."* |
| **1:40 - 2:00** | Navigate to **Event Logs & Ledger** (`/transactions`) and **Orders** (`/orders`). Show live captured row and printable receipt. | *"Every transaction is committed to our institutional relational ledger and order tracking database with full telemetry. PayPilot AI bridges the gap between autonomous AI research and safe, compliant payments. Thank you."* |

---

## 3. Judge Q&A Cheat Sheet (Anticipating Tough Questions)

**Q: Can the AI agent accidentally overcharge the user or buy the wrong item?**  
*A:* No. The architecture implements a **hard deterministic guardrail**. The agent's role ends at drafting the order parameters and computing suitability. The backend re-validates the price against trusted database records, locks the amount, and requires user credential/biometric authorization with the official PayPal SDK before capture.

**Q: Why focus specifically on developer and ML hardware?**  
*A:* High-ticket technical purchases (\$700–\$2,500+) suffer from the highest shopper confusion and regret due to deceptive specs (TGP wattage, soldered RAM, thermal limits). Technical buyers evaluate hardware objectively, allowing our Product Analyst Agent to provide mathematically grounded benchmark scores (0–100) that directly drive purchase conviction.

**Q: How is Google AI and Google Cloud utilized in the architecture?**  
*A:* 
1. **Google Gemini Intelligence**: Google Gemini (`gemini-3.5-flash` with a resilient cascade to `gemini-3.5-flash-lite`) powers the Supervisor Agent for structured JSON constraint extraction and INR-to-USD currency normalization, and synthesizes multi-turn technical trade-off evaluations in the Product Analyst Agent.
2. **Google Search Grounding**: Product analysis supports Google Search Grounding (`google_search` tool) to pull real-time web citations and pricing verification, logging grounding telemetry to our MySQL audit ledger.
3. **Google Cloud Run Serverless Architecture**: Both the Next.js standalone frontend and Express multi-agent backend are containerized with multi-stage Dockerfiles and `cloudbuild.yaml` pipelines for sub-second cold starts and seamless scaling on Google Cloud Run in `asia-south1` (Mumbai). See [Deployment Guide](docs/deployment/DEPLOYMENT_GUIDE.md).

---

## 4. Google Evaluation Criteria Alignment Matrix

| Criterion | What Judges Look For | PayPilot AI Implementation & Evidence |
|---|---|---|
| **1. Founder Profile** | High-velocity full-stack execution & technical clarity | Solo builder execution delivering an institutional-grade multi-agent purchasing engine, real PayPal REST API v2 token exchange, Next.js 14 standalone containerization, and zero-error TypeScript typing across the entire monorepo. |
| **2. Product Potential** | Solving a genuine, non-trivial problem in AI commerce | Solves the fundamental blocker to Agentic Commerce: the *Financial Autonomy Dilemma*. Replaces passive link-recommenders and unsafe auto-buyers with an intelligent purchasing agent protected by a mandatory Human-in-the-Loop financial checkpoint. |
| **3. Market Viability** | Commercial defensibility & monetization | Focuses on high-ticket developer & ML hardware (\$700–\$2,500+) where technical specs directly determine purchase conviction. Clear revenue paths through affiliate procurement margins, B2B hardware team seat licensing, and merchant integration fees. |
| **4. Technical Architecture** | Sound engineering, zero buzzword inflation | State graph orchestration (Supervisor $\to$ Research $\to$ Analyst $\to$ Purchase $\to$ Payment Verification), server-side price validation locking amounts directly in trusted database records, relational MySQL persistence (8 tables), and clean audit telemetry. |
| **5. Use of Google AI & Cloud** | Deep, authentic Google technology integration | **Google Gemini 3.5 Flash** for multi-turn conversational reasoning and structured JSON intent parsing; **Google Search Grounding** for real-time web verification and pricing telemetry; **Google Cloud Run** containerization (`cloudbuild.yaml` & Docker standalone) in `asia-south1` (Mumbai). |

