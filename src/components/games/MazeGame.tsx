import { useEffect, useRef } from 'react';
import { useMazeGame } from '@/hooks/useMazeGame';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MazeGameProps {
  onComplete: () => void;
}

export const MazeGame = ({ onComplete }: MazeGameProps) => {
  const { maze, playerPosition, isCompleted, isGenerating, movePlayer, COLS, ROWS } = useMazeGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragonImageRef = useRef<HTMLImageElement | null>(null);

  const CELL_SIZE = 40;
  const WALL_WIDTH = 3;

  // Load dragon image
  useEffect(() => {
    const img = new Image();
    img.src = '/lovable-uploads/Zmajcek_glava.png';
    img.onload = () => {
      dragonImageRef.current = img;
    };
  }, []);

  // Draw maze
  useEffect(() => {
    if (!canvasRef.current || !maze.length || isGenerating) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw maze walls
    ctx.strokeStyle = 'hsl(var(--primary))';
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

    // Draw start (green) - 2 cells wide
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(2, 2, CELL_SIZE * 2 - 4, CELL_SIZE - 4);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('START', CELL_SIZE, CELL_SIZE / 2);

    // Draw goal (orange) - 2 cells wide at bottom right
    const goalX = (COLS - 2) * CELL_SIZE;
    const goalY = (ROWS - 1) * CELL_SIZE;
    ctx.fillStyle = '#f97316';
    ctx.fillRect(goalX + 2, goalY + 2, CELL_SIZE * 2 - 4, CELL_SIZE - 4);
    ctx.fillStyle = 'white';
    ctx.fillText('CILJ', goalX + CELL_SIZE, goalY + CELL_SIZE / 2);

    // Draw player (dragon)
    const playerX = playerPosition.x * CELL_SIZE + CELL_SIZE / 2;
    const playerY = playerPosition.y * CELL_SIZE + CELL_SIZE / 2;
    
    if (dragonImageRef.current) {
      // Draw dragon image
      const imgSize = CELL_SIZE * 0.8;
      ctx.drawImage(
        dragonImageRef.current,
        playerX - imgSize / 2,
        playerY - imgSize / 2,
        imgSize,
        imgSize
      );
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

  }, [maze, playerPosition, COLS, ROWS, isGenerating]);

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
          className="bg-background"
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
