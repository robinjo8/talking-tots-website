// Clean rebuild - 2025-01-18 16:50
import { useState, useEffect } from "react";
import { AppProviders } from "@/config/providers";
import { AppRouter } from "@/config/router";
import { SplashScreen } from "@/components/SplashScreen";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hasShownSplash, setHasShownSplash] = useState(false);

  // Service Worker update listener - notify user instead of auto-refresh
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Check for updates periodically
        registration.update();
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[App] New service worker installed - user will be notified via UpdatePrompt');
                // Don't auto-reload - let UpdatePrompt handle it
              }
            });
          }
        });
      }).catch(err => {
        console.warn('[App] Service worker ready failed:', err);
      });
    }
  }, []);

  useEffect(() => {
    // Temporarily disabled to always show splash screen for testing
    // const splashShown = sessionStorage.getItem("splashShown");
    // if (splashShown === "true") {
    //   setShowSplash(false);
    //   setHasShownSplash(true);
    // }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasShownSplash(true);
    sessionStorage.setItem("splashShown", "true");
  };

  return (
    <AppProviders>
      {showSplash && !hasShownSplash && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
      <AppRouter />
    </AppProviders>
  );
};

export default App;
