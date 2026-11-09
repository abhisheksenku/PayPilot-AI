import { AgentExecution } from '../../../models';

export async function logAgentToolExecution<TInput, TOutput>(params: {
  conversationId: string;
  toolName: string;
  input: TInput;
  executor: () => Promise<TOutput>;
}): Promise<TOutput> {
  const { conversationId, toolName, input, executor } = params;
  const startTime = Date.now();

  try {
    const output = await executor();
    const duration = Date.now() - startTime;

    await AgentExecution.create({
      conversationId,
      toolName,
      input: (input as any) || {},
      output: (output as any) || {},
      status: 'completed',
      executionTime: duration,
    }).catch((err) => {
      console.warn(`[AuditLogger] Warning logging tool execution: ${err.message}`);
    });

    return output;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    await AgentExecution.create({
      conversationId,
      toolName,
      input: (input as any) || {},
      output: { error: error.message },
      status: 'failed',
      executionTime: duration,
    }).catch(() => {});

    throw error;
  }
}
