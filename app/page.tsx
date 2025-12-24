import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="text-sm">
            Production-Ready Template
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">Build & Ship Faster</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            A modern, opinionated Next.js template designed for developers who want to ship production-ready web
            applications quickly without sacrificing code quality or architecture.
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-4">
            <Button asChild size="lg">
              <Link href="/dashboard">Explore Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/log-in">Try Authentication</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Next.js 15 App Router</CardTitle>
              <CardDescription>Latest features & performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built on Next.js 15 with App Router, React Server Components, and Turbopack for blazing-fast development
                and optimal production performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Better Auth</CardTitle>
              <CardDescription>Secure authentication out of the box</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Integrated better-auth with email/password, social providers, and session management. Secure, type-safe,
                and production-ready from day one.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strict Architecture</CardTitle>
              <CardDescription>Feature-based organization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Enforced project structure with feature modules, clear separation of concerns, and organizational
                patterns that scale with your application.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>TypeScript Strict Mode</CardTitle>
              <CardDescription>End-to-end type safety</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Full TypeScript strict mode enabled with Zod schemas for runtime validation, comprehensive type
                definitions, and zero type errors tolerated.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modern UI Stack</CardTitle>
              <CardDescription>Beautiful components ready to use</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Shadcn UI with Radix primitives and Tailwind CSS. Accessible, customizable, and professionally designed
                components for rapid UI development.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zustand + Drizzle ORM</CardTitle>
              <CardDescription>State & database management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Lightweight state management with Zustand and type-safe database operations with Drizzle ORM. Simple,
                performant, and scalable.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testing Infrastructure</CardTitle>
              <CardDescription>Jest & React Testing Library</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive testing setup with Jest and React Testing Library. Write confident, maintainable tests for
                your entire application.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>i18n Ready</CardTitle>
              <CardDescription>Multi-language support built-in</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Internationalization with next-i18next configured out of the box. Support multiple languages and locales
                from day one.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Developer Experience</CardTitle>
              <CardDescription>Optimized for productivity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                ESLint, Prettier, strict TypeScript rules, and comprehensive Cursor rules for AI-assisted development.
                Everything configured for optimal DX.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/50 rounded-lg p-8 sm:p-10 space-y-6 mb-16">
          <h2 className="text-3xl font-bold">Why This Template?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Stop Configuring, Start Building</h3>
              <p className="text-sm">
                Skip the hours of setup, configuration, and architectural decisions. This template provides a
                battle-tested foundation so you can focus on building features that matter to your users.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Opinionated & Proven</h3>
              <p className="text-sm">
                Based on years of production experience, this template enforces best practices through strict rules and
                clear patterns. Build maintainable applications that scale.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Performance First</h3>
              <p className="text-sm">
                Server Components by default, optimized images, code splitting, and caching strategies built-in. Your
                applications will be fast from day one.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Production Ready</h3>
              <p className="text-sm">
                Authentication, database, error handling, validation, testing, and deployment configuration all
                included. Go from zero to production in record time.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Building?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Clone this template and start shipping features instead of configuring boilerplate. Everything you need is
            already set up and ready to go.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg">
              <Link href="/dashboard">View Dashboard Example</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sign-up">Create an Account</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
