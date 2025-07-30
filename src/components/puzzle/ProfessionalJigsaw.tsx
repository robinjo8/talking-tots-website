import React, { useEffect, useRef, useState, useCallback } from "react";

interface ProfessionalJigsawProps {
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

export const ProfessionalJigsaw: React.FC<ProfessionalJigsawProps> = ({
  imageUrl,
  gridCols = 2,
  gridRows = 3,
  onComplete,
  className = ""
}) => {
  // Show rotation message on mobile portrait BEFORE any hooks
  if (window.innerWidth < 768 && window.innerHeight > window.innerWidth) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-center p-8">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold mb-2">Rotate Your Device</h2>
          <p className="text-lg">Please rotate your device to landscape mode to play the puzzle game.</p>
        </div>
      </div>
    );
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  
  // Responsive dimensions based on viewport
  const CANVAS_WIDTH = window.innerWidth > 768 ? 1600 : 900;
  const CANVAS_HEIGHT = window.innerWidth > 768 ? 900 : 600;
  const TAB_SIZE = window.innerWidth > 768 ? 25 : 15;
  
  // Define three zones: left, center (puzzle board), right
  const SIDE_ZONE_WIDTH = window.innerWidth > 768 ? 250 : 150;
  const PUZZLE_WIDTH = CANVAS_WIDTH - (SIDE_ZONE_WIDTH * 2) - 40; // 20px margin on each side
  const PUZZLE_HEIGHT = window.innerWidth > 768 ? 600 : 375;
  
  // Zone boundaries
  const LEFT_ZONE = { x: 20, y: 20, width: SIDE_ZONE_WIDTH, height: CANVAS_HEIGHT - 40 };
  const CENTER_ZONE = { x: SIDE_ZONE_WIDTH + 30, y: (CANVAS_HEIGHT - PUZZLE_HEIGHT) / 2, width: PUZZLE_WIDTH, height: PUZZLE_HEIGHT };
  const RIGHT_ZONE = { x: CANVAS_WIDTH - SIDE_ZONE_WIDTH - 20, y: 20, width: SIDE_ZONE_WIDTH, height: CANVAS_HEIGHT - 40 };
  
  const BOARD_X = CENTER_ZONE.x;
  const BOARD_Y = CENTER_ZONE.y;

  // Load and process image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('Image loaded successfully');
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

    // Create a temporary canvas to extract image data
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = PUZZLE_WIDTH;
    tempCanvas.height = PUZZLE_HEIGHT;
    
    // Draw scaled image
    tempCtx.drawImage(image, 0, 0, PUZZLE_WIDTH, PUZZLE_HEIGHT);

    // Generate tab patterns to ensure proper jigsaw connectivity
    // For horizontal connections (left-right)
    const horizontalTabs: boolean[][] = [];
    for (let row = 0; row < gridRows; row++) {
      horizontalTabs[row] = [];
      for (let col = 0; col < gridCols - 1; col++) {
        horizontalTabs[row][col] = Math.random() > 0.5;
      }
    }

