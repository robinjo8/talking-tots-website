import { useEffect, useMemo, useRef, useState } from 'react';
import { useMazeGame } from '@/hooks/useMazeGame';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dragonHead from '@/assets/zmajcek-glava.png';

interface MazeGameProps {
  onComplete: () => void;
  cols?: number;
  rows?: number;
}

// Helper function to draw a star with glow
const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  glowIntensity: number
) => {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  // Draw glow (orange shadow)
  ctx.save();
  ctx.shadowColor = `rgba(249, 115, 22, ${glowIntensity})`; // Orange glow
  ctx.shadowBlur = 20 * glowIntensity;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  
  // Fill with golden yellow
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
  
  ctx.restore();
  
  // Draw border (orange, pulsing with glow)
  ctx.strokeStyle = `rgba(249, 115, 22, ${0.5 + glowIntensity * 0.5})`;
  ctx.lineWidth = 2;
  ctx.stroke();
};

export const MazeGame = ({ onComplete, cols, rows }: MazeGameProps) => {
  const { maze, playerPosition, isCompleted, isGenerating, movePlayer, COLS, ROWS } = useMazeGame({ cols, rows });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragonImageRef = useRef<HTMLImageElement | null>(null);
  const [dragonImageLoaded, setDragonImageLoaded] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0.3);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const WALL_WIDTH = 8;
  const PADDING = 2; // Minimal white border around maze

  // Measure container size
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate cell size based on container dimensions
  const CELL_SIZE = useMemo(() => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      return 40; // Default while measuring
    }
    
    const availableWidth = containerSize.width;
    const availableHeight = containerSize.height;
    
    const cellSizeByWidth = Math.floor((availableWidth - PADDING * 2) / COLS);
    const cellSizeByHeight = Math.floor((availableHeight - PADDING * 2) / ROWS);
    
    const maxCellSize = Math.min(cellSizeByWidth, cellSizeByHeight);
    
    // Use 99% of calculated size to fill the space better
    return Math.floor(maxCellSize * 0.99);
  }, [containerSize, COLS, ROWS]);

  // Load dragon image
  useEffect(() => {
    const img = new Image();
    img.src = dragonHead;
    img.onload = () => {
      dragonImageRef.current = img;
      setDragonImageLoaded(true);
    };
    img.onerror = () => {
      console.error('Failed to load dragon image');
      setDragonImageLoaded(true); // Still allow game to continue with fallback
    };
  }, []);

  // Animation effect for glowing star
  useEffect(() => {
    let direction = 1;
    const interval = setInterval(() => {
      setGlowIntensity(prev => {
        const next = prev + (0.02 * direction);
        if (next >= 1) direction = -1;
        if (next <= 0.3) direction = 1;
        return next;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // Draw maze
  useEffect(() => {
    if (!canvasRef.current || !maze.length || isGenerating || !dragonImageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Enable high-quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fill entire canvas with cyan/blue background (same as walls)
    ctx.fillStyle = '#0ea5e9'; // Same blue as walls
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fill inner area with white (maze area with padding)
    ctx.fillStyle = 'white';
    ctx.fillRect(PADDING, PADDING, canvas.width - PADDING * 2, canvas.height - PADDING * 2);

    // Draw white background only for each maze cell (path)
    ctx.fillStyle = 'white';
    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        const startX = x * CELL_SIZE + PADDING;
        const startY = y * CELL_SIZE + PADDING;
        ctx.fillRect(startX + 1, startY + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      });
    });

    // Draw maze walls
    ctx.strokeStyle = '#0ea5e9'; // Cyan/light blue
    ctx.lineJoin = 'round'; // Rounded corners at joints
    ctx.lineCap = 'round';  // Rounded corners at ends
    ctx.lineWidth = WALL_WIDTH;

    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        const startX = x * CELL_SIZE + PADDING;
        const startY = y * CELL_SIZE + PADDING;

        if (cell.walls.top) {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX + CELL_SIZE, startY);
          ctx.stroke();
        }
        if (cell.walls.right) {
          ctx.beginPath();
          ctx.moveTo(startX + CELL_SIZE, startY);
          ctx.lineTo(startX + CELL_SIZE, startY + CELL_SIZE);
          ctx.stroke();
        }
        if (cell.walls.bottom) {
          ctx.beginPath();
          ctx.moveTo(startX, startY + CELL_SIZE);
          ctx.lineTo(startX + CELL_SIZE, startY + CELL_SIZE);
          ctx.stroke();
        }
        if (cell.walls.left) {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX, startY + CELL_SIZE);
          ctx.stroke();
        }
      });
    });

    // Draw glowing star at goal (center of 2-cell goal)
    const goalX = (COLS - 1.5) * CELL_SIZE + PADDING;
    const goalY = (ROWS - 1) * CELL_SIZE + CELL_SIZE / 2 + PADDING;

    drawStar(ctx, goalX, goalY, 5, CELL_SIZE / 3, CELL_SIZE / 6, glowIntensity);

    // Draw player (dragon)
    const playerX = playerPosition.x * CELL_SIZE + CELL_SIZE / 2 + PADDING;
    const playerY = playerPosition.y * CELL_SIZE + CELL_SIZE / 2 + PADDING;
    
    if (dragonImageRef.current) {
      // Draw dragon image with high quality
      const imgSize = CELL_SIZE * 1.2; // Larger size for better visibility
      
      // Save context state
      ctx.save();
      
      // Draw with smooth scaling
      ctx.drawImage(
        dragonImageRef.current,
        playerX - imgSize / 2,
        playerY - imgSize / 2,
        imgSize,
        imgSize
      );
      
      // Restore context state
      ctx.restore();
    } else {
      // Fallback: Draw dragon circle with emoji
      ctx.fillStyle = 'hsl(var(--primary))';
      ctx.beginPath();
      ctx.arc(playerX, playerY, CELL_SIZE / 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('🐲', playerX, playerY);
    }

  }, [maze, playerPosition, COLS, ROWS, CELL_SIZE, isGenerating, dragonImageLoaded, glowIntensity]);

  // Trigger completion callback
  useEffect(() => {
    if (isCompleted) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  }, [isCompleted, onComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  // Prevent pull-to-refresh on mobile
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const preventRefresh = (e: TouchEvent) => {
      e.preventDefault();
    };
    
    canvas.addEventListener('touchmove', preventRefresh, { passive: false });
    
    return () => {
      canvas.removeEventListener('touchmove', preventRefresh);
    };
  }, []);

  // Touch/swipe controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    const threshold = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold) {
        movePlayer('right');
      } else if (deltaX < -threshold) {
        movePlayer('left');
      }
    } else {
      if (deltaY > threshold) {
        movePlayer('down');
      } else if (deltaY < -threshold) {
        movePlayer('up');
      }
    }

    touchStartRef.current = null;
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Generiranje labirinta...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <div
        className="relative bg-white rounded-lg shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={COLS * CELL_SIZE + PADDING * 2}
          height={ROWS * CELL_SIZE + PADDING * 2}
          style={{ touchAction: 'none' }}
        />
      </div>
    </div>
  );
};
