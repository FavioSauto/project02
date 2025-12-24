import { z } from 'zod';

export const subscriptionTierSchema = z.enum(['Pro']);
export const subscriptionStatusSchema = z.enum(['active', 'canceled', 'expired', 'past_due']);
export const subscriptionPlanSchema = z.enum(['monthly', 'annual']);

export const mockCheckoutSchema = z.object({
  plan: subscriptionPlanSchema,
});

export const subscriptionUpdateSchema = z.object({
  subscriptionTier: subscriptionTierSchema.optional(),
  subscriptionStatus: subscriptionStatusSchema.optional(),
  subscriptionEndsAt: z.date().optional(),
  creditsRemaining: z.number().int().optional(),
});
