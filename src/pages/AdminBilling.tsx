import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Building2, CreditCard, Calendar, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface BusinessSubscription {
  id: string;
  name: string;
  stripe_customer_id: string | null;
  billing_email: string | null;
  subscription?: {
    id: string;
    plan_id: string;
    status: string;
    stripe_subscription_id: string | null;
    current_period_end: string;
    cancel_at_period_end: boolean;
  };
}

export default function AdminBilling() {
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['admin-billing'],
    queryFn: async () => {
      // Get all businesses with their subscriptions
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('id, name, stripe_customer_id, billing_email');

      if (businessError) throw businessError;

      // Get all subscriptions
      const { data: subscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select('*');

      if (subError) throw subError;

      // Map subscriptions to businesses
      const result: BusinessSubscription[] = businessData.map((business) => {
        const sub = subscriptions?.find((s) => s.business_id === business.id);
        return {
          ...business,
          subscription: sub ? {
            id: sub.id,
            plan_id: sub.plan_id,
            status: sub.status,
            stripe_subscription_id: sub.stripe_subscription_id,
            current_period_end: sub.current_period_end,
            cancel_at_period_end: sub.cancel_at_period_end || false,
          } : undefined,
        };
      });

      return result;
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-accent/10 text-accent border-accent/20">Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Past Due</Badge>;
      case 'canceled':
        return <Badge variant="secondary">Canceled</Badge>;
      default:
        return <Badge variant="outline">{status || 'None'}</Badge>;
    }
  };

  return (
    <AppLayout title="Admin: Subscription Overview">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{businesses?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Businesses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {businesses?.filter(b => b.subscription?.status === 'active').length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">
                    {businesses?.filter(b => b.subscription?.status === 'trialing').length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">In Trial</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">
                    {businesses?.filter(b => b.subscription?.status === 'past_due').length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Past Due</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Business Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Subscription ID</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Renewal Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businesses?.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{business.name}</p>
                          <p className="text-xs text-muted-foreground">{business.billing_email || '-'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {business.stripe_customer_id || 'Not set'}
                        </code>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {business.subscription?.stripe_subscription_id || 'Not set'}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize font-medium">
                          {business.subscription?.plan_id || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(business.subscription?.status || '')}
                        {business.subscription?.cancel_at_period_end && (
                          <span className="text-xs text-destructive ml-1">(canceling)</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {business.subscription?.current_period_end 
                          ? format(new Date(business.subscription.current_period_end), 'MMM d, yyyy')
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
