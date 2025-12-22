import { useEffect, useMemo, useRef, useState } from 'react';
import { useMazeGame } from '@/hooks/useMazeGame';
import dragonHead from '@/assets/zmajcek-glava.png';

const SUPABASE_URL = "https://ixtgjnsolqwjiheuebjq.supabase.co";
const BACKGROUND_IMAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/ozadja/svetlomodro_ozadje.png.png`;

interface MazeGameProps {
  onComplete: () => void;
  cols?: number;
  rows?: number;
  alignTop?: boolean;
}

// Helper function to draw a star with glow
const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, glowIntensity: number) => {
  let rot = Math.PI / 2 * 3;
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
export const MazeGame = ({
  onComplete,
  cols,
  rows,
  alignTop
}: MazeGameProps) => {
  const {
    maze,
    playerPosition,
    isCompleted,
    isGenerating,
    movePlayer,
    COLS,
    ROWS
  } = useMazeGame({
    cols,
    rows
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{
    x: number;
    y: number;
  } | null>(null);
  const dragonImageRef = useRef<HTMLImageElement | null>(null);
  const [dragonImageLoaded, setDragonImageLoaded] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0.3);
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0
  });
  const [bgImageLoaded, setBgImageLoaded] = useState(false);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const WALL_WIDTH = 10;
  const WALL_RADIUS = 5; // Rounded corners for walls
  const PADDING = 2; // Minimal border around maze

  // Measure container size
  useEffect(() => {
    const updateSize = () => {
      if (alignTop) {
        // Desktop: use window dimensions minus header
        const width = window.innerWidth;
        const height = window.innerHeight - 80; // 80px for header
        setContainerSize({
          width,
          height
        });
        console.log('MazeGame: updateSize desktop', {
          width,
          height
        });
      } else {
        // Mobile: use full window dimensions (fullscreen mode)
        const width = window.innerWidth;
        const height = window.innerHeight;
        setContainerSize({
          width,
          height
        });
        console.log('MazeGame: updateSize mobile', {
          width,
          height
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [alignTop]);

  // Calculate cell size based on container dimensions
  const CELL_SIZE = useMemo(() => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      return null; // Don't render until we have measurements
    }
    const availableWidth = containerSize.width;
    const availableHeight = containerSize.height;
    const cellSizeByWidth = Math.floor((availableWidth - PADDING * 2) / COLS);
    const cellSizeByHeight = Math.floor((availableHeight - PADDING * 2) / ROWS);
    const maxCellSize = Math.min(cellSizeByWidth, cellSizeByHeight);

    // Use 99% of calculated size to fill the space better
    return Math.floor(maxCellSize * 0.99);
  }, [containerSize, COLS, ROWS]);
  console.log('MazeGame render state', {
    alignTop,
    isGenerating,
    containerSize,
    CELL_SIZE
  });

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

  // Load background image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = BACKGROUND_IMAGE_URL;
    img.onload = () => {
      bgImageRef.current = img;
      setBgImageLoaded(true);
    };
    img.onerror = () => {
      console.error('Failed to load background image');
      setBgImageLoaded(true); // Continue without background
    };
  }, []);

  // Animation effect for glowing star
  useEffect(() => {
    let direction = 1;
    const interval = setInterval(() => {
      setGlowIntensity(prev => {
        const next = prev + 0.02 * direction;
        if (next >= 1) direction = -1;
        if (next <= 0.3) direction = 1;
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Draw maze
  useEffect(() => {
    if (!canvasRef.current || !maze.length || isGenerating || !dragonImageLoaded || !CELL_SIZE) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Enable high-quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw background image if loaded
    if (bgImageRef.current && bgImageLoaded) {
      ctx.drawImage(bgImageRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      // Fallback light blue background
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Helper to draw a rounded rectangle
    const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    // Draw maze walls with orange color and rounded corners
    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        const startX = x * CELL_SIZE + PADDING;
        const startY = y * CELL_SIZE + PADDING;
        
        // Draw walls as thick rounded rectangles with orange gradient
        const drawWall = (x1: number, y1: number, x2: number, y2: number, isVertical: boolean) => {
          // Create gradient for 3D orange effect
          const gradient = isVertical 
            ? ctx.createLinearGradient(x1 - WALL_WIDTH/2, y1, x1 + WALL_WIDTH/2, y1)
            : ctx.createLinearGradient(x1, y1 - WALL_WIDTH/2, x1, y1 + WALL_WIDTH/2);
          gradient.addColorStop(0, '#fb923c'); // orange-400
          gradient.addColorStop(0.5, '#fdba74'); // orange-300 (lighter middle)
          gradient.addColorStop(1, '#ea580c'); // orange-600 (darker edge)
          
          ctx.fillStyle = gradient;
          
          // Draw thick wall rectangle with rounded corners
          if (isVertical) {
            // Vertical wall
            drawRoundedRect(x1 - WALL_WIDTH / 2, y1, WALL_WIDTH, y2 - y1, WALL_RADIUS);
          } else {
            // Horizontal wall
            drawRoundedRect(x1, y1 - WALL_WIDTH / 2, x2 - x1, WALL_WIDTH, WALL_RADIUS);
          }
          ctx.fill();
          
          // Add darker orange border for depth
          ctx.strokeStyle = '#c2410c'; // orange-700
          ctx.lineWidth = 1.5;
          ctx.stroke();
        };
        
        if (cell.walls.top) {
          drawWall(startX, startY, startX + CELL_SIZE, startY, false);
        }
        if (cell.walls.right) {
          drawWall(startX + CELL_SIZE, startY, startX + CELL_SIZE, startY + CELL_SIZE, true);
        }
        if (cell.walls.bottom) {
          drawWall(startX, startY + CELL_SIZE, startX + CELL_SIZE, startY + CELL_SIZE, false);
        }
        if (cell.walls.left) {
          drawWall(startX, startY, startX, startY + CELL_SIZE, true);
        }
      });
    });

    // Draw glowing star at goal - bottom-right corner (single cell)
    const goalX = (COLS - 1) * CELL_SIZE + CELL_SIZE / 2 + PADDING;
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
      ctx.drawImage(dragonImageRef.current, playerX - imgSize / 2, playerY - imgSize / 2, imgSize, imgSize);

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
  }, [maze, playerPosition, COLS, ROWS, CELL_SIZE, isGenerating, dragonImageLoaded, bgImageLoaded, glowIntensity]);

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
    canvas.addEventListener('touchmove', preventRefresh, {
      passive: false
    });
    return () => {
      canvas.removeEventListener('touchmove', preventRefresh);
    };
  }, []);

  // Touch/swipe controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
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
    return <div className="flex items-center justify-center h-64">
        <p className="text-lg">Generiranje labirinta...</p>
      </div>;
  }
  return <div ref={containerRef} className={`w-full h-full flex justify-center ${alignTop ? 'items-start' : 'items-center'}`}>
      {CELL_SIZE === null ? <div className="flex items-center justify-center h-64">
          <p className="text-lg">Generiranje labirinta...</p>
        </div> : <div className="relative rounded-lg" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <canvas ref={canvasRef} width={COLS * CELL_SIZE + PADDING * 2} height={ROWS * CELL_SIZE + PADDING * 2} style={{
        touchAction: 'none'
      }} className="my-[60px]" />
        </div>}
    </div>;
};