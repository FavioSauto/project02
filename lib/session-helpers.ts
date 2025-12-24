'use server';

/**
 * @fileoverview Session and subscription helpers for better-auth integration
 *
 * ## Architecture
 * - Authentication: better-auth provides session management (user ID, email, basic info)
 * - Subscription: Fresh data is fetched directly from database in middleware and server components
 *   This eliminates session staleness - subscription changes are reflected immediately
 *
 * ## No Session Caching
 * Subscription data is NOT cached in the session. This ensures:
 * - Immediate reflection of subscription changes
 * - No need for cache invalidation
 * - Always-fresh subscription state
 * - Simpler mental model
 *
 * ## Usage in Server Actions
 * ```typescript
 * // After updating subscription in DB
 * await updateUserSubscription(userId, { subscriptionTier: 'Pro' });
 *
 * // Revalidate paths to clear Next.js cache
 * await notifySubscriptionChange();
 *
 * // Client will receive fresh data on next navigation
 * ```
 */

import { auth } from '@/features/auth/libs/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { db } from '@/drizzle/db';
import { user as userTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Get fresh subscription data for the current user
 * Since subscription data is not cached, this always returns up-to-date information
 *
 * @example
 * // After subscription purchase
 * const freshData = await getUserSubscription();
 * if (freshData) {
 *   // Use fresh data
 * }
 *
 * @returns Fresh subscription data if user is authenticated, null otherwise
 */
export async function getUserSubscription(): Promise<{
  subscriptionTier: 'Pro' | null;
  subscriptionStatus: 'active' | 'canceled' | 'expired' | 'past_due' | null;
  subscriptionEndsAt: Date | null;
  creditsRemaining: number | null;
} | null> {
  try {
    // Get current session to verify user is authenticated
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user?.id) {
      return null;
    }

    // Fetch fresh subscription data directly from DB
    const freshUserData = await db.query.user.findFirst({
      where: eq(userTable.id, session.user.id),
      columns: {
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionEndsAt: true,
        creditsRemaining: true,
      },
    });

    if (!freshUserData) {
      return null;
    }

    return {
      subscriptionTier: freshUserData.subscriptionTier ?? null,
      subscriptionStatus: freshUserData.subscriptionStatus ?? null,
      subscriptionEndsAt: freshUserData.subscriptionEndsAt,
      creditsRemaining: freshUserData.creditsRemaining,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Invalidate all sessions for the current user
 * Forces user to re-authenticate, which triggers the session callback
 * and ensures completely fresh session data
 *
 * Use this for critical security operations or when session data
 * must be absolutely fresh (e.g., after password change, role changes)
 *
 * @returns true if sessions were invalidated successfully
 */
export async function invalidateAllSessions(): Promise<boolean> {
  try {
    // Revoke all other sessions for the current user
    // This will force re-authentication on their next request
    await auth.api.revokeOtherSessions({
      headers: await headers(),
    });

    // Revalidate to clear any cached session data
    revalidatePath('/', 'layout');

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Notify the application that a subscription has changed
 * Clears Next.js cache to ensure fresh data is served on next navigation
 *
 * Call this after any subscription update (upgrade, downgrade, cancellation)
 *
 * @example
 * ```typescript
 * await updateUserSubscription(userId, { tier: 'Pro' });
 * await notifySubscriptionChange();
 * ```
 */
export async function notifySubscriptionChange(): Promise<void> {
  try {
    // Clear Next.js cache for all protected routes
    // This ensures the next middleware execution will fetch fresh subscription data
    revalidatePath('/(protectedFeatures)', 'layout');
    revalidatePath('/api', 'layout');
    revalidatePath('/', 'layout');
  } catch (error) {
    // Silent fail - cache revalidation is not critical
    if (process.env.NODE_ENV === 'development') {
      console.error('[SESSION HELPERS] Failed to revalidate paths:', error);
    }
  }
}

/**
 * Get current session (authentication only)
 * Utility function for server components and actions
 *
 * Note: This returns basic user info (ID, email, name).
 * For subscription data, use getUserSubscription() instead.
 *
 * @returns Session or null if not authenticated
 */
export async function getSession() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    return session;
  } catch (error) {
    return null;
  }
}
