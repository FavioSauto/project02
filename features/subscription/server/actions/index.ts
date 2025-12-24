'use server';

import { z } from 'zod';
import { auth } from '@/features/auth/libs/auth';
import { headers } from 'next/headers';
import { mockCheckoutSchema } from '../../schemas';
import { getUserSubscription, updateUserSubscription } from '../db';
import { notifySubscriptionChange } from '@/lib/session-helpers';
import type { ActionState } from '@/types/actionHelpers';

/**
 * Mock checkout - simulates subscribing to Pro plan
 * In production, this would create a LemonSqueezy checkout session
 */
export async function mockCheckout(data: z.infer<typeof mockCheckoutSchema>): Promise<ActionState> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return {
        error: 'You must be logged in to subscribe',
      };
    }

    const validatedData = mockCheckoutSchema.parse(data);

    // Calculate subscription end date
    const now = new Date();
    const endsAt = new Date(now);
    if (validatedData.plan === 'monthly') {
      endsAt.setDate(endsAt.getDate() + 30);
    } else {
      endsAt.setDate(endsAt.getDate() + 365);
    }

    // Update user subscription to Pro
    await updateUserSubscription(session.user.id, {
      subscriptionTier: 'Pro',
      subscriptionStatus: 'active',
      subscriptionEndsAt: endsAt,
    });

    // Clear Next.js cache to ensure fresh subscription data is served
    // Middleware will fetch fresh data from DB on next request
    await notifySubscriptionChange();

    return {
      success: `Successfully subscribed to Pro (${validatedData.plan})!`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: 'Invalid subscription plan',
      };
    }

    return {
      error: 'Failed to process subscription. Please try again.',
    };
  }
}

/**
 * Cancel subscription - marks subscription as canceled
 */
export async function cancelSubscription(): Promise<ActionState> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return {
        error: 'You must be logged in',
      };
    }

    const subscription = await getUserSubscription(session.user.id);

    if (!subscription || subscription.subscriptionTier !== 'Pro') {
      return {
        error: 'No active subscription found',
      };
    }

    await updateUserSubscription(session.user.id, {
      subscriptionStatus: 'canceled',
    });

    // Clear Next.js cache to ensure fresh subscription data is served
    await notifySubscriptionChange();

    return {
      success: 'Subscription canceled. Access will continue until the end of your billing period.',
    };
  } catch (error) {
    return {
      error: 'Failed to cancel subscription. Please try again.',
    };
  }
}

/**
 * Reactivate subscription - reactivates a canceled subscription
 */
export async function reactivateSubscription(): Promise<ActionState> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return {
        error: 'You must be logged in',
      };
    }

    const subscription = await getUserSubscription(session.user.id);

    if (!subscription || subscription.subscriptionStatus !== 'canceled') {
      return {
        error: 'No canceled subscription found',
      };
    }

    await updateUserSubscription(session.user.id, {
      subscriptionStatus: 'active',
    });

    // Clear Next.js cache to ensure fresh subscription data is served
    await notifySubscriptionChange();

    return {
      success: 'Subscription reactivated successfully!',
    };
  } catch (error) {
    return {
      error: 'Failed to reactivate subscription. Please try again.',
    };
  }
}

/**
 * Get current user subscription information
 */
export async function getCurrentSubscription(): Promise<ActionState> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return {
        error: 'You must be logged in',
      };
    }

    const subscription = await getUserSubscription(session.user.id);

    return {
      success: 'Subscription retrieved',
      data: subscription,
    };
  } catch (error) {
    return {
      error: 'Failed to retrieve subscription',
    };
  }
}
