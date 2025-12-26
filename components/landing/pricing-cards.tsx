import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconCheck } from '@tabler/icons-react';
import { subscriptionTiers } from '@/data/subscriptionTiers';

export function PricingCards() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-gradient-to-br from-accent/5 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Simple, Transparent Pricing
          </h2>
        <p className="max-w-[42rem] text-lg text-muted-foreground">
          Start free, upgrade when you need more. No hidden fees, cancel anytime.
        </p>
      </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        <Card className="relative">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Perfect for trying out VacationPlanner</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/forever</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">
                  {subscriptionTiers.Free.maxNumberOfShoppingLists} vacation plan
                </span>
              </li>
              <li className="flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">
                  Up to {subscriptionTiers.Free.maxNumberOfItemsPerShoppingList} activities per plan
                </span>
              </li>
              <li className="flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">Smart scheduling</span>
              </li>
              <li className="flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">Basic recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">Drag & drop planning</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/sign-up">Start Free</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="relative border-2 border-primary shadow-xl">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white border-0">🌟 Most Popular</Badge>
          <CardHeader>
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription>For serious travelers and trip planners</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">${subscriptionTiers.Pro.priceMonthly}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground">or ${subscriptionTiers.Pro.priceAnnual}/year (save 17%)</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-semibold">Unlimited vacation plans</span>
              </li>
              <li className="flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-semibold">Unlimited activities</span>
              </li>
              <li className="flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">Advanced AI recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">Hidden gems discovery</span>
              </li>
              <li className="flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">Trip analytics & insights</span>
              </li>
              <li className="flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">Export & sharing features</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/sign-up">Upgrade to Pro</Link>
            </Button>
          </CardFooter>
        </Card>
        </div>
      </div>
    </section>
  );
}

