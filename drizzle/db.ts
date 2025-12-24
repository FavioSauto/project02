import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Use connection pooler for serverless (e.g., Supabase Pooler, PgBouncer)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * PostgreSQL connection pool configuration
 * Optimized for production workloads with concurrent connections
 *
 * Pool settings explained:
 * - max: Maximum number of clients in the pool (default: 20)
 * - min: Minimum number of clients kept alive (default: 2)
 * - idleTimeoutMillis: How long a client can be idle before being released (default: 30s)
 * - connectionTimeoutMillis: Max time to wait for a connection (default: 10s)
 * - allowExitOnIdle: Allows the pool to shut down when all connections are idle (dev mode)
 */
const poolConfig = {
  connectionString: process.env.DATABASE_URL!,
  // For analysis workloads, consider:
  // - Each analysis pipeline may use 2-3 concurrent connections
  // - With 5 concurrent users, you need 10-15 connections
  // - Most managed PostgreSQL services limit to 20-100 connections
  // - Set max to: (expected_concurrent_analyses * 3) + 5 (buffer)
  max: isServerless ? 1 : isDevelopment ? 10 : parseInt(process.env.DB_POOL_MAX || '20', 10),
  // Keep minimum connections alive for faster response times
  min: isServerless ? 0 : isDevelopment ? 0 : parseInt(process.env.DB_POOL_MIN || '2', 10),
  // Release idle connections more aggressively in development
  idleTimeoutMillis: isDevelopment ? 10000 : 30000,
  // Max time to wait for a connection before timing out
  connectionTimeoutMillis: 10000,
  // Allow pool to exit when idle (helps with hot-reloads in dev)
  allowExitOnIdle: isDevelopment,
};

/**
 * Global pool instance to prevent multiple pools during hot-reloads
 * In development, Next.js hot-reloads can create multiple pool instances
 * This pattern ensures we reuse the same pool across reloads
 */
declare global {
  // eslint-disable-next-line no-var
  var __db_pool: Pool | undefined;
}

let pool: Pool;

if (isDevelopment) {
  // In development, reuse existing pool or create new one
  if (!global.__db_pool) {
    global.__db_pool = new Pool(poolConfig);

    // Add error handler to prevent unhandled rejections
    global.__db_pool.on('error', (err) => {
      console.error('Unexpected error on idle database client:', err);
    });

    // Log pool statistics in development
    if (process.env.DB_DEBUG === 'true') {
      setInterval(() => {
        console.log('[DB Pool Stats]', {
          total: global.__db_pool?.totalCount,
          idle: global.__db_pool?.idleCount,
          waiting: global.__db_pool?.waitingCount,
        });
      }, 30000); // Log every 30 seconds
    }
  }
  pool = global.__db_pool;
} else {
  // In production, create a new pool
  pool = new Pool(poolConfig);

  pool.on('error', (err) => {
    console.error('Unexpected error on idle database client:', err);
  });
}

/**
 * Drizzle database instance with connection pooling
 * The pool automatically manages connection reuse and prevents connection exhaustion
 */
export const db = drizzle(pool, { schema });

/**
 * Graceful shutdown handler
 * Ensures all database connections are properly closed
 */
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    await pool.end();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await pool.end();
    process.exit(0);
  });
}
