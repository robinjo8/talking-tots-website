/**
 * Apple device detection utilities for Safari/iOS compatibility
 */

export const isIOSDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export const isSafari = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /^((?!chrome|android).)*safari/i.test(ua);
};

export const supportsFullscreenAPI = (): boolean => {
  return !!(
    document.documentElement.requestFullscreen ||
    (document.documentElement as any).webkitRequestFullscreen
  ) && !isIOSDevice();
};

export const supportsOrientationLock = (): boolean => {
  return !!(screen.orientation && 'lock' in screen.orientation) && !isIOSDevice();
};

/**
 * Safe fullscreen request - skips on iOS where it's not supported
 */
export const safeRequestFullscreen = async (element?: HTMLElement): Promise<void> => {
  if (isIOSDevice()) return;
  const el = element || document.documentElement;
  try {
    if (el.requestFullscreen) {
      await el.requestFullscreen();
    } else if ((el as any).webkitRequestFullscreen) {
      await (el as any).webkitRequestFullscreen();
    }
  } catch (error) {
    console.log('Fullscreen not supported:', error);
  }
};

/**
 * Safe fullscreen exit
 */
export const safeExitFullscreen = async (): Promise<void> => {
  try {
    if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      }
    }
  } catch (error) {
    console.log('Exit fullscreen error:', error);
  }
};

/**
 * Safe orientation lock - skips on iOS where it's not supported
 */
export const safeLockLandscape = async (): Promise<void> => {
  if (isIOSDevice()) return;
  try {
    if (screen.orientation && 'lock' in screen.orientation) {
      try {
        await (screen.orientation as any).lock('landscape-primary');
      } catch {
        await (screen.orientation as any).lock('landscape');
      }
    }
  } catch (error) {
    console.log('Landscape lock not supported:', error);
  }
};

/**
 * Safe orientation unlock
 */
export const safeUnlockOrientation = (): void => {
  if (isIOSDevice()) return;
  try {
    if (screen.orientation && 'unlock' in screen.orientation) {
      (screen.orientation as any).unlock();
    }
  } catch (error) {
    console.log('Orientation unlock error:', error);
  }
};
