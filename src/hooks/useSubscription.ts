import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { type PlanId } from '@/config/pricing';

export interface SubscriptionState {
  isSubscribed: boolean;
  planId: PlanId | null;
  productId: string | null;
  subscriptionEnd: string | null;
  isLoading: boolean;
  isTrialing: boolean;
  trialEnd: string | null;
}

const defaultState: SubscriptionState = {
  isSubscribed: false,
  planId: null,
  productId: null,
  subscriptionEnd: null,
  isLoading: true,
  isTrialing: false,
  trialEnd: null,
};

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionState>(defaultState);
  
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

    if (!user) {
      console.log('No user, setting not subscribed');
      setSubscription(prev => {
        if (prev.isLoading || prev.isSubscribed) {
          return { ...defaultState, isLoading: false };
        }
        return prev;
      });
      return;
    }

    // Skip if we already checked for this user
    if (lastCheckedUserIdRef.current === user.id) {
      console.log('Already checked subscription for this user, skipping');
      return;
    }

    isCheckingRef.current = true;
    setSubscription(prev => ({ ...prev, isLoading: true }));

    try {
      console.log('Checking subscription for user:', user.id);
      
      // 1. Check if user is a logopedist - they get automatic Pro access
      const { data: logopedistProfile } = await supabase
        .from('logopedist_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (logopedistProfile) {
        console.log('User is logopedist, granting Pro access');
        lastCheckedUserIdRef.current = user.id;
        setSubscription({
          isSubscribed: true,
          planId: 'pro',
          productId: null,
          subscriptionEnd: null,
          isLoading: false,
          isTrialing: false,
          trialEnd: null,
        });
        isCheckingRef.current = false;
        return;
      }
      
      // 2. Read subscription from database (NOT Stripe API!)
      const { data: sub, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription from database:', error);
        setSubscription({ ...defaultState, isLoading: false });
        isCheckingRef.current = false;
        return;
      }

      // Mark as checked for this user
      lastCheckedUserIdRef.current = user.id;

      // No subscription record or inactive/canceled
      if (!sub || sub.status === 'inactive') {
        console.log('No active subscription found in database');
        setSubscription({ ...defaultState, isLoading: false });
        isCheckingRef.current = false;
        return;
      }

      // Determine subscription state
      const isActive = sub.status === 'active' || sub.status === 'trialing';
      const isCanceled = sub.status === 'canceled' || sub.cancel_at_period_end;
      
      // If canceled but still in period, show as subscribed until period ends
      const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;
      const isStillInPeriod = periodEnd && periodEnd > new Date();
      
      const isSubscribed = isActive || (isCanceled && isStillInPeriod);

      console.log('Subscription check result:', { 
        status: sub.status,
        planId: sub.plan_id,
        isSubscribed,
        isTrialing: sub.status === 'trialing',
        cancelAtPeriodEnd: sub.cancel_at_period_end
      });

      setSubscription({
        isSubscribed,
        planId: (sub.plan_id as PlanId) || null,
        productId: sub.stripe_product_id || null,
        subscriptionEnd: sub.current_period_end || null,
        isLoading: false,
        isTrialing: sub.status === 'trialing',
        trialEnd: sub.trial_end || null,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription({ ...defaultState, isLoading: false });
    } finally {
      isCheckingRef.current = false;
    }
  }, [user]);

  // Force refresh subscription (e.g., after checkout)
  const refreshSubscription = useCallback(async () => {
    // Reset the last checked user ID to force a re-check
    lastCheckedUserIdRef.current = null;
    await checkSubscription();
  }, [checkSubscription]);

  // Check subscription when user is available
  useEffect(() => {
    if (!user) {
      setSubscription(prev => {
        if (prev.isLoading) {
          return { ...defaultState, isLoading: false };
        }
        return prev;
      });
      lastCheckedUserIdRef.current = null;
      return;
    }

    // Check subscription with a small delay to let auth stabilize
    const timeoutId = setTimeout(() => {
      checkSubscription();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [user?.id, checkSubscription]);

  return {
    ...subscription,
    refreshSubscription,
  };
}
