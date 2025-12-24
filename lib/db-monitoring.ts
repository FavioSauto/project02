/**
 * Database query monitoring and performance tracking utilities
 *
 * Usage:
 * 1. Wrap queries with withQueryTiming() to log slow queries
 * 2. Use QueryPerformanceMonitor for aggregated metrics
 * 3. Set ENABLE_QUERY_MONITORING=true in .env to enable logging
 */

/**
 * Query timing result
 */
export interface QueryTiming {
  queryName: string;
  durationMs: number;
  timestamp: Date;
  slow: boolean;
}

/**
 * Query performance thresholds
 */
export const QUERY_THRESHOLDS = {
  SLOW: 100, // Queries slower than 100ms are considered slow
  VERY_SLOW: 500, // Queries slower than 500ms are very slow
} as const;

/**
 * Monitor for tracking query performance metrics
 */
class QueryPerformanceMonitor {
  private timings: QueryTiming[] = [];
  private readonly maxTimings = 1000; // Keep last 1000 queries in memory

  /**
   * Record a query timing
   */
  public record(timing: QueryTiming): void {
    this.timings.push(timing);

    // Keep only recent timings to prevent memory bloat
    if (this.timings.length > this.maxTimings) {
      this.timings.shift();
    }

    // Log slow queries in development/staging
    if (timing.slow && this.isMonitoringEnabled() && process.env.NODE_ENV === 'development') {
      const level = timing.durationMs > QUERY_THRESHOLDS.VERY_SLOW ? 'VERY_SLOW' : 'SLOW';
      // Use console.warn for slow queries - this is monitoring, not debugging
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[DB ${level}] ${timing.queryName} took ${timing.durationMs}ms (threshold: ${QUERY_THRESHOLDS.SLOW}ms)`
        );
      }
    }
  }

  /**
   * Get statistics for a specific query
   */
  public getQueryStats(queryName: string) {
    const queryTimings = this.timings.filter((t) => t.queryName === queryName);

    if (queryTimings.length === 0) {
      return null;
    }

    const durations = queryTimings.map((t) => t.durationMs);
    const sum = durations.reduce((a, b) => a + b, 0);
    const avg = sum / durations.length;
    const min = Math.min(...durations);
    const max = Math.max(...durations);
    const slowCount = queryTimings.filter((t) => t.slow).length;

    return {
      queryName,
      count: queryTimings.length,
      avgMs: Math.round(avg * 100) / 100,
      minMs: min,
      maxMs: max,
      slowCount,
      slowPercentage: Math.round((slowCount / queryTimings.length) * 100),
    };
  }

  /**
   * Get all query statistics
   */
  public getAllStats() {
    const uniqueQueries = [...new Set(this.timings.map((t) => t.queryName))];
    return uniqueQueries.map((name) => this.getQueryStats(name)).filter((s) => s !== null);
  }

  /**
   * Get slowest queries
   */
  public getSlowestQueries(limit: number = 10) {
    return [...this.timings]
      .sort((a, b) => b.durationMs - a.durationMs)
      .slice(0, limit)
      .map((t) => ({
        queryName: t.queryName,
        durationMs: t.durationMs,
        timestamp: t.timestamp,
      }));
  }

  /**
   * Clear all recorded timings
   */
  public clear(): void {
    this.timings = [];
  }

  /**
   * Check if monitoring is enabled
   */
  private isMonitoringEnabled(): boolean {
    return process.env.ENABLE_QUERY_MONITORING === 'true' || process.env.NODE_ENV === 'development';
  }
}

/**
 * Global query performance monitor instance
 */
export const queryMonitor = new QueryPerformanceMonitor();

/**
 * Measure execution time of a database query
 * Automatically records timing and logs slow queries
 *
 * @param queryName - Name of the query for identification
 * @param queryFn - Async function that executes the query
 * @param slowThreshold - Override default slow query threshold (ms)
 * @returns Query result
 *
 * @example
 * ```typescript
 * const users = await withQueryTiming(
 *   'getUsersBySubscription',
 *   async () => db.query.user.findMany({
 *     where: eq(user.subscriptionTier, 'Pro')
 *   })
 * );
 * ```
 */
export async function withQueryTiming<T>(
  queryName: string,
  queryFn: () => Promise<T>,
  slowThreshold: number = QUERY_THRESHOLDS.SLOW
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await queryFn();
    const durationMs = Math.round(performance.now() - startTime);
    const slow = durationMs > slowThreshold;

    queryMonitor.record({
      queryName,
      durationMs,
      timestamp: new Date(),
      slow,
    });

    return result;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);

    // Record failed queries too
    queryMonitor.record({
      queryName: `${queryName} (FAILED)`,
      durationMs,
      timestamp: new Date(),
      slow: true, // Always mark failed queries as slow
    });

    throw error;
  }
}

/**
 * Measure execution time of a synchronous operation
 * Useful for non-database operations that need performance tracking
 *
 * @param operationName - Name of the operation
 * @param operationFn - Function that executes the operation
 * @returns Operation result
 */
export function withTiming<T>(operationName: string, operationFn: () => T): T {
  const startTime = performance.now();

  try {
    const result = operationFn();
    const durationMs = Math.round(performance.now() - startTime);

    if (durationMs > QUERY_THRESHOLDS.SLOW && process.env.NODE_ENV === 'development') {
      console.warn(`[SLOW OPERATION] ${operationName} took ${durationMs}ms`);
    }

    return result;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[FAILED OPERATION] ${operationName} failed after ${durationMs}ms`);
    }
    throw error;
  }
}

/**
 * Create a performance report for monitoring/debugging
 * Useful for health check endpoints or admin dashboards
 */
export function getPerformanceReport() {
  const allStats = queryMonitor.getAllStats();
  const slowestQueries = queryMonitor.getSlowestQueries(5);

  return {
    summary: {
      totalQueries: allStats.reduce((sum, s) => sum + (s?.count || 0), 0),
      uniqueQueries: allStats.length,
      slowQueries: allStats.reduce((sum, s) => sum + (s?.slowCount || 0), 0),
    },
    slowestQueries,
    queryStats: allStats.sort((a, b) => (b?.avgMs || 0) - (a?.avgMs || 0)),
  };
}