    // For vertical connections (top-bottom)
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
          // Scatter pieces in left and right zones
          currentX: Math.random() > 0.5 
            ? LEFT_ZONE.x + Math.random() * (LEFT_ZONE.width - pieceWidth)  // Left zone
            : RIGHT_ZONE.x + Math.random() * (RIGHT_ZONE.width - pieceWidth), // Right zone
          currentY: Math.random() > 0.5 
            ? LEFT_ZONE.y + Math.random() * (LEFT_ZONE.height / 2 - pieceHeight)  // Top half
            : LEFT_ZONE.y + LEFT_ZONE.height / 2 + Math.random() * (LEFT_ZONE.height / 2 - pieceHeight), // Bottom half
          correctX: BOARD_X + col * pieceWidth,
          correctY: BOARD_Y + row * pieceHeight,
          isPlaced: false,
          isDragging: false,
          tabs: {
            // Top: has tab if the piece above has a blank (opposite of piece above's bottom tab)
            top: row > 0 ? !verticalTabs[row - 1][col] : false,
            // Right: has tab if this connection is designated as tab for this piece
            right: col < gridCols - 1 ? horizontalTabs[row][col] : false,
            // Bottom: has tab if this connection is designated as tab for this piece  
            bottom: row < gridRows - 1 ? verticalTabs[row][col] : false,
            // Left: has tab if the piece to the left has a blank (opposite of left piece's right tab)
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
  }, [image, gridCols, gridRows]);

  // Draw the puzzle
  const drawPuzzle = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw zone boundaries
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 3;
    
    // Left zone
    ctx.strokeRect(LEFT_ZONE.x, LEFT_ZONE.y, LEFT_ZONE.width, LEFT_ZONE.height);
    
    // Center zone (puzzle board)
    ctx.strokeRect(CENTER_ZONE.x, CENTER_ZONE.y, CENTER_ZONE.width, CENTER_ZONE.height);
    
    // Right zone
    ctx.strokeRect(RIGHT_ZONE.x, RIGHT_ZONE.y, RIGHT_ZONE.width, RIGHT_ZONE.height);


    // Sort pieces so dragged piece is drawn last (on top)
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
        
        // Create clipping mask with the piece shape
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
          // Glow effect for dragged piece
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

    // Draw completed pieces in correct position with slight transparency
    pieces.filter(p => p.isPlaced).forEach(piece => {
      if (piece.imageData) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.translate(piece.correctX, piece.correctY);
        
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCanvas.width = piece.imageData.width;
        tempCanvas.height = piece.imageData.height;
        tempCtx.putImageData(piece.imageData, 0, 0);
        
        ctx.drawImage(tempCanvas, -TAB_SIZE, -TAB_SIZE);
        ctx.restore();
      }
    });

  }, [pieces, image]);

  // Mouse and touch event handlers
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const eventPos = getEventPos(e);

    // Find clicked piece (in reverse order to get top piece)
    for (let i = pieces.length - 1; i >= 0; i--) {
      const piece = pieces[i];
      if (!piece.isPlaced) {
        // Check if event position is within piece bounds using a more accurate method
        const relativeX = eventPos.x - piece.currentX;
        const relativeY = eventPos.y - piece.currentY;
        
        // Simple bounds check first
        if (relativeX >= -TAB_SIZE && relativeX <= piece.width + TAB_SIZE &&
            relativeY >= -TAB_SIZE && relativeY <= piece.height + TAB_SIZE) {
          
          setDraggedPiece(piece);
          setOffset({ 
            x: relativeX, 
            y: relativeY 
          });
          
          setPieces(prev => prev.map(p => 
            p.id === piece.id ? { ...p, isDragging: true } : { ...p, isDragging: false }
          ));
          break;
        }
      }
    }
  };

  // Helper function to check which zone a point is in
  const getZoneForPosition = (x: number, y: number) => {
    if (x >= LEFT_ZONE.x && x <= LEFT_ZONE.x + LEFT_ZONE.width &&
        y >= LEFT_ZONE.y && y <= LEFT_ZONE.y + LEFT_ZONE.height) {
      return 'left';
    }
    if (x >= CENTER_ZONE.x && x <= CENTER_ZONE.x + CENTER_ZONE.width &&
        y >= CENTER_ZONE.y && y <= CENTER_ZONE.y + CENTER_ZONE.height) {
      return 'center';
    }
    if (x >= RIGHT_ZONE.x && x <= RIGHT_ZONE.x + RIGHT_ZONE.width &&
        y >= RIGHT_ZONE.y && y <= RIGHT_ZONE.y + RIGHT_ZONE.height) {
      return 'right';
    }
    return null;
  };

  // Helper function to constrain position within allowed zones
  const constrainPosition = (x: number, y: number, pieceWidth: number, pieceHeight: number) => {
    const zone = getZoneForPosition(x + pieceWidth / 2, y + pieceHeight / 2);
    
    let constrainedX = x;
    let constrainedY = y;
    
    if (zone === 'left') {
      constrainedX = Math.max(LEFT_ZONE.x, Math.min(x, LEFT_ZONE.x + LEFT_ZONE.width - pieceWidth));
      constrainedY = Math.max(LEFT_ZONE.y, Math.min(y, LEFT_ZONE.y + LEFT_ZONE.height - pieceHeight));
    } else if (zone === 'center') {
      constrainedX = Math.max(CENTER_ZONE.x, Math.min(x, CENTER_ZONE.x + CENTER_ZONE.width - pieceWidth));
      constrainedY = Math.max(CENTER_ZONE.y, Math.min(y, CENTER_ZONE.y + CENTER_ZONE.height - pieceHeight));
    } else if (zone === 'right') {
      constrainedX = Math.max(RIGHT_ZONE.x, Math.min(x, RIGHT_ZONE.x + RIGHT_ZONE.width - pieceWidth));
      constrainedY = Math.max(RIGHT_ZONE.y, Math.min(y, RIGHT_ZONE.y + RIGHT_ZONE.height - pieceHeight));
    } else {
      // If outside all zones, find the closest zone
      const distToLeft = Math.abs(x - (LEFT_ZONE.x + LEFT_ZONE.width / 2));
      const distToCenter = Math.abs(x - (CENTER_ZONE.x + CENTER_ZONE.width / 2));
      const distToRight = Math.abs(x - (RIGHT_ZONE.x + RIGHT_ZONE.width / 2));
      
      if (distToLeft <= distToCenter && distToLeft <= distToRight) {
        constrainedX = Math.max(LEFT_ZONE.x, Math.min(x, LEFT_ZONE.x + LEFT_ZONE.width - pieceWidth));
        constrainedY = Math.max(LEFT_ZONE.y, Math.min(y, LEFT_ZONE.y + LEFT_ZONE.height - pieceHeight));
      } else if (distToCenter <= distToRight) {
        constrainedX = Math.max(CENTER_ZONE.x, Math.min(x, CENTER_ZONE.x + CENTER_ZONE.width - pieceWidth));
        constrainedY = Math.max(CENTER_ZONE.y, Math.min(y, CENTER_ZONE.y + CENTER_ZONE.height - pieceHeight));
      } else {
        constrainedX = Math.max(RIGHT_ZONE.x, Math.min(x, RIGHT_ZONE.x + RIGHT_ZONE.width - pieceWidth));
        constrainedY = Math.max(RIGHT_ZONE.y, Math.min(y, RIGHT_ZONE.y + RIGHT_ZONE.height - pieceHeight));
      }
    }
    
    return { x: constrainedX, y: constrainedY };
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggedPiece) return;

    const eventPos = getEventPos(e);
    const newX = eventPos.x - offset.x;
    const newY = eventPos.y - offset.y;
    
    const piece = pieces.find(p => p.id === draggedPiece.id);
    if (!piece) return;
    
    const constrained = constrainPosition(newX, newY, piece.width, piece.height);

    setPieces(prev => prev.map(p => 
      p.id === draggedPiece.id 
        ? { ...p, currentX: constrained.x, currentY: constrained.y }
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

    if (distance < 40) {
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

      // Check if puzzle is complete
      const allPlaced = pieces.every(p => p.isPlaced || p.id === piece.id);
      if (allPlaced) {
        setTimeout(() => onComplete?.(), 500);
      }
    } else {
      setPieces(prev => prev.map(p => 
        p.id === piece.id ? { ...p, isDragging: false } : p
      ));
    }

    setDraggedPiece(null);
  };

  // Draw puzzle when pieces change
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
    <div className={`w-full h-screen flex items-center justify-center bg-background ${className}`}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="max-w-full max-h-full cursor-pointer"
        style={{ 
          width: '100%', 
          height: '100%',
          objectFit: 'contain'
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