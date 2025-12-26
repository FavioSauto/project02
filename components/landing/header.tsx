import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2" aria-label="VacationPlanner Home">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">VacationPlanner</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium" aria-label="Main navigation">
          <Link
            href="#features"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Pricing
          </Link>
          <Link
            href="#testimonials"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Testimonials
          </Link>
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/log-in">Log In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/sign-up">
              <span className="hidden sm:inline">Start Planning Free</span>
              <span className="sm:hidden">Sign Up</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

