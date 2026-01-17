import { useEffect } from 'react';

/**
 * Prefetch images in the background to improve loading times
 * Uses requestIdleCallback for non-blocking prefetch
 */
export function useImagePrefetch(imageUrls: string[]) {
  useEffect(() => {
    if (!imageUrls.length) return;

    const prefetchImages = () => {
      imageUrls.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    };

    // Use requestIdleCallback if available, otherwise use setTimeout
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetchImages, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    } else {
      const timeout = setTimeout(prefetchImages, 100);
      return () => clearTimeout(timeout);
    }
  }, [imageUrls]);
}

/**
 * Prefetch a single image and return loading state
 */
export function prefetchImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}
