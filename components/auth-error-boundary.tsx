'use client';

import { Component } from 'react';
import type { ReactNode } from 'react';
import { handleAuthError } from '@/lib/auth-error-handler';

interface AuthErrorBoundaryProps {
  children: ReactNode;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary that catches unhandled authentication errors
 * and redirects users to the login page
 *
 * This provides a safety net for any auth errors that weren't caught
 * by individual components or actions
 */
export class AuthErrorBoundary extends Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    // Handle auth errors by redirecting to login
    handleAuthError(error, window.location.pathname).catch(() => {
      // If handleAuthError doesn't trigger a redirect (not an auth error),
      // we'll show the error state below
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4 text-center">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground">We encountered an error. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
