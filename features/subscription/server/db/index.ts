'use server';

import { db } from '@/drizzle/db';
import { user } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import type { SubscriptionUpdate, UserSubscription } from '../../types';

/**
 * Get user subscription information by user ID
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const result = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      columns: {
        subscriptionTier: true,
        subscriptionStatus: true,
        lemonSqueezyCustomerId: true,
        lemonSqueezySubscriptionId: true,
        subscriptionEndsAt: true,
        creditsRemaining: true,
      },
    });

    if (!result) {
      return null;
    }

    return result;
  } catch (error) {
    throw new Error('Failed to retrieve user subscription');
  }
}

/**
 * Get full user data including subscription information
 */
export async function getUserWithSubscription(userId: string) {
  try {
    const result = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (!result) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Update user subscription information
 */
export async function updateUserSubscription(userId: string, subscriptionData: SubscriptionUpdate): Promise<void> {
  try {
    await db
      .update(user)
      .set({
        ...subscriptionData,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));
  } catch (error) {
    throw new Error('Failed to update user subscription');
  }
}
