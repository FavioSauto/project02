import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/drizzle/db'; // your drizzle instance
import { user, session, account, verification } from '@/drizzle/schema';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or other dbs
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
});
