import { useState, useEffect } from 'react';

interface MobileState {
  isMobile: boolean;
  isLandscape: boolean;
  canFullscreen: boolean;
  isFullscreen: boolean;
  screenWidth: number;
  screenHeight: number;
}

const MOBILE_BREAKPOINT = 768;

export function useEnhancedMobile() {
  const [mobileState, setMobileState] = useState<MobileState>({
    isMobile: false,
    isLandscape: false,
    canFullscreen: false,
    isFullscreen: false,
    screenWidth: 0,
    screenHeight: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateMobileState = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT || 
                      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                      'ontouchstart' in window;
      
      const isLandscape = window.innerWidth > window.innerHeight;
      const canFullscreen = !!(document.documentElement.requestFullscreen);
      const isFullscreen = !!document.fullscreenElement;

      setMobileState({
        isMobile,
        isLandscape,
        canFullscreen,
        isFullscreen,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
      });
    };

    // Initial state
    updateMobileState();

    // Event listeners
    const handleResize = () => updateMobileState();
    const handleOrientationChange = () => {
      // Wait for orientation change to complete
      setTimeout(updateMobileState, 100);
    };
    const handleFullscreenChange = () => updateMobileState();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Listen for orientation API if available
    if (screen?.orientation) {
      screen.orientation.addEventListener('change', handleOrientationChange);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      
      if (screen?.orientation) {
        screen.orientation.removeEventListener('change', handleOrientationChange);
      }
    };
  }, []);

  const requestFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        return true;
      }
    } catch (error) {
      console.warn('Fullscreen request failed:', error);
      return false;
    }
    return false;
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
        return true;
      }
    } catch (error) {
      console.warn('Exit fullscreen failed:', error);
      return false;
    }
    return false;
  };

  const lockOrientation = async (orientation: 'landscape' | 'portrait') => {
    try {
      // Use type assertion for orientation lock API which may not be fully typed
      const screenOrientation = screen?.orientation as any;
      if (screenOrientation?.lock) {
        await screenOrientation.lock(orientation);
        return true;
      }
    } catch (error) {
      console.warn('Orientation lock failed:', error);
      return false;
    }
    return false;
  };

  const unlockOrientation = async () => {
    try {
      const screenOrientation = screen?.orientation as any;
      if (screenOrientation?.unlock) {
        await screenOrientation.unlock();
        return true;
      }
    } catch (error) {
      console.warn('Orientation unlock failed:', error);
      return false;
    }
    return false;
  };

  return {
    ...mobileState,
    requestFullscreen,
    exitFullscreen,
    lockOrientation,
    unlockOrientation,
  };
}