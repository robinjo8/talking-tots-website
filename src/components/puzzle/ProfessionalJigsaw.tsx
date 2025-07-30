import React, { useEffect, useRef, useState, useCallback } from "react";

interface ProfessionalJigsawProps {
  imageUrl: string;
  gridSize?: number;
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
  gridSize = 4,
  onComplete,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  
  const PUZZLE_WIDTH = 400;
  const PUZZLE_HEIGHT = 300;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const TAB_SIZE = 20;

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

  // Generate puzzle pieces
  useEffect(() => {
    if (!image) return;

    const pieceWidth = PUZZLE_WIDTH / gridSize;
    const pieceHeight = PUZZLE_HEIGHT / gridSize;
    const newPieces: PuzzlePiece[] = [];

    // Create a temporary canvas to extract image data
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = PUZZLE_WIDTH;
    tempCanvas.height = PUZZLE_HEIGHT;
    
    // Draw scaled image
    tempCtx.drawImage(image, 0, 0, PUZZLE_WIDTH, PUZZLE_HEIGHT);

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const piece: PuzzlePiece = {
          id: `${row}-${col}`,
          row,
          col,
          x: col * pieceWidth,
          y: row * pieceHeight,
          width: pieceWidth,
          height: pieceHeight,
          currentX: 500 + (col * 80) + Math.random() * 200,
          currentY: 50 + (row * 80) + Math.random() * 200,
          correctX: 50 + col * pieceWidth,
          correctY: 50 + row * pieceHeight,
          isPlaced: false,
          isDragging: false,
          tabs: {
            top: row > 0 ? Math.random() > 0.5 : false,
            right: col < gridSize - 1 ? Math.random() > 0.5 : false,
            bottom: row < gridSize - 1 ? Math.random() > 0.5 : false,
            left: col > 0 ? Math.random() > 0.5 : false,
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
  }, [image, gridSize]);

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
    } else if (piece.col < gridSize - 1) {
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
    } else if (piece.row < gridSize - 1) {
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

  // Draw the puzzle
  const drawPuzzle = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw puzzle board area
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(50, 50, PUZZLE_WIDTH, PUZZLE_HEIGHT);
    ctx.setLineDash([]);

    // Draw pieces
    pieces.forEach(piece => {
      if (piece.imageData) {
        ctx.save();
        ctx.translate(piece.currentX, piece.currentY);
        
        // Create clipping mask
        ctx.clip(piece.path);
        
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
        ctx.strokeStyle = piece.isDragging ? '#3b82f6' : piece.isPlaced ? '#10b981' : '#64748b';
        ctx.lineWidth = piece.isDragging ? 3 : 2;
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

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked piece (in reverse order to get top piece)
    for (let i = pieces.length - 1; i >= 0; i--) {
      const piece = pieces[i];
      if (!piece.isPlaced) {
        const ctx = canvas.getContext('2d')!;
        ctx.save();
        ctx.translate(piece.currentX, piece.currentY);
        
        if (ctx.isPointInPath(piece.path, x - piece.currentX, y - piece.currentY)) {
          setDraggedPiece(piece);
          setOffset({ x: x - piece.currentX, y: y - piece.currentY });
          
          setPieces(prev => prev.map(p => 
            p.id === piece.id ? { ...p, isDragging: true } : p
          ));
          break;
        }
        ctx.restore();
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedPiece) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPieces(prev => prev.map(p => 
      p.id === draggedPiece.id 
        ? { ...p, currentX: x - offset.x, currentY: y - offset.y }
        : p
    ));
  };

  const handleMouseUp = () => {
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
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-primary mb-2">Professional Jigsaw Puzzle</h2>
        <p className="text-muted-foreground">Drag the pieces to complete the puzzle</p>
      </div>
      
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 border-gray-300 rounded-lg shadow-lg cursor-pointer"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Puzzle Board (left) | Puzzle Pieces (right) | Completed: {pieces.filter(p => p.isPlaced).length}/{pieces.length}</p>
      </div>
    </div>
  );
};