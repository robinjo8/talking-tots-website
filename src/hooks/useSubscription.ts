import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getPlanByProductId, type PlanId } from '@/config/pricing';

export interface SubscriptionState {
  isSubscribed: boolean;
  planId: PlanId | null;
  productId: string | null;
  subscriptionEnd: string | null;
  isLoading: boolean;
  isTrialing: boolean;
  trialEnd: string | null;
}

export function useSubscription() {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionState>({
    isSubscribed: false,
    planId: null,
    productId: null,
    subscriptionEnd: null,
    isLoading: true, // Start as loading to block access until check completes
    isTrialing: false,
    trialEnd: null,
  });

  const checkSubscription = useCallback(async () => {
    if (!user || !session) {
      setSubscription({
        isSubscribed: false,
        planId: null,
        productId: null,
        subscriptionEnd: null,
        isLoading: false, // Important: set loading to false when no session
        isTrialing: false,
        trialEnd: null,
      });
      return;
    }

    setSubscription(prev => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscription(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const plan = data.productId ? getPlanByProductId(data.productId) : null;

      setSubscription({
        isSubscribed: data.subscribed || false,
        planId: plan?.id || null,
        productId: data.productId || null,
        subscriptionEnd: data.subscriptionEnd || null,
        isLoading: false,
        isTrialing: data.isTrialing || false,
        trialEnd: data.trialEnd || null,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription(prev => ({ ...prev, isLoading: false }));
    }
  }, [user, session]);

  // Check subscription on mount and when user changes
  useEffect(() => {
    // Always call checkSubscription - it handles the no-session case internally
    checkSubscription();
  }, [user, session, checkSubscription]);

  // Periodic refresh every 60 seconds
  useEffect(() => {
    if (!user || !session) return;

    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, session, checkSubscription]);

  return {
    ...subscription,
    refreshSubscription: checkSubscription,
  };
}
