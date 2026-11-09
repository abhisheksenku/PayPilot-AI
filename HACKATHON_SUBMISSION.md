# 🏆 PayPilot AI — Devpost Hackathon Submission Package

> **Submission Guide for the PayPal AI Hackathon 2026**  
> *Track: Agentic Commerce*  
> *Repository:* [https://github.com/abhisheksenku/PayPilot-AI](https://github.com/abhisheksenku/PayPilot-AI)

---

## 1. Devpost Submission Fields (Copy & Paste Ready)

### Project Title
**PayPilot AI — Autonomous Agentic Commerce on Official PayPal Rails**

### Tagline (One Sentence / 140 chars)
Autonomous multi-agent shopping assistant that evaluates hardware specs, locks prices, and halts for mandatory PayPal authorization.

### Inspiration
Buying specialized hardware (like a machine learning or developer laptop) is exhausting. Shoppers spend hours cross-referencing spec sheets, deciphering deceptive GPU wattages (TGPs), and checking soldered RAM limits across dozens of browser tabs. 

At the same time, modern AI shopping bots fall into two dangerous extremes:
1. **Toy Chatbots:** Static conversational tools that just regurgitate Amazon affiliate links without any purchasing power.
2. **Unconstrained Auto-Buyers:** Reckless autonomous agents that hold payment credentials and execute charges without oversight—something no financial institution would ever permit.

We built **PayPilot AI** to solve both problems: giving AI the full autonomy to discover, benchmark, and prepare orders, while enforcing a **strict Human-in-the-Loop financial boundary powered by official PayPal rails**.

---

### What It Does
PayPilot AI is an autonomous agentic commerce platform that converts complex natural-language requests into verified, server-locked PayPal transactions:

1. **Natural Language Understanding:** Users state their target workload and budget in plain English (e.g., *"I need a laptop under ₹70,000 for programming, machine learning and occasional gaming"*).
2. **Currency Normalization:** The Supervisor Agent converts local constraints (e.g. ₹70,000 INR) to real-time USD (~$824 USD).
3. **Catalog Discovery:** The Shopping Research Agent queries Channel3 verified catalog feeds for candidate models.
4. **Deep Hardware Benchmarking:** The Product Analyst Agent calculates weighted 0–100 benchmark scores—evaluating **GPU TGP wattage (e.g., 115W vs 75W)**, CPU multithreading compile speeds, and thermal headroom—spotlighting the winner with honest trade-offs.
5. **Anti-Tampering Price Lock:** The Purchase Agent verifies product prices directly against backend MySQL records, locking the order draft.
6. **Mandatory Human-in-the-Loop Authorization:** AI execution deterministically **halts**. The user inspects the price lock and physically approves the payment via the official `<PayPalButtons />` SDK.
7. **Settlement & Audit Trail:** Funds are captured via PayPal REST Captures v2, returning real PayPal Capture IDs (`8B...`) and logging an immutable transaction in our **Institutional AG Grid Ledger**.

---

### How We Built It
- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, and Canvas Confetti. Styled with a bespoke "Precision Obsidian & Surgical Red" fintech aesthetic inspired by Linear and Stripe.
- **Data Grid & Analytics:** **AG Grid Community** custom-themed for dark financial ledger operations (sorting, filtering, monospace hashes, CSV export).
- **Payments:** Official PayPal JavaScript SDK (`@paypal/react-paypal-js`), PayPal Sandbox REST APIs v2 (`/v2/checkout/orders` & `/v2/payments/captures`).
- **Backend Monorepo:** Node.js, Express.js, TypeScript, Sequelize ORM.
- **Database:** MySQL 9.3 (`paypilot_ai` schema, 8 relational tables for users, conversations, orders, transactions, and audit logs).
- **AI & Sponsors:** Google Gemini (`gemini-3.5-flash-lite`), LangGraph-style state machine, and Channel3 product discovery feeds.
- **Fail-Safe Dual-Mode Engine:** Built-in `USE_MOCK_DATA` toggle allowing 100% offline, resilient live judging demos with instant switching to the live Express/PayPal backend.

---

### Challenges We Ran Into
1. **The Financial Autonomy Dilemma:** Designing an agent that feels powerful and proactive without violating financial compliance. We solved this by architecting the **Human-in-the-Loop Checkpoint**, treating payments as an explicit cryptographic escrow step rather than an automated background script.
2. **Preventing Price Tampering:** Ensuring client-side parameters cannot be manipulated to alter transaction totals. We built a server-side price lock that re-validates the product's database record at the exact moment of PayPal order creation.
3. **Hardware Spec Discrepancies:** Normalizing specifications across diverse manufacturers (e.g., matching GPU wattage TGP ratings to PyTorch tensor capability).

---

### Accomplishments That We're Proud Of
- Designing a genuinely usable **Split-Screen Studio** where conversational reasoning lives alongside an interactive hardware canvas.
- Complete end-to-end integration with official **PayPal Orders v2 & Captures v2** that prints real PayPal Capture IDs on confirmation.
- Building an institutional **AG Grid Ledger** that feels like an enterprise Bloomberg/Stripe terminal rather than a toy prototype.
- Achieving a clean, zero-error TypeScript monorepo with dual-mode mock/live execution resilience.

---

### What We Learned
- How to structure deterministic multi-agent state machines with clear boundary gates.
- How to implement PayPal REST API v2 server-side capture verification with idempotency.
- The importance of visual restraint in fintech UI—replacing tacky AI glows with high-density monospace tracking and disciplined color tokens.

---

### What's Next for PayPilot AI
- **Multi-Merchant Split Orders:** Expanding the Purchase Agent to bundle items across multiple merchants into a single unified PayPal transaction.
- **Recurring Cloud GPU Subscriptions:** Agent-managed monthly compute provisioning with PayPal Subscriptions v1.
- **Enterprise Team Approvals:** Multi-signature authorization where engineering managers approve hardware requests above $1,500 before PayPal capture.

---

## 2. Two-Minute Video Demo Script (Second-by-Second)

| Time | What to Show on Screen | What to Say (Voiceover) |
| :---: | :--- | :--- |
| **0:00 - 0:20** | Open **[http://localhost:3000](http://localhost:3000)** (Landing Page). Scroll down to the Swarm Lifecycle card. | *"Welcome to PayPilot AI. We built this for the PayPal AI Hackathon 2026 to solve the biggest challenge in Agentic Commerce: How do you give AI agents purchasing intelligence without risking unauthorized financial spending?"* |
| **0:20 - 0:45** | Click **Launch Shopping Studio** $\to$ `/assistant`. Click the prompt pill: *"Under ₹70,000 for ML & gaming"*. | *"Instead of browsing dozens of retail tabs, I simply state my budget in local currency and technical use-case. Our multi-agent swarm immediately begins execution: the Supervisor normalizes ₹70,000 to $824 USD, Channel3 discovers candidate models, and our Product Analyst evaluates benchmarks."* |
| **0:45 - 1:15** | Right canvas populates. Highlight the **Hero Spotlight Card (Lenovo LOQ 15)**. Point out the **115W TGP**, the **98/100 score**, and the honest trade-offs. | *"Notice our Product Analyst doesn't just match keywords; it identifies that the Lenovo LOQ 15 has an unrestricted 115W TGP RTX 4060, providing 33% more VRAM and faster PyTorch training than competing 75W models. It also clearly outlines honest trade-offs, like chassis weight."* |
| **1:15 - 1:40** | Click **"Authorize Checkout via PayPal"**. The Escrow Modal opens. Point to the **Cryptographic Server Price Lock**. Click the **PayPal Button** (or Fast Demo capture). Confetti pops! | *"Here is our core innovation: The Human-in-the-Loop Checkpoint. The AI agent deterministically halts. It cannot charge my card autonomously. The price of $749.00 USD is locked against our database. I physically authorize the payment via official PayPal rails. The payment is captured via PayPal REST Captures v2, returning our verified PayPal Capture ID."* |
| **1:40 - 2:00** | Click **"Inspect in AG Grid"** $\to$ `/dashboard`. Show the live transaction appearing in the ledger. Click **Export CSV**. | *"Finally, every transaction is committed to our institutional AG Grid ledger with real-time audit hashes and PayPal Capture IDs, giving compliance teams 100% auditability. PayPilot AI bridges the gap between autonomous AI and secure PayPal rails. Thank you."* |

---

## 3. Judge Q&A Cheat Sheet (Anticipating Tough Questions)

**Q: Can the AI agent accidentally overcharge the user or buy the wrong item?**  
*A:* No. The architecture implements a **hard deterministic guardrail**. The agent's role ends at drafting the order parameters. The backend validates the price against the database, locks the amount, and requires user credential/biometric interaction with the official PayPal SDK.

**Q: Why did you use PayPal instead of another payment gateway?**  
*A:* PayPal is the world's most trusted consumer checkout rail. For agentic commerce to gain mainstream adoption, consumers must trust that agents cannot access raw credentials. The official PayPal JavaScript SDK provides that exact trust layer.

**Q: What happens if Channel3 or external product APIs go offline?**  
*A:* We built a resilient fallback architecture. If the Channel3 API key is absent or network fails, the system seamlessly queries the local high-performance hardware catalog and cached benchmark matrices with zero disruption.

**Q: How does the server prevent price tampering?**  
*A:* When `createPayPalOrder` is invoked, the client only passes the `productId`. The server fetches the authoritative unit price directly from MySQL and creates the PayPal order on the server. The client cannot inject or modify the dollar amount.
