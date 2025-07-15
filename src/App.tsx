
import { AppProviders } from "@/config/providers";
import { AppRouter } from "@/config/router";

const App = () => {
  // EMERGENCY: Complete cache invalidation - v3.0
  console.log("🚨 EMERGENCY App component rendering - v3.0 EMERGENCY cache bust - " + Date.now());
  
  // Force clear all caches immediately
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
  }
  
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};

export default App;
