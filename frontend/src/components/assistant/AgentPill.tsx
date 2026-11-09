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
          description: 'Intent Analysis & Orchestration',
          icon: Cpu,
          badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
        };
      case 'memory':
        return {
          label: 'Memory Agent',
          description: 'Context & History Retrieval',
          icon: Database,
          badgeColor: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
        };
      case 'research':
        return {
          label: 'Shopping Research Agent',
          description: 'Channel3 & Catalog Search',
          icon: Search,
          badgeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
        };
      case 'analyst':
        return {
          label: 'Product Analyst Agent',
          description: 'Multi-Attribute Spec Ranking',
          icon: Scale,
          badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
        };
      case 'purchase':
        return {
          label: 'Purchase Agent',
          description: 'PayPal Order Drafting & Auth Checkpoint',
          icon: ShoppingCart,
          badgeColor: 'border-red-500/30 bg-red-500/10 text-red-400',
        };
      case 'payment_verify':
      case 'payment_verification':
        return {
          label: 'Payment Verification Agent',
          description: 'PayPal Capture Verification',
          icon: CheckCircle2,
          badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
        };
      default:
        return {
          label: 'PayPilot Orchestrator',
          description: 'State Machine Engine',
          icon: Cpu,
          badgeColor: 'border-zinc-500/30 bg-zinc-500/10 text-zinc-400',
        };
    }
  };

  const config = getAgentConfig(agentName);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${config.badgeColor}`}>
      <Icon className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
      <span className="font-semibold">{config.label}</span>
      <span className="text-zinc-500 hidden sm:inline">• {config.description}</span>
      {isProcessing && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping ml-1" />
      )}
    </div>
  );
};
