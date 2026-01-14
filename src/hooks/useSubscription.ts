import { useState, useEffect, useCallback, useRef } from 'react';
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
    isLoading: true,
    isTrialing: false,
    trialEnd: null,
  });
  
  // Track if we've already checked for this user ID
  const lastCheckedUserIdRef = useRef<string | null>(null);
  // Prevent concurrent checks
  const isCheckingRef = useRef(false);

  const checkSubscription = useCallback(async () => {
    // Prevent concurrent checks
    if (isCheckingRef.current) {
      console.log('Subscription check already in progress, skipping');
      return;
    }

    if (!user || !session?.access_token) {
      console.log('No user or session, setting not subscribed');
      setSubscription({
        isSubscribed: false,
        planId: null,
        productId: null,
        subscriptionEnd: null,
        isLoading: false,
        isTrialing: false,
        trialEnd: null,
      });
      return;
    }

    // Skip if we already checked for this user (and not in initial loading state)
    if (lastCheckedUserIdRef.current === user.id && !subscription.isLoading) {
      console.log('Already checked subscription for this user, skipping');
      return;
    }

    isCheckingRef.current = true;
    setSubscription(prev => ({ ...prev, isLoading: true }));

    try {
      console.log('Checking subscription for user:', user.id);
      
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
      
      // Mark as checked for this user
      lastCheckedUserIdRef.current = user.id;

      console.log('Subscription check result:', { 
        subscribed: data.subscribed, 
        planId: plan?.id,
        isTrialing: data.isTrialing 
      });

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
    } finally {
      isCheckingRef.current = false;
    }
  }, [user, session?.access_token, subscription.isLoading]);

  // Check subscription when user and session are available
  useEffect(() => {
    // If no user, immediately set not loading
    if (!user) {
      setSubscription(prev => {
        if (prev.isLoading) {
          return { ...prev, isLoading: false };
        }
        return prev;
      });
      lastCheckedUserIdRef.current = null;
      return;
    }

    // Wait for session to be available
    if (!session?.access_token) {
      return;
    }

    // Check subscription with a small delay to let auth stabilize
    const timeoutId = setTimeout(() => {
      checkSubscription();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [user?.id, session?.access_token, checkSubscription]);

  // Periodic refresh every 60 seconds
  useEffect(() => {
    if (!user || !session?.access_token) return;

    const interval = setInterval(() => {
      // Reset lastCheckedUserId to force a refresh
      lastCheckedUserIdRef.current = null;
      checkSubscription();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [user?.id, session?.access_token, checkSubscription]);

  return {
    ...subscription,
    refreshSubscription: checkSubscription,
  };
}
