import { useState, useEffect } from 'react';

interface UseDynamicTileSizeOptions {
  numColumns: number;
  numRows: number;
  isLandscape?: boolean;
  maxTileSize?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  gap?: number;
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
  const [tileSize, setTileSize] = useState(() => {
    if (isLandscape) return 80; // Mobile landscape uses fixed small tiles
    return calculateTileSize(window.innerWidth, window.innerHeight, numColumns, numRows, paddingVertical, paddingHorizontal, gap, maxTileSize);
  });

  useEffect(() => {
    if (isLandscape) return; // Don't dynamically resize on mobile landscape

    const handleResize = () => {
      setTileSize(calculateTileSize(window.innerWidth, window.innerHeight, numColumns, numRows, paddingVertical, paddingHorizontal, gap, maxTileSize));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [numColumns, numRows, isLandscape, maxTileSize, paddingVertical, paddingHorizontal, gap]);

  return tileSize;
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

  const tileSizeByHeight = Math.floor(availableHeight / numRows) - gap;
  const tileSizeByWidth = Math.floor(availableWidth / numColumns) - gap;

  return Math.min(tileSizeByHeight, tileSizeByWidth, maxTileSize);
}
