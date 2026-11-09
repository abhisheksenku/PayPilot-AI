import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import { config } from './env';

export const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: false,
    },
  }
);

/**
 * Ensures the MySQL database exists before Sequelize attempts to connect.
 */
export async function ensureDatabaseExists(): Promise<void> {
  try {
    const connection: any = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.database.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await connection.end();
  } catch (error: any) {
    console.warn(`[Database] Warning during database existence check: ${error.message}`);
  }
}

/**
 * Authenticates the database connection.
 */
export async function connectDatabase(): Promise<boolean> {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log(`[Database] Connected successfully to MySQL (${config.database.name}) at ${config.database.host}:${config.database.port}`);
    return true;
  } catch (error: any) {
    console.error('[Database] Connection failure:', error.message);
    return false;
  }
}
