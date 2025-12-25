import { AppSidebar } from '@/components/blocks/sidebars/simple-actions-sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/features/auth/libs/auth';
import { headers } from 'next/headers';
import { getUserSubscription } from '@/features/subscription/server/db';
import { getUserOnboardingStatus } from '@/features/vacation-planner/server/db';
import { AuthErrorBoundary } from '@/components/auth-error-boundary';
import { SiteHeader } from '@/components/blocks/sidebars/simple-actions-sidebar/site-header';
import { redirect } from 'next/navigation';

export default async function ProtectedFeaturesLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  let subscriptionTier = null;

  if (session?.user) {
    const subscription = await getUserSubscription(session.user.id);
    subscriptionTier = subscription?.subscriptionTier || null;

    const onboardingStatus = await getUserOnboardingStatus(session.user.id);
    const currentPath = (await headers()).get('x-pathname') || '';
    
    if (onboardingStatus && !onboardingStatus.hasCompletedOnboarding && !currentPath.includes('/onboarding')) {
      redirect('/onboarding');
    }
  }

  const userData = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image,
      }
    : null;

  return (
    <AuthErrorBoundary>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" user={userData} subscriptionTier={subscriptionTier} />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthErrorBoundary>
  );
}
