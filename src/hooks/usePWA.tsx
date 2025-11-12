import { useState, useEffect, useCallback, useMemo } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  hasUpdate: boolean;
  isOnline: boolean;
  isIOSDevice: boolean;
  isAndroidDevice: boolean;
  canInstall: boolean;
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
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Detect if running on iOS
  const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  // Detect if running on Android
  const isAndroidDevice = /Android/.test(navigator.userAgent);
  
  // Detect if running in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;

  // Check if app is already installed
  useEffect(() => {
    setIsInstalled(isStandalone);
  }, [isStandalone]);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      setSwRegistration(registration);
      console.log('Service worker registered successfully:', registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setHasUpdate(true);
              console.log('PWA Update detected:', {
                isStandalone: window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true,
                hasUpdate: true,
                timestamp: new Date().toISOString()
              });
            }
          });
        }
      });

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'PROGRESS_SYNCED') {
          console.log('Progress data synced successfully');
        }
      });

    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }, []);

  // Handle beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle app installation
  useEffect(() => {
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Monitor online/offline status
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

  // Register service worker on mount
  useEffect(() => {
    registerServiceWorker();
  }, [registerServiceWorker]);

  // Prompt user to install the app
  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  }, [deferredPrompt]);

  // Install app update
  const installUpdate = useCallback(async () => {
    if (!swRegistration || !hasUpdate) {
      return;
    }

    const waitingWorker = swRegistration.waiting;
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setHasUpdate(false);
      
      // Reload page to activate new service worker
      window.location.reload();
    }
  }, [swRegistration, hasUpdate]);

  // Dismiss install prompt
  const dismissInstallPrompt = useCallback(() => {
    setIsInstallable(false);
    
    // Store user preference to not show again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  }, []);

  // Check if we can show install prompt (not dismissed recently)
  const canInstall = useMemo(() => {
    if (!isInstallable || isInstalled) return false;
    
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      return daysSinceDismissed > 3; // Show again after 3 days
    }
    
    return true;
  }, [isInstallable, isInstalled]);

  return {
    // State
    isInstallable,
    isInstalled,
    isStandalone,
    hasUpdate,
    isOnline,
    isIOSDevice,
    isAndroidDevice,
    canInstall,
    // Actions
    promptInstall,
    installUpdate,
    dismissInstallPrompt,
    registerServiceWorker
  };
}

// Hook for iOS-specific install instructions
export function useIOSInstallInstructions() {
  const [showInstructions, setShowInstructions] = useState(false);
  const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInSafari = /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|OPiOS|FxiOS/.test(navigator.userAgent);
  const isStandalone = (window.navigator as any).standalone === true;

  useEffect(() => {
    // Show iOS instructions if on iOS Safari and not installed
    if (isIOSDevice && isInSafari && !isStandalone) {
      const dismissed = localStorage.getItem('ios-install-dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setShowInstructions(true);
        }, 3000); // Show after 3 seconds

        return () => clearTimeout(timer);
      }
    }
  }, [isIOSDevice, isInSafari, isStandalone]);

  const dismissInstructions = useCallback(() => {
    setShowInstructions(false);
    localStorage.setItem('ios-install-dismissed', Date.now().toString());
  }, []);

  return {
    showInstructions,
    dismissInstructions,
    isIOSDevice,
    isInSafari,
    canShowInstructions: isIOSDevice && isInSafari && !isStandalone
  };
}