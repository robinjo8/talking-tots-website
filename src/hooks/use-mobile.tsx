
import * as React from "react";

// Set breakpoint for mobile devices
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Start with undefined to avoid hydration issues
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window === 'undefined') return;
    
    // Set initial value immediately
    const checkMobile = () => window.innerWidth < MOBILE_BREAKPOINT;
    setIsMobile(checkMobile());
    
    // Create handler function
    const handleResize = () => {
      setIsMobile(checkMobile());
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ?? false;
}
