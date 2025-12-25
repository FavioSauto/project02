import { getUserSubscription, updateUserSubscription } from '@/features/subscription/server/db';
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

/**
 * Check if user has enough credits
 */
export async function hasEnoughCredits(userId: string, requiredCredits: number): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  if (!subscription || subscription.creditsRemaining === null) {
    return false;
  }

  return subscription.creditsRemaining >= requiredCredits;
}

/**
 * Consume credits from user account
 */
export async function consumeCredits(userId: string, credits: number): Promise<void> {
  const subscription = await getUserSubscription(userId);

  if (!subscription || subscription.creditsRemaining === null) {
    throw new Error('No credits available');
  }

  const newCredits = subscription.creditsRemaining - credits;

  if (newCredits < 0) {
    throw new Error('Insufficient credits');
  }

  await updateUserSubscription(userId, {
    creditsRemaining: newCredits,
  });
}

/**
 * Get user's remaining credits
 */
export async function getRemainingCredits(userId: string): Promise<number> {
  const subscription = await getUserSubscription(userId);

  if (!subscription || subscription.creditsRemaining === null) {
    return 0;
  }

  return subscription.creditsRemaining;
}
