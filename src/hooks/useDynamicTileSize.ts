import { useState, useEffect, useCallback } from 'react';

interface UseDynamicTileSizeOptions {
  numColumns: number;
  numRows: number;
  isLandscape?: boolean;
  maxTileSize?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  gap?: number;
}

/** Get the real visible viewport, using visualViewport when available */
function getViewportSize() {
  const vv = window.visualViewport;
  return {
    width: vv ? vv.width : window.innerWidth,
    height: vv ? vv.height : window.innerHeight,
  };
}

function calculateTileSize(
  viewportWidth: number,
  viewportHeight: number,
  numColumns: number,
  numRows: number,
  paddingVertical: number,
  paddingHorizontal: number,
  gap: number,
  maxTileSize: number
): number {
  const availableHeight = viewportHeight - paddingVertical;
  const availableWidth = viewportWidth - paddingHorizontal;

  const tileSizeByHeight = Math.floor((availableHeight - (numRows - 1) * gap) / numRows);
  const tileSizeByWidth = Math.floor((availableWidth - (numColumns - 1) * gap) / numColumns);

  // Ensure minimum 40px so tiles are always usable
  return Math.max(Math.min(tileSizeByHeight, tileSizeByWidth, maxTileSize), 40);
}

export function useDynamicTileSize({
  numColumns,
  numRows,
  isLandscape = false,
  maxTileSize = 180,
  paddingVertical = 120,
  paddingHorizontal = 80,
  gap = 16,
}: UseDynamicTileSizeOptions): number {

  const compute = useCallback(() => {
    const { width, height } = getViewportSize();
    if (isLandscape) {
      // Mobile landscape: tight reserved space
      // reservedVertical: 24px progress bar area + 8px padding top/bottom + 40px safety for browser chrome/safe-area
      // reservedHorizontal: 80px for floating buttons on left + 20px right safety
      const reservedVertical = 72;
      const reservedHorizontal = 100;
      const mobileGap = 4;
      const mobileMax = 120;
      return calculateTileSize(width, height, numColumns, numRows, reservedVertical, reservedHorizontal, mobileGap, mobileMax);
    }
    return calculateTileSize(width, height, numColumns, numRows, paddingVertical, paddingHorizontal, gap, maxTileSize);
  }, [numColumns, numRows, isLandscape, maxTileSize, paddingVertical, paddingHorizontal, gap]);

  const [tileSize, setTileSize] = useState(compute);

  useEffect(() => {
    const handleResize = () => setTileSize(compute());

    // Initial
    handleResize();

    // Standard listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // visualViewport listeners for mobile browser chrome changes
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', handleResize);
      vv.addEventListener('scroll', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (vv) {
        vv.removeEventListener('resize', handleResize);
        vv.removeEventListener('scroll', handleResize);
      }
    };
  }, [compute]);

  return tileSize;
}
