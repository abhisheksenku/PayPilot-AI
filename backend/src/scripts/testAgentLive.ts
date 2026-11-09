import { connectDatabase } from '../config/database';
import { agentService } from '../modules/agent/agentService';
import { RankedProductItem } from '../modules/agent/state';
import { AgentExecution } from '../models';

async function run() {
  console.log('Connecting to database...');
  await connectDatabase();

  console.log('\n--- Sending query to PayPilot AI Multi-Agent Engine ---');
  const userMessage = 'I need a laptop under ₹70,000 for programming, machine learning and occasional gaming';
  console.log('User Prompt:', userMessage);

  const startTime = Date.now();
  const result = await agentService.processMessage({
    message: userMessage,
  });
  const duration = Date.now() - startTime;

  console.log(`\nCompleted in ${duration}ms!`);
  console.log('\n--- Agent Response ---');
  console.log(result.agentResponse);

  console.log('\n--- Extracted Requirements ---');
  console.log(JSON.stringify(result.requirements, null, 2));

  console.log('\n--- Top Ranked Products ---');
  result.rankedProducts?.forEach((p: RankedProductItem, i: number) => {
    console.log(`${i + 1}. ${p.name} ($${p.price}) - Score: ${p.score}/100`);
    console.log(`   Strengths: ${p.strengths.join(', ')}`);
    console.log(`   Trade-offs: ${p.tradeoffs.join(', ')}`);
  });

  const logs = await AgentExecution.findAll({
    where: { conversationId: result.conversationId },
    order: [['createdAt', 'ASC']],
  });

  console.log('\n--- Execution Audit Trail (MySQL) ---');
  console.log(`Conversation ID: ${result.conversationId}`);
  console.log(`Logged Executions: ${logs.length}`);
  logs.forEach((log) => {
    console.log(`- ${log.toolName} (${log.executionTime}ms): ${log.status}`);
  });
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
