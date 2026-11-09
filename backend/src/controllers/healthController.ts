import { Request, Response } from 'express';
import { sequelize } from '../config/database';

export async function getHealthStatus(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  let dbStatus = 'disconnected';
  let dbLatencyMs = -1;

  try {
    const dbPingStart = Date.now();
    await sequelize.authenticate();
    dbLatencyMs = Date.now() - dbPingStart;
    dbStatus = 'connected';
  } catch (error: any) {
    dbStatus = `error: ${error.message}`;
  }

  const isHealthy = dbStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    service: 'paypilot-backend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
      dialect: 'mysql',
      name: process.env.DB_NAME || 'paypilot_ai',
    },
    responseTimeMs: Date.now() - startTime,
  });
}
