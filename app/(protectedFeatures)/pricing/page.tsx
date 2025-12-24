import { auth } from '@/features/auth/libs/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserSubscription } from '@/features/subscription/server/db';
import { PricingCard } from '@/components/pricing-card';
import { subscriptionTiers } from '@/data/subscriptionTiers';

export default async function PricingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/log-in');
  }

  const subscription = await getUserSubscription(session.user.id);

  const currentTier = subscription?.subscriptionTier || null;
  const subscriptionStatus = subscription?.subscriptionStatus;
  const subscriptionEndsAt = subscription?.subscriptionEndsAt;

  const isProActive =
    currentTier === 'Pro' &&
    subscriptionStatus === 'active' &&
    subscriptionEndsAt &&
    new Date(subscriptionEndsAt) > new Date();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground">
            {isProActive
              ? 'You are currently on the Pro plan'
              : 'Upgrade to Pro to unlock unlimited analyses and advanced features'}
          </p>
        </div>

        <div className="flex justify-center max-w-md mx-auto">
          {/* Pro Tier - Only tier available */}
          <PricingCard
            tier="Pro"
            name={subscriptionTiers.Pro.name}
            priceMonthly={subscriptionTiers.Pro.priceMonthly}
            priceAnnual={subscriptionTiers.Pro.priceAnnual}
            features={[
              'Up to 5 concurrent analyses',
              'Unlimited Reddit posts per analysis',
              'Advanced AI analysis (Claude Sonnet)',
              'Unlimited analyses',
              'Export detailed reports (PDF/JSON)',
              'Priority email support',
              'Early access to new features',
            ]}
            isCurrentPlan={isProActive ?? false}
            isCanceled={subscriptionStatus === 'canceled'}
            subscriptionEndsAt={subscriptionEndsAt ?? null}
          />
        </div>

        {subscriptionStatus === 'canceled' && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Your subscription is canceled and will end on{' '}
              {subscriptionEndsAt ? new Date(subscriptionEndsAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
