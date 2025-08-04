import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

export const useIOSFullscreen = (enabled: boolean = true) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!enabled || !isMobile) return;

    const setupMobileFullscreen = async () => {
      try {
        // Common mobile gestures prevention
        document.body.style.overscrollBehavior = 'none';
        document.body.style.userSelect = 'none';
        (document.body.style as any).webkitUserSelect = 'none';
        (document.body.style as any).webkitTouchCallout = 'none';
        (document.body.style as any).webkitTapHighlightColor = 'transparent';
        
        if (isIOS()) {
          // iOS-specific: Disable touch actions and request fullscreen API
          document.body.style.touchAction = 'none';
          
          // Lock orientation on iOS if supported
          if (screen.orientation && (screen.orientation as any).lock) {
            try {
              await (screen.orientation as any).lock('landscape');
            } catch (orientationError) {
              console.log('Screen orientation lock not supported:', orientationError);
            }
          }
          
          // Request fullscreen API for iOS
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        } else if (isAndroid()) {
          // Android-specific: Use CSS-only approach, respect safe areas
          document.body.style.touchAction = 'manipulation';
          
          // Don't request fullscreen API on Android - let it use safe areas naturally
          console.log('Android detected: Using CSS-only fullscreen with safe areas');
        }
      } catch (error) {
        console.log('Mobile fullscreen setup failed:', error);
      }
    };

    setupMobileFullscreen();

    return () => {
      // Restore original styles
      document.body.style.overscrollBehavior = '';
      document.body.style.touchAction = '';
      document.body.style.userSelect = '';
      (document.body.style as any).webkitUserSelect = '';
      (document.body.style as any).webkitTouchCallout = '';
      (document.body.style as any).webkitTapHighlightColor = '';
      
      // Only exit fullscreen if we're actually in fullscreen mode
      if (document.fullscreenElement && isIOS()) {
        document.exitFullscreen?.();
      }
    };
  }, [enabled, isMobile]);
};