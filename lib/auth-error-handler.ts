/**
 * Client-side Better Auth error handler
 *
 * Handles authentication errors by logging out the user and redirecting to login page
 * This ensures consistency between server-side (middleware) and client-side error handling
 */

import { authClient } from '@/features/auth/libs/auth-client';

/**
 * Checks if an error is a Better Auth session error that requires logout
 *
 * @param error - The error to check
 * @returns true if the error is a session-related auth error
 */
function isAuthSessionError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  const errorMessage = error instanceof Error ? error.message : String(error);

  // Check for common session error patterns
  const sessionErrorPatterns = [
    'INTERNAL_SERVER_ERROR',
    'Failed query',
    'session',
    'Unauthorized',
    'Invalid session',
    'Session expired',
  ];

  return sessionErrorPatterns.some((pattern) => errorMessage.toLowerCase().includes(pattern.toLowerCase()));
}

/**
 * Handles authentication errors by logging out and redirecting to login
 *
 * @param error - The error that occurred
 * @param currentPath - Optional current path to redirect back to after login
 */
export async function handleAuthError(error: unknown, currentPath?: string): Promise<void> {
  if (!isAuthSessionError(error)) {
    return;
  }

  try {
    // Attempt to sign out through Better Auth client
    await authClient.signOut({
      fetchOptions: {
        onError: () => {
          // Ignore signOut errors, we'll redirect anyway
        },
      },
    });
  } catch (signOutError) {
    // Ignore signOut errors, proceed with redirect
  }

  // Redirect to login page
  const loginUrl = new URL('/log-in', window.location.origin);

  if (currentPath && currentPath !== '/log-in' && currentPath !== '/sign-up') {
    loginUrl.searchParams.set('redirect', currentPath);
  }

  window.location.href = loginUrl.toString();
}

/**
 * Wraps an async function with auth error handling
 * Useful for wrapping client-side operations that might fail due to session issues
 *
 * @param fn - The async function to wrap
 * @param currentPath - Optional current path for redirect
 * @returns The wrapped function
 */
export function withAuthErrorHandling<T extends (...args: any[]) => Promise<any>>(fn: T, currentPath?: string): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      await handleAuthError(error, currentPath);
      throw error;
    }
  }) as T;
}
