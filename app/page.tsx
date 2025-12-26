import { Suspense } from 'react';
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { TrustIndicators } from '@/components/landing/trust-indicators';
import { FeaturesGrid } from '@/components/landing/features-grid';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Testimonials } from '@/components/landing/testimonials';
import { PricingCards } from '@/components/landing/pricing-cards';
import { FinalCTA } from '@/components/landing/final-cta';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustIndicators />
        <FeaturesGrid />
        <HowItWorks />
        <Suspense fallback={<div className="container py-16 md:py-24" />}>
          <Testimonials />
        </Suspense>
        <PricingCards />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
