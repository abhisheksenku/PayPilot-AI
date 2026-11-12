import { AgentState } from '../state';
import { geminiClient } from '../../../integrations/ai/geminiClient';
import { AgentExecution } from '../../../models';

export async function questionAnswerNode(state: AgentState): Promise<Partial<AgentState>> {
  const { conversationId, userMessage, selectedProductId, rankedProducts } = state;
  const msgLower = (userMessage || '').toLowerCase();

  // Try to find if a specific product is in context
  const activeProduct =
    rankedProducts?.find((p) => p.productId === selectedProductId) ||
    rankedProducts?.[0] ||
    state.productContext;

  const productName = activeProduct?.name || 'modern gaming & developer laptops (e.g. Lenovo LOQ 15, ASUS ROG Zephyrus G16, TUF A15)';
  const specs = activeProduct?.specifications || {};

  // 1. Try Gemini AI with Search Grounding
  let aiAnswer: string | null = null;
  if (geminiClient.isAvailable()) {
    try {
      const prompt = `User Question: "${userMessage}"
Context / Active Product in Session: ${productName}
Product Specifications: ${JSON.stringify(specs)}

You are PayPilot AI's senior hardware consultant and technical shopping advisor.
Instructions:
1. Provide a direct, authoritative, and friendly answer to the user's specific question.
2. If the user asks a technical concept question (e.g. "what is RAM", "what is TGP", "what is DDR5"):
   - Explain what it is in clear, accessible language.
   - Explain why it matters for computing, gaming, and local machine learning workflows (CUDA/PyTorch).
   - Recommend standard configurations (e.g. 16GB for general dev/gaming, 32GB+ for LLMs/heavy multitasking).
3. If the user asks about product manufacturing details (e.g. "manufacturing date", "release date", "batch"):
   - Explain that laptops are manufactured in rolling production batches corresponding to their platform generation (typically 2024–2026 for 13th/14th Gen Intel and Ryzen 7000/8000 series).
   - Provide the exact ways a buyer can verify the Manufacturing Date (MFD: Month/Year):
     a) On the regulatory barcode sticker affixed to the bottom chassis.
     b) On the retail packaging box next to the serial number (S/N).
     c) Via OEM diagnostics (Lenovo Vantage, ASUS Armoury Crate, Dell SupportAssist) or BIOS/UEFI System Information.
4. If quoting any prices, strictly use Indian Rupees (₹ / INR, e.g. ₹62,990 INR). NEVER use USD or $.
5. Conclude with a helpful offer to assist with further specifications or PayPal checkout.`;

      aiAnswer = await geminiClient.generateText(prompt, {
        enableSearchGrounding: true,
        history: state.history,
        timeoutMs: 6000,
      });

      const grounding = geminiClient.getLastGroundingMetadata();
      if (grounding && conversationId) {
        AgentExecution.create({
          conversationId,
          toolName: 'knowledgeConsultantQA',
          input: { query: userMessage, topic: 'technical_qna' },
          output: {
            grounded: true,
            model: geminiClient.getLastModelUsed(),
          },
          status: 'completed',
          executionTime: 110,
        }).catch(() => {});
      }
    } catch {
      // Fall through to deterministic knowledge engine
    }
  }

  if (aiAnswer) {
    return {
      activeAgent: 'consultant',
      agentResponse: aiAnswer,
    };
  }

  // 2. Deterministic Knowledge Base (Offline / Shielded Fallback)
  let responseText = '';

  // Topic A: RAM (Random Access Memory)
  if (msgLower.includes('ram') || msgLower.includes('memory') || msgLower.includes('ddr')) {
    responseText = `### 🧠 Understanding RAM (Random Access Memory)

**RAM (Random Access Memory)** is the ultra-fast, volatile workspace your laptop uses to store instructions and data that the processor is currently working on. Unlike your permanent SSD storage, RAM clears when the machine restarts, but it operates at exponentially higher transfer speeds (up to **5200MHz – 7467MHz** on modern DDR5/LPDDR5X).

#### Why RAM is Crucial:
* **8GB RAM:** Minimum for basic web browsing and lightweight office tasks, but throttles under modern developer tools or modern AAA games.
* **16GB DDR5 (Standard Sweet Spot):** Found on models like the **Lenovo LOQ 15** (₹62,990 INR). Easily handles simultaneous Docker containers, IDEs (VS Code), 40+ browser tabs, and gaming without paging to disk.
* **32GB+ DDR5 (High-End & AI Workflows):** Found on the **ASUS ROG Zephyrus G16** (₹1,25,990 INR) and **Lenovo Legion Pro 5** (₹1,09,990 INR). Critical for running local LLMs (Llama 3, Mistral), compiling large C++/Rust codebases, and loading unquantized PyTorch tensor weights into memory without bottlenecks.

💡 **Upgradeability Tip:** Laptops with SO-DIMM slots (like Lenovo LOQ 15 and HP Victus 15) allow you to easily expand from 16GB to 32GB or 64GB in the future.`;
  }
  // Topic B: Manufacturing Date / Batch Information
  else if (
    msgLower.includes('manufacturing date') ||
    msgLower.includes('mfd') ||
    msgLower.includes('manufacture date') ||
    msgLower.includes('when was it made') ||
    msgLower.includes('release date')
  ) {
    responseText = `### 🏭 Manufacturing Date & Batch Verification

For modern laptops like the **Lenovo LOQ 15**, **ASUS ROG Zephyrus G16**, and **ASUS TUF A15**:

1. **Production Generation:**
   * These models belong to the **2024–2026** manufacturing cycle, built around 13th/14th Gen Intel Core and AMD Ryzen 7000/8000 series processors with NVIDIA GeForce RTX 40-series GPUs.
2. **Where to Find the Exact Manufacturing Date (MFD):**
   * **Bottom Chassis Label:** Look at the regulatory barcode sticker on the underside of the laptop. OEMs print the **MFD (Month/Year)**, serial number, and factory model code directly on this label.
   * **Retail Box Packaging:** The white barcode sticker on the side of the original sealed box clearly states **"MFD: MM/YYYY"** alongside the IMEI/Serial Number.
   * **BIOS / UEFI System Info:** Press \`F2\` or \`F12\` upon boot to view the motherboard assembly date and factory BIOS build stamp.
   * **Companion Software:** Check **Lenovo Vantage** or **ASUS Armoury Crate** under *Device Details & Warranty Status*, which pulls the factory birth certificate directly from OEM servers using your serial number.

🛡️ *All units shipped via PayPilot AI Channel3 depots in Bengaluru and Gurugram are factory-sealed brand-new stock backed by a 1-year official manufacturer on-site warranty in India.*`;
  }
  // Topic C: TGP / Graphics Power
  else if (msgLower.includes('tgp') || msgLower.includes('graphics power') || msgLower.includes('wattage')) {
    responseText = `### ⚡ What is TGP (Total Graphics Power)?

**TGP (Total Graphics Power)** measures the maximum wattage allocated to the dedicated graphics card (GPU). 

* In laptops, two identical GPUs (e.g. NVIDIA RTX 4060) can perform vastly differently based on their configured TGP.
* A **115W or 140W max TGP** (such as in the **Lenovo LOQ 15** and **Legion Pro 5**) delivers up to **25%–35% higher frame rates and CUDA tensor throughput** compared to slim 45W or 60W power-capped laptops.
* Higher TGP requires robust dual-fan thermal cooling and high-capacity power bricks (e.g. 170W–230W).`;
  }
  // Topic D: SSD / Storage
  else if (msgLower.includes('ssd') || msgLower.includes('storage') || msgLower.includes('nvme')) {
    responseText = `### 💾 Solid-State Storage (PCIe Gen 4 NVMe)

* **PCIe 4.0 NVMe SSDs** provide data transfer speeds up to **5,000–7,000 MB/s**, enabling near-instantaneous OS boot times, rapid IDE indexing, and lightning-fast dataset loading.
* Most of our catalog models (Lenovo LOQ, ASUS ROG, Dell G15) come equipped with an **extra M.2 2280 NVMe expansion slot**, allowing you to add a secondary 1TB or 2TB drive anytime without voiding your warranty.`;
  }
  // Topic E: General / Question Fallback
  else {
    responseText = `### 💡 PayPilot AI Hardware Consultation

Regarding your question about **${userMessage}**:

In modern performance hardware:
* Component specifications, platform generations, and thermal architectures are engineered to balance sustained processing speeds with battery efficiency.
* For the current hardware catalog (including **Lenovo LOQ 15 at ₹62,990 INR** and **ASUS ROG Zephyrus G16 at ₹1,25,990 INR**), all technical specifications comply with official OEM benchmarks and include full Indian domestic warranty coverage.

Would you like more specific details on ports, upgrade options, display calibration, or PayPal smart checkout for this model?`;
  }

  return {
    activeAgent: 'consultant',
    agentResponse: responseText,
  };
}
