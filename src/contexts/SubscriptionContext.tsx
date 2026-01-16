// Subscription context with safe fallback for SSR/initial render
import { createContext, useContext, ReactNode } from 'react';
import { useSubscription, SubscriptionState } from '@/hooks/useSubscription';
import { PlanId } from '@/config/pricing';

export interface SubscriptionContextType extends SubscriptionState {
  refreshSubscription: () => Promise<void>;
  // Helper functions
  isPro: boolean;
  isStartOrPlus: boolean;
  canAccessPremiumFeatures: boolean;
  canAccessProFeatures: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Pro-only features (require TomiTalk Pro)
export const PRO_ONLY_FEATURES = ['test', 'challenges'] as const;
export type ProOnlyFeature = typeof PRO_ONLY_FEATURES[number];

// Feature ID to readable name mapping
export const FEATURE_NAMES: Record<ProOnlyFeature, string> = {
  test: 'Preverjanje izgovorjave',
  challenges: 'Moji izzivi'
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const subscription = useSubscription();
  
  // Derive helper values
  const isPro = subscription.planId === 'pro';
  const isStartOrPlus = subscription.planId === 'start' || subscription.planId === 'plus';
  const canAccessPremiumFeatures = subscription.isSubscribed;
  const canAccessProFeatures = isPro;
  
  const value: SubscriptionContextType = {
    ...subscription,
    isPro,
    isStartOrPlus,
    canAccessPremiumFeatures,
    canAccessProFeatures,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    // Return safe defaults instead of throwing - this can happen during SSR or initial render
    console.warn('useSubscriptionContext called outside SubscriptionProvider, returning defaults');
    return {
      isSubscribed: false,
      planId: null,
      productId: null,
      subscriptionEnd: null,
      isLoading: true,
      isTrialing: false,
      trialEnd: null,
      refreshSubscription: async () => {},
      isPro: false,
      isStartOrPlus: false,
      canAccessPremiumFeatures: false,
      canAccessProFeatures: false,
    } as SubscriptionContextType;
  }
  return context;
}

// Helper hook to check if a specific feature is accessible
export function useFeatureAccess(featureId: string): {
  canAccess: boolean;
  requiredPlan: 'pro' | 'any' | null;
  message: string;
} {
  const { isSubscribed, isPro, planId } = useSubscriptionContext();
  
  const isProOnly = PRO_ONLY_FEATURES.includes(featureId as ProOnlyFeature);
  
  if (!isSubscribed) {
    return {
      canAccess: false,
      requiredPlan: 'any',
      message: 'Za dostop potrebujete naročniški paket.'
    };
  }
  
  if (isProOnly && !isPro) {
    return {
      canAccess: false,
      requiredPlan: 'pro',
      message: 'Na voljo v TomiTalk Pro'
    };
  }
  
  return {
    canAccess: true,
    requiredPlan: null,
    message: ''
  };
}
