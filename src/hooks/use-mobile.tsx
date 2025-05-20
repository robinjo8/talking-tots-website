
import * as React from "react";

// Set breakpoint for mobile devices
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Start with undefined to avoid hydration issues
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window === 'undefined') return;
    
    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    // Create handler function
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
