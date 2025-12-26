import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <section className="container mx-auto flex flex-col items-center justify-center space-y-8 py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <Badge className="text-sm bg-gradient-to-r from-primary to-secondary text-white border-0">
        ✈️ AI-Powered Vacation Planning
      </Badge>

      <div className="flex flex-col items-center space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Plan Your Perfect Vacation
          <br />
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">in Minutes, Not Hours</span>
        </h1>

        <p className="max-w-[42rem] text-lg leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          AI-powered itinerary planning that adapts to your style, budget, and interests. Say goodbye to vacation
          planning stress.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/sign-up">Start Planning Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="#how-it-works">See How It Works</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">No credit card required • Free forever</p>
      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 w-full max-w-4xl border-2 border-primary/20">
        <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-pulse"></div>
          <div className="relative z-10 text-center space-y-4">
            <div className="text-6xl">🏖️ ✈️ 🗺️</div>
            <p className="text-muted-foreground font-medium">Your Perfect Vacation Starts Here</p>
          </div>
        </div>
      </div>
    </section>
  );
}

