
import * as React from "react";

// Set breakpoint for mobile devices
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Initialize with correct value to prevent hydration issues
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });

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

const TABLET_BREAKPOINT = 1024;

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT;
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsTablet(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isTablet;
}
