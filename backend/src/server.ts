import app from './app';
import { config } from './config/env';
import { connectDatabase, sequelize } from './config/database';
import './models';

async function startServer() {
  console.log(`[Server] Starting PayPilot AI backend in '${config.env}' mode...`);

  // Verify and initialize database
  const dbConnected = await connectDatabase();
  if (dbConnected) {
    try {
      await sequelize.sync({ alter: true });
      console.log('[Server] Database schema synchronized successfully.');
    } catch (syncError: any) {
      console.error('[Server] Warning during schema synchronization:', syncError.message);
    }
  } else {
    console.warn('[Server] Starting server without active database connection. Retrying in background...');
  }

  // Start HTTP Listener
  app.listen(config.port, () => {
    console.log(`=======================================================`);
    console.log(`  🚀 PayPilot AI Backend Server Running!`);
    console.log(`  📍 Local:            http://localhost:${config.port}`);
    console.log(`  🏥 Health Endpoint:  http://localhost:${config.port}/api/health`);
    console.log(`  📦 Environment:      ${config.env}`);
    console.log(`=======================================================`);
  });
}

startServer().catch((error) => {
  console.error('[Server] Fatal error on startup:', error);
  process.exit(1);
});
