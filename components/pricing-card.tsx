'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockCheckout, cancelSubscription, reactivateSubscription } from '@/features/subscription/server/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function PricingCard({
  tier,
  name,
  priceMonthly,
  priceAnnual,
  features,
  isCurrentPlan,
  isCanceled,
  subscriptionEndsAt,
}: {
  tier: 'Pro' | 'Free';
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  isCurrentPlan: boolean;
  isCanceled: boolean;
  subscriptionEndsAt: Date | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const router = useRouter();

  async function handleSubscribe() {
    setIsLoading(true);
    try {
      const result = await mockCheckout({ plan: billingPeriod });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || 'Successfully subscribed!');
        router.refresh();
      }
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancel() {
    setIsLoading(true);
    try {
      const result = await cancelSubscription();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || 'Subscription canceled');
        router.refresh();
      }
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReactivate() {
    setIsLoading(true);
    try {
      const result = await reactivateSubscription();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || 'Subscription reactivated');
        router.refresh();
      }
    } catch (error) {
      toast.error('Failed to reactivate subscription');
    } finally {
      setIsLoading(false);
    }
  }

  const displayPrice = billingPeriod === 'monthly' ? priceMonthly : priceAnnual || priceMonthly;

  return (
    <div
      className={`border-2 rounded-lg p-8 relative ${
        tier === 'Pro' ? 'border-primary bg-card' : 'border-border bg-card'
      }`}
    >
      {isCurrentPlan && (
        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">Current Plan</Badge>
      )}

      {isCanceled && (
        <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">Canceled</Badge>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{displayPrice}</span>
          {tier === 'Pro' && <span className="text-muted-foreground">/ {billingPeriod}</span>}
        </div>
      </div>

      {tier === 'Pro' && !isCurrentPlan && (
        <div className="flex gap-2 mb-6">
          <Button
            variant={billingPeriod === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={function () {
              setBillingPeriod('monthly');
            }}
            className="flex-1"
          >
            Monthly
          </Button>
          <Button
            variant={billingPeriod === 'annual' ? 'default' : 'outline'}
            size="sm"
            onClick={function () {
              setBillingPeriod('annual');
            }}
            className="flex-1"
          >
            Annual
          </Button>
        </div>
      )}

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-success mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {isCurrentPlan && !isCanceled ? (
        <Button onClick={handleCancel} disabled={isLoading} className="w-full" variant="destructive">
          {isLoading ? 'Processing...' : 'Cancel Subscription'}
        </Button>
      ) : isCanceled ? (
        <div className="space-y-2">
          <Button onClick={handleReactivate} disabled={isLoading} className="w-full">
            {isLoading ? 'Processing...' : 'Reactivate Subscription'}
          </Button>
          {subscriptionEndsAt && (
            <p className="text-xs text-center text-muted-foreground">
              Access until {new Date(subscriptionEndsAt).toLocaleDateString()}
            </p>
          )}
        </div>
      ) : (
        <Button onClick={handleSubscribe} disabled={isLoading} className="w-full">
          {isLoading ? 'Processing...' : 'Subscribe Now'}
        </Button>
      )}
    </div>
  );
}
