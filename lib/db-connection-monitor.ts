/**
 * Database connection monitoring utilities
 *
 * Provides tools to monitor and manage PostgreSQL connections
 * Useful for debugging connection pool issues
 */

import { Pool } from 'pg';

/**
 * Get current connection statistics from the database
 *
 * @param pool - The PostgreSQL connection pool
 * @returns Connection statistics including total, active, and idle connections
 */
export async function getConnectionStats(pool: Pool) {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT 
        count(*) as total_connections,
        count(*) FILTER (WHERE state = 'active') as active_connections,
        count(*) FILTER (WHERE state = 'idle') as idle_connections,
        count(*) FILTER (WHERE state = 'idle in transaction') as idle_in_transaction,
        max_conn.setting::int as max_connections
      FROM pg_stat_activity
      CROSS JOIN pg_settings max_conn
      WHERE max_conn.name = 'max_connections'
      AND datname = current_database()
    `);

    return result.rows[0];
  } finally {
    client.release();
  }
}

/**
 * Get detailed information about all active connections
 *
 * @param pool - The PostgreSQL connection pool
 * @returns Array of connection details
 */
export async function getActiveConnections(pool: Pool) {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT 
        pid,
        usename,
        application_name,
        client_addr,
        state,
        state_change,
        query_start,
        NOW() - query_start as duration,
        LEFT(query, 100) as query_preview
      FROM pg_stat_activity
      WHERE datname = current_database()
      AND pid != pg_backend_pid()
      ORDER BY query_start DESC
    `);

    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * Terminate idle connections that have been idle for too long
 *
 * @param pool - The PostgreSQL connection pool
 * @param idleThresholdMinutes - Number of minutes a connection can be idle before termination
 * @returns Number of connections terminated
 */
export async function terminateIdleConnections(pool: Pool, idleThresholdMinutes = 5) {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT pg_terminate_backend(pid) as terminated, pid
      FROM pg_stat_activity
      WHERE datname = current_database()
      AND state = 'idle'
      AND state_change < NOW() - INTERVAL '${idleThresholdMinutes} minutes'
      AND pid != pg_backend_pid()
    `);

    return result.rowCount || 0;
  } finally {
    client.release();
  }
}

/**
 * Log pool statistics to console
 * Useful for debugging connection pool issues
 *
 * @param pool - The PostgreSQL connection pool
 * @param includeDbStats - Whether to query the database for additional stats
 */
export async function logPoolStats(pool: Pool, includeDbStats = true) {
  const poolStats = {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  };

  console.log('[Pool Stats]', poolStats);

  if (includeDbStats) {
    try {
      const dbStats = await getConnectionStats(pool);
      console.log('[DB Connection Stats]', dbStats);
    } catch (error) {
      console.error('[DB Stats Error]', error);
    }
  }
}
