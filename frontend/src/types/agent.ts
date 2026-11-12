import { RankedProduct } from './product';

export type AgentRole = 
  | 'supervisor'
  | 'research'
  | 'analyst'
  | 'purchase'
  | 'verifier'
  | 'consultant'
  | 'memory';

export interface AgentExecutionLog {
  id: string;
  agentRole: AgentRole;
  stepIndex: number;
  toolName: string;
  inputSummary?: string;
  outputSummary?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  executionTimeMs?: number;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentRole?: AgentRole;
  executionLogs?: AgentExecutionLog[];
  rankedProducts?: RankedProduct[];
  orderDraftId?: string;
  priceLockAmount?: number;
}
