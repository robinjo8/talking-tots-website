import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export const useIOSFullscreen = (enabled: boolean = true) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!enabled || !isMobile) return;

    const setupIOSFullscreen = async () => {
      try {
        // Prevent iOS pull-to-refresh and other gestures
        document.body.style.overscrollBehavior = 'none';
        document.body.style.touchAction = 'none';
        document.body.style.userSelect = 'none';
        (document.body.style as any).webkitUserSelect = 'none';
        (document.body.style as any).webkitTouchCallout = 'none';
        (document.body.style as any).webkitTapHighlightColor = 'transparent';
        
        // Lock orientation on mobile devices if supported
        if (screen.orientation && (screen.orientation as any).lock) {
          try {
            await (screen.orientation as any).lock('landscape');
          } catch (orientationError) {
            console.log('Screen orientation lock not supported:', orientationError);
          }
        }
        
        // Request fullscreen if supported
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.log('iOS fullscreen setup failed:', error);
      }
    };

    setupIOSFullscreen();

    return () => {
      // Restore original styles
      document.body.style.overscrollBehavior = '';
      document.body.style.touchAction = '';
      document.body.style.userSelect = '';
      (document.body.style as any).webkitUserSelect = '';
      (document.body.style as any).webkitTouchCallout = '';
      (document.body.style as any).webkitTapHighlightColor = '';
      
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    };
  }, [enabled, isMobile]);
};