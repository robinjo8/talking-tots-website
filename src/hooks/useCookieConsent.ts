import { useState, useEffect, useCallback } from 'react';

export type CookieConsentStatus = 'pending' | 'accepted' | 'rejected';

interface CookieConsent {
  status: CookieConsentStatus;
  timestamp: string | null;
  necessary: boolean; // Always true - required for app to work
  functional: boolean;
  analytics: boolean;
  performance: boolean;
  marketing: boolean;
}

const CONSENT_KEY = 'tomitalk-cookie-consent';

const defaultConsent: CookieConsent = {
  status: 'pending',
  timestamp: null,
  necessary: true,
  functional: false,
  analytics: false,
  performance: false,
  marketing: false,
};

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent>(defaultConsent);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CookieConsent;
        setConsent(parsed);
      }
    } catch (error) {
      console.error('Error loading cookie consent:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save consent to localStorage
  const saveConsent = useCallback((newConsent: CookieConsent) => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent));
      setConsent(newConsent);
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  }, []);

  // Accept all cookies
  const acceptAll = useCallback(() => {
    const newConsent: CookieConsent = {
      status: 'accepted',
      timestamp: new Date().toISOString(),
      necessary: true,
      functional: true,
      analytics: true,
      performance: true,
      marketing: true,
    };
    saveConsent(newConsent);
  }, [saveConsent]);

  // Reject all - only necessary cookies
  const rejectAll = useCallback(() => {
    const newConsent: CookieConsent = {
      status: 'rejected',
      timestamp: new Date().toISOString(),
      necessary: true,
      functional: false,
      analytics: false,
      performance: false,
      marketing: false,
    };
    saveConsent(newConsent);
  }, [saveConsent]);

  // Save custom preferences
  const saveCustomPreferences = useCallback((preferences: {
    functional: boolean;
    analytics: boolean;
    performance: boolean;
    marketing: boolean;
  }) => {
    const newConsent: CookieConsent = {
      status: 'accepted',
      timestamp: new Date().toISOString(),
      necessary: true,
      ...preferences,
    };
    saveConsent(newConsent);
  }, [saveConsent]);

  // Reset consent (for testing or if user wants to change)
  const resetConsent = useCallback(() => {
    try {
      localStorage.removeItem(CONSENT_KEY);
      setConsent(defaultConsent);
    } catch (error) {
      console.error('Error resetting cookie consent:', error);
    }
  }, []);

  // Check if we should show the banner
  // TODO: Vrni nazaj na: isLoaded && consent.status === 'pending'
  const showBanner = isLoaded; // TESTNI NAČIN - vedno prikaži

  return {
    consent,
    isLoaded,
    showBanner,
    acceptAll,
    rejectAll,
    saveCustomPreferences,
    resetConsent,
    // Helper functions to check specific consent
    hasAnalyticsConsent: consent.analytics,
    hasMarketingConsent: consent.marketing,
    hasFunctionalConsent: consent.functional,
    hasPerformanceConsent: consent.performance,
  };
}
