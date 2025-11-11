import { useState, useEffect } from "react";
import { AppProviders } from "@/config/providers";
import { AppRouter } from "@/config/router";
import { SplashScreen } from "@/components/SplashScreen";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hasShownSplash, setHasShownSplash] = useState(false);

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
