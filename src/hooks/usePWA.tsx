import { useState, useEffect, useCallback, useMemo } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const DISMISS_KEY = 'pwa-install-dismissed';
const DISMISS_DAYS = 7;

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  hasUpdate: boolean;
  isOnline: boolean;
  isIOSDevice: boolean;
  isAndroidDevice: boolean;
  isIOSSafari: boolean;
  isIOSNonSafari: boolean;
  canInstall: boolean;
  isDismissed: boolean;
}

interface PWAActions {
  promptInstall: () => Promise<boolean>;
  installUpdate: () => Promise<void>;
  dismissInstallPrompt: () => void;
  registerServiceWorker: () => Promise<void>;
}

export function usePWA(): PWAState & PWAActions {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroidDevice = /Android/.test(navigator.userAgent);
  const isInSafari = /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|OPiOS|FxiOS/.test(navigator.userAgent);
  const isIOSSafari = isIOSDevice && isInSafari;
  const isIOSNonSafari = isIOSDevice && !isInSafari;

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;

  useEffect(() => {
    setIsInstalled(isStandalone);
  }, [isStandalone]);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return;
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      setSwRegistration(registration);

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setHasUpdate(true);
            }
          });
        }
      });

      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'PROGRESS_SYNCED') {
          console.log('Progress data synced successfully');
        }
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setIsInstalling(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    registerServiceWorker();
  }, [registerServiceWorker]);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    try {
      setIsInstalling(true);
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      setIsInstalling(false);
      return false;
    } catch (error) {
      console.error('Install prompt failed:', error);
      setIsInstalling(false);
      return false;
    }
  }, [deferredPrompt]);

  const installUpdate = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      window.location.reload();
      return;
    }
    try {
      const registration = swRegistration || (await navigator.serviceWorker.getRegistration());
      if (!registration) { window.location.reload(); return; }
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        setHasUpdate(false);
      } else {
        try { await registration.update(); } catch (err) { console.error('SW update failed:', err); }
      }
    } finally {
      try {
        const currentReg = await navigator.serviceWorker.getRegistration();
        await currentReg?.unregister();
      } catch (err) { console.error('SW unregister failed:', err); }
      window.location.reload();
    }
  }, [swRegistration, setHasUpdate]);

  const dismissInstallPrompt = useCallback(() => {
    setIsInstallable(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  }, []);

  const isDismissed = useMemo(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (!dismissed) return false;
    const daysSince = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
    return daysSince < DISMISS_DAYS;
  }, []);

  const canInstall = useMemo(() => {
    if (isInstalled || isStandalone) return false;
    if (isDismissed) return false;
    return isInstallable || isIOSDevice;
  }, [isInstallable, isInstalled, isStandalone, isDismissed, isIOSDevice]);

  return {
    isInstallable,
    isInstalled,
    isInstalling,
    isStandalone,
    hasUpdate,
    isOnline,
    isIOSDevice,
    isAndroidDevice,
    isIOSSafari,
    isIOSNonSafari,
    canInstall,
    isDismissed,
    promptInstall,
    installUpdate,
    dismissInstallPrompt,
    registerServiceWorker
  };
}
