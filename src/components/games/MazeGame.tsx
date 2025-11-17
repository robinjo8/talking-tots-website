import { useEffect, useRef, useState } from 'react';
import { useMazeGame } from '@/hooks/useMazeGame';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dragonHead from '@/assets/zmajcek-glava.png';

interface MazeGameProps {
  onComplete: () => void;
}

// Helper function to draw a star
const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) => {
  ctx.fillStyle = '#fbbf24'; // Golden yellow color
  ctx.strokeStyle = '#f59e0b'; // Darker yellow border
  ctx.lineWidth = 2;
  
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

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
  ctx.fill();
  ctx.stroke();
};

export const MazeGame = ({ onComplete }: MazeGameProps) => {
  const { maze, playerPosition, isCompleted, isGenerating, movePlayer, COLS, ROWS } = useMazeGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragonImageRef = useRef<HTMLImageElement | null>(null);
  const [dragonImageLoaded, setDragonImageLoaded] = useState(false);
  const [starScale, setStarScale] = useState(1);

  const CELL_SIZE = 40;
  const WALL_WIDTH = 6;

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

  // Animation effect for blinking star
  useEffect(() => {
    const interval = setInterval(() => {
      setStarScale(prev => prev === 1 ? 1.3 : 1);
    }, 500);
    
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

    // Fill all cells with white background (maze paths)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw maze walls
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = WALL_WIDTH;

    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        const startX = x * CELL_SIZE;
        const startY = y * CELL_SIZE;

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

    // Draw blinking star at goal (2 cells at bottom right)
    const goalX1 = (COLS - 2) * CELL_SIZE + CELL_SIZE / 2;
    const goalX2 = (COLS - 1) * CELL_SIZE + CELL_SIZE / 2;
    const goalY = (ROWS - 1) * CELL_SIZE + CELL_SIZE / 2;

    // Draw star at first goal cell
    ctx.save();
    ctx.translate(goalX1, goalY);
    ctx.scale(starScale, starScale);
    drawStar(ctx, 0, 0, 5, CELL_SIZE / 3, CELL_SIZE / 6);
    ctx.restore();

    // Draw star at second goal cell
    ctx.save();
    ctx.translate(goalX2, goalY);
    ctx.scale(starScale, starScale);
    drawStar(ctx, 0, 0, 5, CELL_SIZE / 3, CELL_SIZE / 6);
    ctx.restore();

    // Draw player (dragon)
    const playerX = playerPosition.x * CELL_SIZE + CELL_SIZE / 2;
    const playerY = playerPosition.y * CELL_SIZE + CELL_SIZE / 2;
    
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

  }, [maze, playerPosition, COLS, ROWS, isGenerating, dragonImageLoaded, starScale]);

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
    <div className="flex flex-col items-center gap-6 py-4">
      <div 
        className="relative border-4 border-primary rounded-lg shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={COLS * 40}
          height={ROWS * 40}
          className="bg-[#86efac]"
          style={{ touchAction: 'none' }}
        />
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Uporabi puščice ali podrsaj za premikanje zmajčka
        </p>
        
        {/* Mobile controls */}
        <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto md:hidden">
          <div></div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => movePlayer('up')}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
          <div></div>
          
          <Button
            size="icon"
            variant="outline"
            onClick={() => movePlayer('left')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => movePlayer('down')}
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => movePlayer('right')}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
