import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Loader2 } from 'lucide-react';

interface SubscriptionRouteProps {
  children: React.ReactNode;
}

export function SubscriptionRoute({ children }: SubscriptionRouteProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { data: subscription, isLoading: subLoading } = useSubscription();
  const location = useLocation();

  // Show loading while checking auth or subscription
  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check subscription status - allow trialing and active users
  const hasActiveSubscription = subscription && 
    (subscription.status === 'active' || subscription.status === 'trialing');

  // If no active subscription, redirect to billing page
  if (!hasActiveSubscription) {
    // Avoid redirect loop if already on allowed pages
    const allowedPaths = ['/billing', '/app-settings', '/dashboard'];
    if (allowedPaths.includes(location.pathname)) {
      return <>{children}</>;
    }
    return <Navigate to="/billing" state={{ from: location, reason: 'subscription' }} replace />;
  }

  return <>{children}</>;
}
