'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
import { SignUpSchema } from '@/features/auth/schemas';

export function SignUpForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const { isSubmitting } = form.formState;

  async function signUpWithEmail(values: z.infer<typeof SignUpSchema>) {
    try {
      await authClient.signUp.email(values, {
        onSuccess: function onSignUpSuccess() {
          router.push('/dashboard');
        },
      });
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to sign up. Please try again.');
      toast.error(message);
    }
  }

  async function handleSignUpWithGoogle() {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to start Google sign in. Please try again.');
      toast.error(message);
    }
  }

  async function handleSubmitForm(values: z.infer<typeof SignUpSchema>) {
    await signUpWithEmail(values);
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Enter your email below to sign up</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitForm)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={function renderNameField({ field }) {
                    return (
                      <FormItem className="grid gap-3">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
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
                <FormField
                  control={form.control}
                  name="password"
                  render={function renderPasswordField({ field }) {
                    return (
                      <FormItem className="grid gap-3">
                        <div className="flex items-center">
                          <FormLabel>Password</FormLabel>
                          <Link href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
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
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Sign up
                  </Button>
                  <Button variant="outline" className="w-full" type="button" onClick={handleSignUpWithGoogle}>
                    Sign up with Google
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link href="/log-in" className="underline underline-offset-4">
                  Log in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
