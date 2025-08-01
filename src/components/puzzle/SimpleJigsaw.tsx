import React, { useEffect, useRef, useState, useCallback } from "react";

interface SimpleJigsawProps {
  imageUrl: string;
  gridCols?: number;
  gridRows?: number;
  onComplete?: () => void;
  className?: string;
}

interface PuzzlePiece {
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  currentX: number;
  currentY: number;
  correctX: number;
  correctY: number;
  isPlaced: boolean;
  isDragging: boolean;
  tabs: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  path: Path2D;
  imageData: ImageData | null;
}

export const SimpleJigsaw: React.FC<SimpleJigsawProps> = ({
  imageUrl,
  gridCols = 3,
  gridRows = 2,
  onComplete,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  
  // Responsive canvas dimensions
  const getCanvasDimensions = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Mobile: Always use full viewport dimensions for consistent fullscreen
      return { 
        width: window.innerWidth, 
        height: window.innerHeight 
      };
    } else {
      // Desktop: Use almost full viewport width
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const width = viewportWidth * 0.95;
      const height = viewportHeight * 0.8;
      return { width, height };
    }
  };

  const [canvasDimensions, setCanvasDimensions] = useState(getCanvasDimensions());

  useEffect(() => {
    const handleResize = () => {
      setCanvasDimensions(getCanvasDimensions());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const CANVAS_WIDTH = canvasDimensions.width;
  const CANVAS_HEIGHT = canvasDimensions.height;
  
  // Calculate puzzle dimensions based on device
  const calculatePuzzleDimensions = () => {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Mobile: Maximize use of available space
      const maxPuzzleWidth = CANVAS_WIDTH * 0.95; // Use almost full width
      const maxPuzzleHeight = (CANVAS_HEIGHT / 2) * 0.9; // Use 90% of bottom half
      const puzzleSize = Math.min(maxPuzzleWidth, maxPuzzleHeight);
      return { width: puzzleSize, height: puzzleSize };
    } else {
      // Desktop: Use center area
      const maxPuzzleWidth = CANVAS_WIDTH * 0.5;
      const maxPuzzleHeight = CANVAS_HEIGHT * 0.6;
      const puzzleSize = Math.min(maxPuzzleWidth, maxPuzzleHeight);
      return { width: puzzleSize, height: puzzleSize };
    }
  };
  
  const puzzleDimensions = calculatePuzzleDimensions();
  const PUZZLE_WIDTH = puzzleDimensions.width;
  const PUZZLE_HEIGHT = puzzleDimensions.height;
  
  const isMobile = window.innerWidth < 768;
  const BOARD_X = (CANVAS_WIDTH - PUZZLE_WIDTH) / 2;
  const BOARD_Y = isMobile 
    ? (CANVAS_HEIGHT / 2) + ((CANVAS_HEIGHT / 2) - PUZZLE_HEIGHT) / 2  // Bottom half center
    : (CANVAS_HEIGHT - PUZZLE_HEIGHT) / 2;  // Full canvas center
  
  // Areas for scattered pieces
  const LEFT_AREA_END = isMobile ? CANVAS_WIDTH : BOARD_X - 10;
  const RIGHT_AREA_START = isMobile ? 0 : BOARD_X + PUZZLE_WIDTH + 10;
  
  const TAB_SIZE = Math.max(8, Math.min(15, PUZZLE_WIDTH / 30));

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setImage(img);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      console.error('Failed to load image');
      setIsLoading(false);
    };
    
    img.src = imageUrl;
  }, [imageUrl]);

  // Create puzzle piece path with tabs and blanks
  const createPuzzlePiecePath = (piece: PuzzlePiece, width: number, height: number): Path2D => {
    const path = new Path2D();
    const tabSize = TAB_SIZE;
    
    // Start from top-left corner
    path.moveTo(0, 0);
    
    // Top edge
    if (piece.tabs.top) {
      path.lineTo(width * 0.3, 0);
      path.quadraticCurveTo(width * 0.4, -tabSize, width * 0.5, -tabSize);
      path.quadraticCurveTo(width * 0.6, -tabSize, width * 0.7, 0);
      path.lineTo(width, 0);
    } else if (piece.row > 0) {
      path.lineTo(width * 0.3, 0);
      path.quadraticCurveTo(width * 0.4, tabSize, width * 0.5, tabSize);
      path.quadraticCurveTo(width * 0.6, tabSize, width * 0.7, 0);
      path.lineTo(width, 0);
    } else {
      path.lineTo(width, 0);
    }
    
    // Right edge
    if (piece.tabs.right) {
      path.lineTo(width, height * 0.3);
      path.quadraticCurveTo(width + tabSize, height * 0.4, width + tabSize, height * 0.5);
      path.quadraticCurveTo(width + tabSize, height * 0.6, width, height * 0.7);
      path.lineTo(width, height);
    } else if (piece.col < gridCols - 1) {
      path.lineTo(width, height * 0.3);
      path.quadraticCurveTo(width - tabSize, height * 0.4, width - tabSize, height * 0.5);
      path.quadraticCurveTo(width - tabSize, height * 0.6, width, height * 0.7);
      path.lineTo(width, height);
    } else {
      path.lineTo(width, height);
    }
    
    // Bottom edge
    if (piece.tabs.bottom) {
      path.lineTo(width * 0.7, height);
      path.quadraticCurveTo(width * 0.6, height + tabSize, width * 0.5, height + tabSize);
      path.quadraticCurveTo(width * 0.4, height + tabSize, width * 0.3, height);
      path.lineTo(0, height);
    } else if (piece.row < gridRows - 1) {
      path.lineTo(width * 0.7, height);
      path.quadraticCurveTo(width * 0.6, height - tabSize, width * 0.5, height - tabSize);
      path.quadraticCurveTo(width * 0.4, height - tabSize, width * 0.3, height);
      path.lineTo(0, height);
    } else {
      path.lineTo(0, height);
    }
    
    // Left edge
    if (piece.tabs.left) {
      path.lineTo(0, height * 0.7);
      path.quadraticCurveTo(-tabSize, height * 0.6, -tabSize, height * 0.5);
      path.quadraticCurveTo(-tabSize, height * 0.4, 0, height * 0.3);
      path.lineTo(0, 0);
    } else if (piece.col > 0) {
      path.lineTo(0, height * 0.7);
      path.quadraticCurveTo(tabSize, height * 0.6, tabSize, height * 0.5);
      path.quadraticCurveTo(tabSize, height * 0.4, 0, height * 0.3);
      path.lineTo(0, 0);
    } else {
      path.lineTo(0, 0);
    }
    
    path.closePath();
    return path;
  };

  // Generate puzzle pieces
  useEffect(() => {
    if (!image) return;

    const pieceWidth = PUZZLE_WIDTH / gridCols;
    const pieceHeight = PUZZLE_HEIGHT / gridRows;
    const newPieces: PuzzlePiece[] = [];

    // Create temporary canvas to extract image data
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = PUZZLE_WIDTH;
    tempCanvas.height = PUZZLE_HEIGHT;
    
    // Draw scaled image
    tempCtx.drawImage(image, 0, 0, PUZZLE_WIDTH, PUZZLE_HEIGHT);

    // Generate tab patterns
    const horizontalTabs: boolean[][] = [];
    for (let row = 0; row < gridRows; row++) {
      horizontalTabs[row] = [];
      for (let col = 0; col < gridCols - 1; col++) {
        horizontalTabs[row][col] = Math.random() > 0.5;
      }
    }

    const verticalTabs: boolean[][] = [];
    for (let row = 0; row < gridRows - 1; row++) {
      verticalTabs[row] = [];
      for (let col = 0; col < gridCols; col++) {
        verticalTabs[row][col] = Math.random() > 0.5;
      }
    }

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const piece: PuzzlePiece = {
          id: `${row}-${col}`,
          row,
          col,
          x: col * pieceWidth,
          y: row * pieceHeight,
          width: pieceWidth,
          height: pieceHeight,
          // Place pieces differently based on device
          currentX: isMobile 
            ? 10 + Math.random() * Math.max(10, CANVAS_WIDTH - pieceWidth - 20)  // Top area on mobile
            : Math.random() > 0.5 
              ? 10 + Math.random() * Math.max(10, LEFT_AREA_END - pieceWidth - 20)
              : RIGHT_AREA_START + 10 + Math.random() * Math.max(10, CANVAS_WIDTH - RIGHT_AREA_START - pieceWidth - 20),
          currentY: isMobile
            ? 10 + Math.random() * Math.max(10, (CANVAS_HEIGHT / 2) - pieceHeight - 20)  // Top half only
            : 10 + Math.random() * Math.max(10, CANVAS_HEIGHT - pieceHeight - 20),
          correctX: BOARD_X + col * pieceWidth,
          correctY: BOARD_Y + row * pieceHeight,
          isPlaced: false,
          isDragging: false,
          tabs: {
            top: row > 0 ? !verticalTabs[row - 1][col] : false,
            right: col < gridCols - 1 ? horizontalTabs[row][col] : false,
            bottom: row < gridRows - 1 ? verticalTabs[row][col] : false,
            left: col > 0 ? !horizontalTabs[row][col - 1] : false,
          },
          path: new Path2D(),
          imageData: null
        };

        // Create puzzle piece shape
        piece.path = createPuzzlePiecePath(piece, pieceWidth, pieceHeight);
        
        // Extract image data for this piece
        piece.imageData = tempCtx.getImageData(
          piece.x, 
          piece.y, 
          piece.width + TAB_SIZE * 2, 
          piece.height + TAB_SIZE * 2
        );

        newPieces.push(piece);
      }
    }

    setPieces(newPieces);
  }, [image, gridCols, gridRows, PUZZLE_WIDTH, PUZZLE_HEIGHT, BOARD_X, BOARD_Y]);

  // Draw puzzle
  const drawPuzzle = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw puzzle board with white background and black dashed border
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(BOARD_X, BOARD_Y, PUZZLE_WIDTH, PUZZLE_HEIGHT);
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(BOARD_X, BOARD_Y, PUZZLE_WIDTH, PUZZLE_HEIGHT);
    ctx.setLineDash([]);

    // Draw faint template showing piece outlines
    const pieceWidth = PUZZLE_WIDTH / gridCols;
    const pieceHeight = PUZZLE_HEIGHT / gridRows;
    
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1;
    
    // Draw scaled image as faint background template
    ctx.drawImage(image, BOARD_X, BOARD_Y, PUZZLE_WIDTH, PUZZLE_HEIGHT);
    
    // Draw piece grid lines
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#3b82f6';
    
    // Vertical lines
    for (let col = 1; col < gridCols; col++) {
      const x = BOARD_X + col * pieceWidth;
      ctx.beginPath();
      ctx.moveTo(x, BOARD_Y);
      ctx.lineTo(x, BOARD_Y + PUZZLE_HEIGHT);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let row = 1; row < gridRows; row++) {
      const y = BOARD_Y + row * pieceHeight;
      ctx.beginPath();
      ctx.moveTo(BOARD_X, y);
      ctx.lineTo(BOARD_X + PUZZLE_WIDTH, y);
      ctx.stroke();
    }
    
    ctx.restore();

    // Sort pieces so dragged piece is drawn last
    const sortedPieces = [...pieces].sort((a, b) => {
      if (a.isDragging) return 1;
      if (b.isDragging) return -1;
      return 0;
    });

    // Draw pieces
    sortedPieces.forEach(piece => {
      if (piece.imageData) {
        ctx.save();
        ctx.translate(piece.currentX, piece.currentY);
        
        // Create clipping mask
        const clippingPath = new Path2D();
        clippingPath.addPath(piece.path);
        ctx.clip(clippingPath);
        
        // Create temporary canvas for the piece image
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCanvas.width = piece.imageData.width;
        tempCanvas.height = piece.imageData.height;
        tempCtx.putImageData(piece.imageData, 0, 0);
        
        // Draw the piece image
        ctx.drawImage(tempCanvas, -TAB_SIZE, -TAB_SIZE);
        
        ctx.restore();
        
        // Draw piece border
        ctx.save();
        ctx.translate(piece.currentX, piece.currentY);
        
        if (piece.isDragging) {
          ctx.shadowColor = '#3b82f6';
          ctx.shadowBlur = 10;
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
        } else if (piece.isPlaced) {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1.5;
        }
        
        ctx.stroke(piece.path);
        ctx.restore();
      }
    });
  }, [pieces, image, CANVAS_WIDTH, CANVAS_HEIGHT, BOARD_X, BOARD_Y, PUZZLE_WIDTH, PUZZLE_HEIGHT]);

  // Event handlers
  const getEventPos = (e: React.MouseEvent | React.TouchEvent): { x: number, y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    let clientX: number, clientY: number;
    if ('touches' in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const eventPos = getEventPos(e);

    // Find clicked piece
    for (let i = pieces.length - 1; i >= 0; i--) {
      const piece = pieces[i];
      if (!piece.isPlaced) {
        const relativeX = eventPos.x - piece.currentX;
        const relativeY = eventPos.y - piece.currentY;
        
        if (relativeX >= -TAB_SIZE && relativeX <= piece.width + TAB_SIZE &&
            relativeY >= -TAB_SIZE && relativeY <= piece.height + TAB_SIZE) {
          
          setDraggedPiece(piece);
          setOffset({ x: relativeX, y: relativeY });
          
          setPieces(prev => prev.map(p => 
            p.id === piece.id ? { ...p, isDragging: true } : { ...p, isDragging: false }
          ));
          break;
        }
      }
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggedPiece) return;

    const eventPos = getEventPos(e);
    let newX = eventPos.x - offset.x;
    let newY = eventPos.y - offset.y;

    // Boundary constraints
    const pieceWidth = draggedPiece.width + TAB_SIZE * 2;
    const pieceHeight = draggedPiece.height + TAB_SIZE * 2;
    
    newX = Math.max(-TAB_SIZE, Math.min(CANVAS_WIDTH - pieceWidth + TAB_SIZE, newX));
    newY = Math.max(-TAB_SIZE, Math.min(CANVAS_HEIGHT - pieceHeight + TAB_SIZE, newY));

    setPieces(prev => prev.map(p => 
      p.id === draggedPiece.id 
        ? { ...p, currentX: newX, currentY: newY }
        : p
    ));
  };

  const handleEnd = () => {
    if (!draggedPiece) return;

    const piece = pieces.find(p => p.id === draggedPiece.id);
    if (!piece) return;

    // Check if piece is close to correct position
    const distance = Math.sqrt(
      Math.pow(piece.currentX - piece.correctX, 2) + 
      Math.pow(piece.currentY - piece.correctY, 2)
    );

    if (distance < 30) {
      // Snap to correct position
      setPieces(prev => prev.map(p => 
        p.id === piece.id 
          ? { 
              ...p, 
              currentX: p.correctX, 
              currentY: p.correctY, 
              isPlaced: true, 
              isDragging: false 
            }
          : p
      ));

      // Check if puzzle is complete - no popup needed
      const allPlaced = pieces.every(p => p.isPlaced || p.id === piece.id);
      if (allPlaced) {
        // Puzzle completed silently
      }
    } else {
      setPieces(prev => prev.map(p => 
        p.id === piece.id ? { ...p, isDragging: false } : p
      ));
    }

    setDraggedPiece(null);
  };

  // Draw when pieces change
  useEffect(() => {
    drawPuzzle();
  }, [drawPuzzle]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full flex justify-center items-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="cursor-pointer border border-border rounded-lg shadow-lg"
        style={{ 
          width: `${CANVAS_WIDTH}px`, 
          height: `${CANVAS_HEIGHT}px`,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />
    </div>
  );
};