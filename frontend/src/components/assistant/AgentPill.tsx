import React from 'react';
import { Cpu, Database, Search, Scale, ShoppingCart, CheckCircle2 } from 'lucide-react';

interface AgentPillProps {
  agentName: string;
  isProcessing?: boolean;
}

export const AgentPill: React.FC<AgentPillProps> = ({ agentName, isProcessing }) => {
  const getAgentConfig = (name: string) => {
    switch (name.toLowerCase()) {
      case 'supervisor':
        return {
          label: 'Supervisor Agent',
          code: 'SUPV',
          dotColor: 'bg-purple-400',
          textColor: 'text-purple-300',
        };
      case 'memory':
        return {
          label: 'Memory Agent',
          code: 'MEM',
          dotColor: 'bg-blue-400',
          textColor: 'text-blue-300',
        };
      case 'research':
        return {
          label: 'Research Agent',
          code: 'RSRC',
          dotColor: 'bg-cyan-400',
          textColor: 'text-cyan-300',
        };
      case 'analyst':
        return {
          label: 'Analyst Agent',
          code: 'ANLY',
          dotColor: 'bg-amber-400',
          textColor: 'text-amber-300',
        };
      case 'purchase':
        return {
          label: 'Purchase Agent',
          code: 'PURC',
          dotColor: 'bg-[#E53535]',
          textColor: 'text-[#E53535]',
        };
      case 'payment_verify':
      case 'payment_verification':
        return {
          label: 'Payment Verifier',
          code: 'VFY',
          dotColor: 'bg-emerald-400',
          textColor: 'text-emerald-300',
        };
      default:
        return {
          label: `${name} Agent`,
          code: 'AGNT',
          dotColor: 'bg-zinc-400',
          textColor: 'text-zinc-300',
        };
    }
  };

  const config = getAgentConfig(agentName);

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#17181D] border border-[#23252B] text-xs font-mono">
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${isProcessing ? 'animate-pulse' : ''}`} />
      <span className="text-[#8F94A0] font-semibold">{config.code}:</span>
      <span className={`${config.textColor} font-medium`}>{config.label}</span>
    </div>
  );
};
