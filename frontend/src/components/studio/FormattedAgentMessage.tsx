'use client';

import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface FormattedAgentMessageProps {
  content: string;
  onOpenCheckout?: () => void;
}

/**
 * Parses and formats inline markdown (bolding, price tags, hardware specs, medals).
 */
function renderInlineText(text: string) {
  // Regex to match **bold** text
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldContent = part.slice(2, -2);

      // Check for rank badges like #1, #2, #3
      if (boldContent.startsWith('#1')) {
        return (
          <span key={index} className="inline-flex items-center gap-1 font-bold text-gray-900">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
              <span>🥇</span>
              <span>#1</span>
            </span>
            <span>{boldContent.replace(/^#1[.:]?\s*/, '')}</span>
          </span>
        );
      }
      if (boldContent.startsWith('#2')) {
        return (
          <span key={index} className="inline-flex items-center gap-1 font-bold text-gray-900">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-extrabold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
              <span>🥈</span>
              <span>#2</span>
            </span>
            <span>{boldContent.replace(/^#2[.:]?\s*/, '')}</span>
          </span>
        );
      }
      if (boldContent.startsWith('#3')) {
        return (
          <span key={index} className="inline-flex items-center gap-1 font-bold text-gray-900">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
              <span>🥉</span>
              <span>#3</span>
            </span>
            <span>{boldContent.replace(/^#3[.:]?\s*/, '')}</span>
          </span>
        );
      }

      // Highlighting RAM or key specifications
      if (/32GB|16GB|64GB|RTX|Intel|AMD|Apple/i.test(boldContent)) {
        return (
          <span
            key={index}
            className="font-bold text-blue-900 bg-blue-50/80 px-1.5 py-0.5 rounded text-[11px] border border-blue-200/60"
          >
            {boldContent}
          </span>
        );
      }

      return (
        <strong key={index} className="font-bold text-gray-900">
          {boldContent}
        </strong>
      );
    }

    // Format dollar prices in regular text
    if (/\$[0-9,]+(?:\.[0-9]{2})?/.test(part)) {
      const priceParts = part.split(/(\$[0-9,]+(?:\.[0-9]{2})?)/g);
      return (
        <React.Fragment key={index}>
          {priceParts.map((sub, sIdx) => {
            if (/^\$[0-9,]+(?:\.[0-9]{2})?$/.test(sub)) {
              return (
                <span
                  key={sIdx}
                  className="font-mono font-bold text-[#0070BA] bg-blue-50/50 px-1 py-0.2 rounded"
                >
                  {sub}
                </span>
              );
            }
            return sub;
          })}
        </React.Fragment>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export function FormattedAgentMessage({ content, onOpenCheckout }: FormattedAgentMessageProps) {
  if (!content) return null;

  // 1. Normalize formatting so bullet points, headers, and CTAs begin on clean lines
  let normalized = content
    .replace(/(?<!\n)\s*\*\s+\*\*/g, '\n\n* **')
    .replace(/(?<!\n)\s*\*\*Why\s+/g, '\n\n**Why ')
    .replace(/(?<!\n)\s*(Would you like (?:me to|to)\s+prepare)/gi, '\n\n$1');

  const rawBlocks = normalized
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3 text-xs sm:text-sm text-gray-800 leading-relaxed font-normal">
      {rawBlocks.map((block, bIdx) => {
        // Case A: Bullet Comparison items (e.g. * **#1. ASUS...** or * **#2...**)
        if (block.startsWith('* ') || block.startsWith('- ')) {
          const rawBullets = block
            .split(/\n(?=[*-]\s)/)
            .map((s) => s.replace(/^[*-]\s+/, '').trim())
            .filter(Boolean);

          return (
            <div key={bIdx} className="space-y-2 my-2">
              {rawBullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs hover:border-blue-200 hover:bg-blue-50/20 transition-all flex items-start gap-2.5"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0070BA] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1 leading-snug">
                    {renderInlineText(bullet)}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        // Case B: "Why X is the best recommendation" Highlight Section
        if (block.toLowerCase().includes('why ') && block.includes('**')) {
          return (
            <div
              key={bIdx}
              className="p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-200/80 rounded-xl shadow-2xs space-y-1.5"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0070BA]">
                <Sparkles className="w-3.5 h-3.5 text-[#0070BA] shrink-0" />
                <span>AI Recommendation Rationale</span>
              </div>
              <div className="text-xs sm:text-[13px] text-gray-800 leading-relaxed">
                {renderInlineText(block)}
              </div>
            </div>
          );
        }

        // Case C: Call To Action Question ("Would you like me to prepare the order and PayPal checkout...")
        if (
          block.toLowerCase().includes('paypal') &&
          (block.toLowerCase().includes('checkout') || block.toLowerCase().includes('prepare the order'))
        ) {
          return (
            <div
              key={bIdx}
              className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
            >
              <div className="flex items-start sm:items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-xs font-semibold text-amber-950">
                  {renderInlineText(block)}
                </span>
              </div>

              {onOpenCheckout && (
                <button
                  type="button"
                  onClick={onOpenCheckout}
                  className="px-3.5 py-1.5 bg-[#FFC439] hover:bg-[#F4B400] text-[#003087] font-extrabold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer border border-[#E0A800]"
                >
                  <span>PayPal Checkout</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        }

        // Case D: General text paragraph / intro
        return (
          <p key={bIdx} className="text-gray-800 font-normal">
            {renderInlineText(block)}
          </p>
        );
      })}
    </div>
  );
}
