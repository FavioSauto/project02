import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({
  // pass client configuration here
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL as string,
});
