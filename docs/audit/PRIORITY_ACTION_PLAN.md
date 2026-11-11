# Priority Action Plan: PayPilot AI

**Target:** Optimization & Roadmap for Google DeepMind × Google Cloud Startup Buildathon India 2026  
**Auditor:** Senior Product Architect & Startup Evaluator  
**Date:** November 11, 2026  

---

## 1. Action Priority Matrix

```mermaid
quadrantChart
    title Action Priority & Impact vs. Effort
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 High Impact / High Effort
    quadrant-2 High Impact / Low Effort (Quick Wins)
    quadrant-3 Low Impact / Low Effort
    quadrant-4 Low Impact / High Effort
    "Google Search Grounding": [0.35, 0.90]
    "Inject History into Gemini Prompt": [0.20, 0.85]
    "Deploy to Cloud Run": [0.40, 0.88]
    "Real User Authentication (JWT)": [0.45, 0.65]
    "True LangGraph / Google ADK": [0.70, 0.80]
    "Live Channel3 Supplier Key": [0.30, 0.50]
    "Automated Refund Workflow": [0.60, 0.40]
    "Multi-Merchant Split Cart": [0.85, 0.70]
```

---

## 2. Tier 1: Critical for Demonstration (Immediate 24–48hr Actions)

These improvements directly eliminate vulnerabilities during live judge evaluations and showcase DeepMind/Google Cloud alignment:

| Priority | Action Item | Area | Effort | Impact | Technical Execution |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **P1** | **Inject Conversation History into Gemini Prompt** | AI Engine | 1–2 hrs | 🟢 High | In `supervisorNode.ts` and `analystNode.ts`, concatenate `state.history` into the user prompt so Gemini genuinely maintains context across follow-up queries. |
| **P2** | **Deploy Live on Google Cloud Run** | Infrastructure | 2–4 hrs | 🟢 High | Containerize frontend and backend via Docker, provision Google Cloud SQL for MySQL, and host on Cloud Run with SSL domain. Eliminates localhost demo friction. |
| **P3** | **Enable Google Search Grounding in Gemini** | AI / Data | 2–3 hrs | 🟢 High | Add `tools: [{ googleSearch: {} }]` to Gemini API calls so product prices and availability cite real-time Google Search results rather than relying solely on static seed data. |
| **P4** | **Reconcile AG Grid Claim vs. Code Reality** | Frontend | 1 hr | 🟡 Medium | In documentation and submission text, clarify that the transaction ledger uses a bespoke responsive data grid with clipboard hashes and CSV export, rather than claiming AG Grid Enterprise. |

---

## 3. Tier 2: Important for Evaluation (Pre-Submission Polish)

These improvements strengthen the technical rigor and product credibility when judges inspect source code:

| Priority | Action Item | Area | Effort | Impact | Technical Execution |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **P5** | **Real User Registration & JWT Authentication** | Backend / Security | 3–5 hrs | 🟢 High | Implement `POST /api/auth/register` and `POST /api/auth/login`. Replace static `'00000000-0000-...'` UUID with authenticated user identity stored in JWT cookies. |
| **P6** | **Genuine PayPal Webhook Receiver** | Payments | 3–4 hrs | 🟡 Medium | Add `POST /api/payments/webhook` endpoint with `paypalClient.verifyWebhookSignature()` to handle `PAYMENT.CAPTURE.COMPLETED` events asynchronously. |
| **P7** | **Automated API & Agent Test Suite** | QA / Reliability | 3–4 hrs | 🟡 Medium | Write Jest/Supertest suite covering: 1) Intent extraction, 2) Price-lock integrity, 3) PayPal order creation, and 4) Capture idempotency. |
| **P8** | **Migrate to Official Google GenAI SDK** | AI Engine | 2 hrs | 🟡 Medium | Replace direct REST `fetch` in `geminiClient.ts` with the official `@google/genai` SDK for cleaner streaming and tool calling. |

---

## 4. Tier 3: Optional Commercial Enhancements (Post-Buildathon Roadmap)

Longer-term milestones for enterprise scalability and commercialization:

1. **Multi-Merchant Split Orders:** Expand Purchase Agent to partition a single natural-language order (e.g. laptop from Lenovo + external monitor from Dell) into coordinated parallel PayPal orders.
2. **Cloud GPU Provisioning (Agent-Managed Subscriptions):** Integrate PayPal Subscriptions API to provision recurring monthly cloud compute (RunPod, Lambda Labs, Google Cloud Vertex AI instances) through conversational requests.
3. **B2B Multi-Signature Team Approvals:** Add engineering manager approval gates for corporate equipment requests exceeding $1,500 before PayPal capture execution.
