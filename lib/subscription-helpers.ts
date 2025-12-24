import { getUserSubscription } from '@/features/subscription/server/db';
import type { SubscriptionTier, SubscriptionStatus } from '@/features/subscription/types';

/**
 * Get user subscription tier
 * Returns null if user has no active Pro subscription
 */
export async function getUserSubscriptionTier(userId: string): Promise<SubscriptionTier | null> {
  const subscription = await getUserSubscription(userId);

  if (!subscription || !subscription.subscriptionTier) {
    return null;
  }

  // Check if subscription is still valid
  if (subscription.subscriptionTier === 'Pro') {
    const isActive = isSubscriptionActive(subscription.subscriptionStatus, subscription.subscriptionEndsAt);
    if (!isActive) {
      return null;
    }
  }

  return subscription.subscriptionTier;
}

/**
 * Check if subscription is active
 */
export function isSubscriptionActive(status: SubscriptionStatus | null, endsAt: Date | null): boolean {
  if (!status || status !== 'active') {
    return false;
  }

  if (!endsAt) {
    return false;
  }

  const now = new Date();
  return endsAt > now;
}

/**
 * Check if user can access a specific feature based on their tier
 * Only Pro users have access to features
 */
export function canAccessFeature(tier: SubscriptionTier | null, feature: string): boolean {
  return tier === 'Pro';
}

/**
 * Get feature limits for a subscription tier
 * Returns null for non-Pro users
 */
export function getFeatureLimits(tier: SubscriptionTier | null) {
  if (tier === 'Pro') {
    return {
      maxRedditPosts: 5,
      // maxRedditPosts: Infinity,
      aiModel: 'advanced',
      unlimitedAnalyses: true,
      maxConcurrentConnections: 5,
    };
  }

  return null;
}

/**
 * Get maximum concurrent connections allowed for a subscription tier
 */
export function getMaxConcurrentConnections(tier: SubscriptionTier | null): number {
  if (tier === 'Pro') {
    return 5;
  }

  return 0;
}
