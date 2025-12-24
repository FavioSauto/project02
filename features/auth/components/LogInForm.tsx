'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn, getErrorMessage } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { authClient } from '@/features/auth/libs/auth-client';
import { LoginSchema } from '@/features/auth/schemas';

export function LogInForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/analyze';
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { isSubmitting } = form.formState;

  async function logInWithEmail(values: z.infer<typeof LoginSchema>) {
    try {
      await authClient.signIn.email(values, {
        onSuccess: function onLogInSuccess() {
          router.push(redirectTo);
        },
        onError: function onLogInError(error) {
          const message = getErrorMessage(error, 'Unable to log in. Please try again.');
          setAuthError(message);
        },
      });
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to log in. Please try again.');
      toast.error(message);
    }
  }

  async function handleLogInWithGoogle() {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: redirectTo,
      });
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to start Google sign in. Please try again.');
      toast.error(message);
    }
  }

  async function handleSubmitForm(values: z.infer<typeof LoginSchema>) {
    await logInWithEmail(values);
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Log In</CardTitle>
          <CardDescription>Enter your email below to log in</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitForm)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={function renderEmailField({ field }) {
                    return (
                      <FormItem className="grid gap-3">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={function renderPasswordField({ field }) {
                      return (
                        <FormItem className="grid gap-3">
                          <div className="flex items-center">
                            <FormLabel>Password</FormLabel>
                            <Link
                              href="#"
                              className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-muted-foreground"
                            >
                              Forgot your password?
                            </Link>
                          </div>
                          <FormControl>
                            <Input type="password" placeholder="Password" required {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  {authError && <FormMessage className="text-destructive text-sm p-0">{authError}</FormMessage>}
                </div>

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Log In
                  </Button>
                  <Button variant="outline" className="w-full" type="button" onClick={handleLogInWithGoogle}>
                    Log In with Google
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
