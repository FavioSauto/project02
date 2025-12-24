import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/features/auth/libs/auth';
import { checkRateLimit, SSE_IP_RATE_LIMIT } from '@/lib/rate-limiter';
import { db } from '@/drizzle/db';
import { user } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Middleware for route protection, subscription validation, and IP-based rate limiting
 *
 * Architecture:
 * - Authentication: better-auth provides session management (user ID, email, basic info)
 * - Subscription: Fresh data fetched directly from database on each request
 *   This ensures subscription changes are reflected immediately without cache staleness
 *
 * Route Access Logic:
 * - Public routes: / (root) - accessible to everyone
 * - Auth routes: /log-in, /sign-up
 *   - If NOT authenticated: allow access
 *   - If authenticated: redirect to /analyze
 * - Pricing route: /pricing - accessible to all authenticated users
 * - Protected routes: Everything else requires authentication AND active Pro subscription
 *   - If NOT authenticated: redirect to /log-in
 *   - If authenticated but no Pro subscription: redirect to /pricing
 *
 * Rate Limiting Strategy (Defense in Depth):
 * - Layer 1 (Middleware): Loose IP-based rate limiting for DDoS protection (50 req/10min per IP)
 *   Allows multiple users behind same IP (corporate networks, VPNs)
 * - Layer 2 (Route Handler): Strict user-based rate limiting after authentication (10 req/10min per user)
 *   Enforces per-user limits with tier awareness (Pro tier: 10 connections per 10 minutes)
 *
 * Note: Free tier has been removed - only Pro users can access protected features
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply loose IP-based rate limiting to SSE endpoints (DDoS protection only)
  // Note: Strict per-user rate limiting is enforced in the route handler after authentication
  if (pathname.startsWith('/api/analysis/progress/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    const { allowed, remaining, resetAt } = checkRateLimit(ip, SSE_IP_RATE_LIMIT);

    if (!allowed) {
      return new NextResponse('Too many requests from this IP. Please try again later.', {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(SSE_IP_RATE_LIMIT.maxRequests),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
        },
      });
    }

    // IP-based rate limit passed, proceed to route handler for authentication and user-based rate limiting
    return NextResponse.next({
      headers: {
        'X-IP-RateLimit-Limit': String(SSE_IP_RATE_LIMIT.maxRequests),
        'X-IP-RateLimit-Remaining': String(remaining),
        'X-IP-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
      },
    });
  }

  // Auth routes that should redirect to dashboard if user is authenticated
  const authRoutes = ['/log-in', '/sign-up'];

  // Allow access to API auth endpoints
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check authentication using better-auth
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (session && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/analyze', request.url));
    }

    // Allow access to root page without authentication
    if (pathname === '/') {
      return NextResponse.next();
    }

    // Allow access to auth routes without authentication
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // Redirect to login if not authenticated (for protected routes)
    if (!session) {
      const loginUrl = new URL('/log-in', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Fetch fresh subscription data directly from database
    // This ensures we always have the latest subscription status
    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: {
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionEndsAt: true,
      },
    });

    const tier = userData?.subscriptionTier ?? null;
    const status = userData?.subscriptionStatus ?? null;
    const endsAt = userData?.subscriptionEndsAt ?? null;

    // Check if subscription is active
    const isSubscriptionActive = tier === 'Pro' && status === 'active' && endsAt && new Date(endsAt) > new Date();

    // Allow access to pricing page for authenticated users (even without subscription)
    if (pathname === '/pricing') {
      return NextResponse.next();
    }

    // For all other protected routes, require active Pro subscription
    if (!isSubscriptionActive) {
      // Redirect to pricing page for users without active Pro subscription
      const pricingUrl = new URL('/pricing', request.url);
      pricingUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(pricingUrl);
    }

    // Allow access to protected routes for Pro users
    return NextResponse.next();
  } catch (error) {
    // If session validation fails (expired, invalid, or any other error),
    // clear the session and redirect to login page
    if (!authRoutes.includes(pathname) && pathname !== '/') {
      const loginUrl = new URL('/log-in', request.url);
      loginUrl.searchParams.set('redirect', pathname);

      // Create response with redirect
      const response = NextResponse.redirect(loginUrl);

      // Clear all Better Auth session cookies to force logout
      response.cookies.delete('better-auth.session_token');
      response.cookies.delete('better-auth.csrf_token');

      return response;
    }

    // Allow access to auth routes and root on error, but clear cookies
    const response = NextResponse.next();
    response.cookies.delete('better-auth.session_token');
    response.cookies.delete('better-auth.csrf_token');

    return response;
  }
}

/**
 * Matcher configuration
 * Excludes static files and Next.js internal routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, svgs, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
