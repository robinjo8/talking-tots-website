import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Settings, RotateCcw, ArrowLeft, HelpCircle } from "lucide-react";

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
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  
  // Device detection
  const isMobile = window.innerWidth < 768;
  const isDesktop = window.innerWidth >= 768;
  
  // Full screen dimensions - use entire viewport
  const CANVAS_WIDTH = window.innerWidth;
  const CANVAS_HEIGHT = window.innerHeight;
  
  // Desktop scaling factor (10% reduction)
  const desktopScale = isDesktop ? 0.9 : 1;
  
  // Calculate optimal puzzle size maintaining aspect ratio
  const baseAvailableWidth = CANVAS_WIDTH * 0.6; // 60% for puzzle area
  const baseAvailableHeight = CANVAS_HEIGHT * 0.8; // 80% for puzzle area
  
  const availableWidth = baseAvailableWidth * desktopScale;
  const availableHeight = baseAvailableHeight * desktopScale;
  
  // Determine puzzle dimensions based on image aspect ratio while maintaining proportions
  const aspectRatio = 1.33; // Default 4:3 aspect ratio, will be updated when image loads
  let PUZZLE_WIDTH: number;
  let PUZZLE_HEIGHT: number;
  
  if (availableWidth / availableHeight > aspectRatio) {
    PUZZLE_HEIGHT = availableHeight;
    PUZZLE_WIDTH = PUZZLE_HEIGHT * aspectRatio;
  } else {
    PUZZLE_WIDTH = availableWidth;
    PUZZLE_HEIGHT = PUZZLE_WIDTH / aspectRatio;
  }
  
  // Center the puzzle board
  const BOARD_X = (CANVAS_WIDTH - PUZZLE_WIDTH) / 2;
  const BOARD_Y = (CANVAS_HEIGHT - PUZZLE_HEIGHT) / 2;
  
  // Side areas for pieces (left and right)
  const SIDE_AREA_WIDTH = (CANVAS_WIDTH - PUZZLE_WIDTH) / 2;
  const LEFT_AREA_START = 0;
  const LEFT_AREA_END = BOARD_X - 10; // Add small margin
  const RIGHT_AREA_START = BOARD_X + PUZZLE_WIDTH + 10; // Add small margin
  const RIGHT_AREA_END = CANVAS_WIDTH;
  
  const TAB_SIZE = Math.max(15, Math.min(30, PUZZLE_WIDTH / 40));

  // Fullscreen API for mobile
  useEffect(() => {
    if (isMobile) {
      const enterFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
          // Lock orientation to landscape
          if (screen.orientation && (screen.orientation as any).lock) {
            await (screen.orientation as any).lock('landscape');
          }
        } catch (error) {
          console.log('Fullscreen not supported or denied');
        }
      };

      enterFullscreen();

      return () => {
        if (document.exitFullscreen && document.fullscreenElement) {
          document.exitFullscreen();
        }
        if (screen.orientation && (screen.orientation as any).unlock) {
          (screen.orientation as any).unlock();
        }
      };
    }
  }, [isMobile]);

  const handleNewGame = () => {
    // Reset all pieces to initial scattered positions
    setPieces(prev => prev.map(piece => ({
      ...piece,
      currentX: Math.random() > 0.5 
        ? LEFT_AREA_START + 20 + Math.random() * Math.max(20, LEFT_AREA_END - LEFT_AREA_START - piece.width - 40)
        : RIGHT_AREA_START + 20 + Math.random() * Math.max(20, RIGHT_AREA_END - RIGHT_AREA_START - piece.width - 40),
      currentY: 20 + Math.random() * Math.max(20, CANVAS_HEIGHT - piece.height - 40),
      isPlaced: false,
      isDragging: false
    })));
    setShowSettingsMenu(false);
  };

  const handleBack = () => {
    window.history.back();
    setShowSettingsMenu(false);
  };

  const handleInstructions = () => {
    alert('Povlecite dele sestavljanke na pravo mesto. Ko se del približa svojemu mestu, se bo samodejno prilepil.');
    setShowSettingsMenu(false);
  };

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
          // Scatter pieces in left and right side areas with proper bounds checking
          currentX: Math.random() > 0.5 
            ? LEFT_AREA_START + 20 + Math.random() * Math.max(20, LEFT_AREA_END - LEFT_AREA_START - pieceWidth - 40)
            : RIGHT_AREA_START + 20 + Math.random() * Math.max(20, RIGHT_AREA_END - RIGHT_AREA_START - pieceWidth - 40),
          currentY: 20 + Math.random() * Math.max(20, CANVAS_HEIGHT - pieceHeight - 40),
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

    // Draw puzzle board area (centered)
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(BOARD_X, BOARD_Y, PUZZLE_WIDTH, PUZZLE_HEIGHT);
    ctx.setLineDash([]);


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

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggedPiece) return;

    const eventPos = getEventPos(e);
    let newX = eventPos.x - offset.x;
    let newY = eventPos.y - offset.y;

    // Apply boundary constraints - pieces can only move within game area
    const pieceWidth = draggedPiece.width + TAB_SIZE * 2;
    const pieceHeight = draggedPiece.height + TAB_SIZE * 2;
    
    // Constrain to canvas boundaries
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
    <div className={`fixed inset-0 overflow-hidden bg-background ${className}`}>
      {/* Desktop Controls */}
      {isDesktop && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button onClick={handleNewGame} variant="default" size="sm" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Nova igra
          </Button>
          <Button onClick={handleBack} variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Nazaj
          </Button>
          <Button onClick={handleInstructions} variant="outline" size="sm" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Navodila
          </Button>
        </div>
      )}

      {/* Mobile Settings Button */}
      {isMobile && (
        <>
          <Button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            variant="outline"
            size="sm"
            className="absolute bottom-4 right-4 z-20 w-10 h-10 p-0"
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* Mobile Settings Menu */}
          {showSettingsMenu && (
            <div className="absolute bottom-16 right-4 z-30 bg-background border border-border rounded-lg shadow-lg p-2 space-y-1">
              <Button 
                onClick={handleNewGame} 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Nova igra
              </Button>
              <Button 
                onClick={handleBack} 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Nazaj
              </Button>
              <Button 
                onClick={handleInstructions} 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-sm"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Navodila
              </Button>
            </div>
          )}
        </>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="cursor-pointer block"
        style={{ 
          width: `${CANVAS_WIDTH}px`, 
          height: `${CANVAS_HEIGHT}px`,
          display: 'block'
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