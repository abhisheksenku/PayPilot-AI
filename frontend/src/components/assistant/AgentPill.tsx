import React from 'react';

interface AgentPillProps {
  agentName: string;
  isProcessing?: boolean;
}

export const AgentPill: React.FC<AgentPillProps> = ({ agentName, isProcessing }) => {
  const getAgentConfig = (name: string) => {
    switch (name.toLowerCase()) {
      case 'supervisor':
        return {
          label: 'Supervisor',
          code: 'SUPV',
          dotColor: 'bg-indigo-400',
          textColor: 'text-indigo-300',
          border: 'border-indigo-500/20',
          bg: 'bg-indigo-500/10',
        };
      case 'memory':
        return {
          label: 'Memory',
          code: 'MEM',
          dotColor: 'bg-blue-400',
          textColor: 'text-blue-300',
          border: 'border-blue-500/20',
          bg: 'bg-blue-500/10',
        };
      case 'research':
        return {
          label: 'Research (Channel3)',
          code: 'RSRC',
          dotColor: 'bg-cyan-400',
          textColor: 'text-cyan-300',
          border: 'border-cyan-500/20',
          bg: 'bg-cyan-500/10',
        };
      case 'analyst':
        return {
          label: 'Analyst (Specs)',
          code: 'ANLY',
          dotColor: 'bg-purple-400',
          textColor: 'text-purple-300',
          border: 'border-purple-500/20',
          bg: 'bg-purple-500/10',
        };
      case 'purchase':
        return {
          label: 'PayPal Escrow',
          code: 'PAYPAL',
          dotColor: 'bg-[#0070BA]',
          textColor: 'text-sky-300',
          border: 'border-[#0070BA]/30',
          bg: 'bg-[#0070BA]/15',
        };
      case 'payment_verify':
      case 'payment_verification':
        return {
          label: 'Audit Verifier',
          code: 'VFY',
          dotColor: 'bg-emerald-400',
          textColor: 'text-emerald-300',
          border: 'border-emerald-500/20',
          bg: 'bg-emerald-500/10',
        };
      default:
        return {
          label: `${name} Agent`,
          code: 'AGNT',
          dotColor: 'bg-slate-400',
          textColor: 'text-slate-300',
          border: 'border-white/[0.08]',
          bg: 'bg-[#0F172A]',
        };
    }
  };

  const config = getAgentConfig(agentName);

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${config.bg} border ${config.border} text-xs font-mono shadow-sm`}>
      <span className={`w-2 h-2 rounded-full ${config.dotColor} ${isProcessing ? 'animate-ping' : ''}`} />
      <span className="text-slate-400 font-bold">{config.code}:</span>
      <span className={`${config.textColor} font-semibold`}>{config.label}</span>
    </div>
  );
};
