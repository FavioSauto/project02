export type SubscriptionTier = 'Pro';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'past_due';
export type SubscriptionPlan = 'monthly' | 'annual';

export interface UserSubscription {
  subscriptionTier: SubscriptionTier | null;
  subscriptionStatus: SubscriptionStatus | null;
  lemonSqueezyCustomerId: string | null;
  lemonSqueezySubscriptionId: string | null;
  subscriptionEndsAt: Date | null;
  creditsRemaining: number | null;
}

export interface SubscriptionUpdate {
  subscriptionTier?: SubscriptionTier;
  subscriptionStatus?: SubscriptionStatus;
  lemonSqueezyCustomerId?: string;
  lemonSqueezySubscriptionId?: string;
  subscriptionEndsAt?: Date;
  creditsRemaining?: number;
}

export interface MockCheckoutData {
  plan: SubscriptionPlan;
  userId: string;
}
