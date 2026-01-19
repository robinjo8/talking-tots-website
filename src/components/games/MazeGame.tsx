import { useEffect, useMemo, useRef, useState } from 'react';
import { useMazeGame, Position } from '@/hooks/useMazeGame';
import dragonHead from '@/assets/zmajcek-glava.png';
import checkeredFlag from '@/assets/checkered-flag.png';

interface MazeGameProps {
  onComplete: () => void;
  onStarCollect?: (starIndex: number) => void;
  collectedStars?: number[];
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
  onStarCollect,
  collectedStars = [],
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
    starPositions,
    COLS,
    ROWS
  } = useMazeGame({
    cols,
    rows
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragonImageRef = useRef<HTMLImageElement | null>(null);
  const flagImageRef = useRef<HTMLImageElement | null>(null);
  const [dragonImageLoaded, setDragonImageLoaded] = useState(false);
  const [flagImageLoaded, setFlagImageLoaded] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0.3);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const completionCalledRef = useRef(false);
  const lastStarCheckRef = useRef<string>('');
  
  const WALL_WIDTH = 6;
  const PADDING = 2;

  // Measure container size
  useEffect(() => {
    const updateSize = () => {
      if (alignTop) {
        const width = window.innerWidth;
        const height = window.innerHeight - 80;
        setContainerSize({ width, height });
      } else {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setContainerSize({ width, height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [alignTop]);

  // Calculate cell size based on container dimensions
  const CELL_SIZE = useMemo(() => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      return null;
    }
    const availableWidth = containerSize.width;
    const availableHeight = containerSize.height;
    const cellSizeByWidth = Math.floor((availableWidth - PADDING * 2) / COLS);
    const cellSizeByHeight = Math.floor((availableHeight - PADDING * 2) / ROWS);
    const maxCellSize = Math.min(cellSizeByWidth, cellSizeByHeight);
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
      setDragonImageLoaded(true);
    };
  }, []);

  // Load flag image
  useEffect(() => {
    const img = new Image();
    img.src = checkeredFlag;
    img.onload = () => {
      flagImageRef.current = img;
      setFlagImageLoaded(true);
    };
    img.onerror = () => {
      console.error('Failed to load flag image');
      setFlagImageLoaded(true);
    };
  }, []);

  // Animation effect for glowing stars
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

  // Check if player is on a star and trigger collection
  useEffect(() => {
    if (!starPositions.length || !onStarCollect) return;
    
    const posKey = `${playerPosition.x},${playerPosition.y}`;
    if (posKey === lastStarCheckRef.current) return;
    lastStarCheckRef.current = posKey;
    
    const starIndex = starPositions.findIndex(
      star => star.x === playerPosition.x && star.y === playerPosition.y
    );
    
    if (starIndex !== -1 && !collectedStars.includes(starIndex)) {
      onStarCollect(starIndex);
    }
  }, [playerPosition, starPositions, collectedStars, onStarCollect]);

  // Draw maze
  useEffect(() => {
    if (!canvasRef.current || !maze.length || isGenerating || !dragonImageLoaded || !CELL_SIZE) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw maze walls
    ctx.strokeStyle = 'hsl(35, 90%, 50%)';
    ctx.lineWidth = WALL_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

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

    // Draw 4 collectible stars (if not collected)
    starPositions.forEach((starPos, index) => {
      if (!collectedStars.includes(index)) {
        const starX = starPos.x * CELL_SIZE + CELL_SIZE / 2 + PADDING;
        const starY = starPos.y * CELL_SIZE + CELL_SIZE / 2 + PADDING;
        drawStar(ctx, starX, starY, 5, CELL_SIZE / 3, CELL_SIZE / 6, glowIntensity);
      }
    });

    // Draw checkered flag at goal
    const goalX = (COLS - 1) * CELL_SIZE + CELL_SIZE / 2 + PADDING;
    const goalY = (ROWS - 1) * CELL_SIZE + CELL_SIZE / 2 + PADDING;
    const flagSize = CELL_SIZE * 0.8;
    
    if (flagImageRef.current && flagImageLoaded) {
      ctx.drawImage(
        flagImageRef.current,
        goalX - flagSize / 2,
        goalY - flagSize / 2,
        flagSize,
        flagSize
      );
    } else {
      // Fallback: draw a simple flag icon
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(goalX - flagSize / 4, goalY - flagSize / 2);
      ctx.lineTo(goalX + flagSize / 4, goalY - flagSize / 4);
      ctx.lineTo(goalX - flagSize / 4, goalY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#713f12';
      ctx.fillRect(goalX - flagSize / 4 - 2, goalY - flagSize / 2, 4, flagSize);
    }

    // Draw player (dragon)
    const playerX = playerPosition.x * CELL_SIZE + CELL_SIZE / 2 + PADDING;
    const playerY = playerPosition.y * CELL_SIZE + CELL_SIZE / 2 + PADDING;
    
    if (dragonImageRef.current) {
      const imgSize = CELL_SIZE * 1.2;
      ctx.save();
      ctx.drawImage(dragonImageRef.current, playerX - imgSize / 2, playerY - imgSize / 2, imgSize, imgSize);
      ctx.restore();
    } else {
      ctx.fillStyle = 'hsl(var(--primary))';
      ctx.beginPath();
      ctx.arc(playerX, playerY, CELL_SIZE / 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('🐲', playerX, playerY);
    }
  }, [maze, playerPosition, COLS, ROWS, CELL_SIZE, isGenerating, dragonImageLoaded, flagImageLoaded, glowIntensity, starPositions, collectedStars]);

  // Trigger completion callback (only once)
  useEffect(() => {
    if (isCompleted && !completionCalledRef.current) {
      completionCalledRef.current = true;
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
    <div 
      ref={containerRef} 
      className={`w-full h-full flex justify-center ${alignTop ? 'items-start' : 'items-center'}`}
    >
      {CELL_SIZE === null ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Generiranje labirinta...</p>
        </div>
      ) : (
        <div className="relative rounded-lg" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {/* Star progress indicator */}
          <div className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
            <span className="text-lg">⭐</span>
            <span className="font-bold text-orange-600">{collectedStars.length}/4</span>
          </div>
          
          <canvas
            ref={canvasRef}
            width={COLS * CELL_SIZE + PADDING * 2}
            height={ROWS * CELL_SIZE + PADDING * 2}
            style={{ touchAction: 'none' }}
          />
        </div>
      )}
    </div>
  );
};
