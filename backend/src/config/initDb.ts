import { connectDatabase, sequelize } from './database';
import '../models'; // Ensure all models and associations are loaded

export async function initializeDatabase() {
  console.log('[InitDb] Starting database initialization...');
  
  const connected = await connectDatabase();
  if (!connected) {
    console.error('[InitDb] Failed to connect to MySQL. Please verify MySQL service and credentials.');
    process.exit(1);
  }

  try {
    // Synchronize models with MySQL (creates tables if they do not exist)
    await sequelize.sync({ alter: true });
    console.log('[InitDb] All 8 tables synchronized successfully in `paypilot_ai`:');
    console.log(' - users');
    console.log(' - conversations');
    console.log(' - messages');
    console.log(' - products');
    console.log(' - orders');
    console.log(' - transactions');
    console.log(' - agent_executions');
    console.log(' - agent_approvals');
    console.log('[InitDb] Database setup complete.');
  } catch (error: any) {
    console.error('[InitDb] Error during model synchronization:', error);
    process.exit(1);
  }
}

// Execute directly if run as a standalone script
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
