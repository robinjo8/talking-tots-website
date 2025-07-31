import React, { useRef, useEffect, useState, useCallback } from 'react';

interface PuzzlePiece {
  id: number;
  row: number;
  col: number;
  correctX: number;
  correctY: number;
  currentX: number;
  currentY: number;
  isPlaced: boolean;
  isDragging: boolean;
  imageData?: ImageData;
  path?: Path2D;
  width: number;
  height: number;
}

interface SplitLayoutPuzzleProps {
  imageUrl: string;
  gridCols?: number;
  gridRows?: number;
  onComplete?: () => void;
}

export const SplitLayoutPuzzle: React.FC<SplitLayoutPuzzleProps> = ({
  imageUrl,
  gridCols = 3,
  gridRows = 2,
  onComplete
}) => {
  const piecesCanvasRef = useRef<HTMLCanvasElement>(null);
  const assemblyCanvasRef = useRef<HTMLCanvasElement>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  // Load image
  useEffect(() => {
    setIsLoading(true);
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

  // Generate puzzle pieces
  useEffect(() => {
    if (!image || !piecesCanvasRef.current || !assemblyCanvasRef.current) return;

    const piecesCanvas = piecesCanvasRef.current;
    const assemblyCanvas = assemblyCanvasRef.current;
    const piecesCtx = piecesCanvas.getContext('2d');
    const assemblyCtx = assemblyCanvas.getContext('2d');

    if (!piecesCtx || !assemblyCtx) return;

    // Set canvas dimensions
    const containerWidth = Math.min(assemblyCanvas.parentElement?.clientWidth || 300, 300);
    const containerHeight = Math.min(assemblyCanvas.parentElement?.clientHeight || 200, 200);
    
    const aspectRatio = image.width / image.height;
    let puzzleWidth, puzzleHeight;
    
    if (containerWidth / containerHeight > aspectRatio) {
      puzzleHeight = containerHeight * 0.8;
      puzzleWidth = puzzleHeight * aspectRatio;
    } else {
      puzzleWidth = containerWidth * 0.8;
      puzzleHeight = puzzleWidth / aspectRatio;
    }

    assemblyCanvas.width = containerWidth;
    assemblyCanvas.height = containerHeight;
    piecesCanvas.width = piecesCanvas.parentElement?.clientWidth || 300;
    piecesCanvas.height = piecesCanvas.parentElement?.clientHeight || 200;

    const pieceWidth = puzzleWidth / gridCols;
    const pieceHeight = puzzleHeight / gridRows;
    const assemblyStartX = (containerWidth - puzzleWidth) / 2;
    const assemblyStartY = (containerHeight - puzzleHeight) / 2;

    // Create pieces
    const newPieces: PuzzlePiece[] = [];
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const piece: PuzzlePiece = {
          id: row * gridCols + col,
          row,
          col,
          correctX: assemblyStartX + col * pieceWidth,
          correctY: assemblyStartY + row * pieceHeight,
          currentX: 50 + (col * 80) + (row * 40), // Spread pieces in holding area
          currentY: 30 + (row * 60),
          isPlaced: false,
          isDragging: false,
          width: pieceWidth,
          height: pieceHeight,
        };

        // Create piece path
        const path = new Path2D();
        path.rect(0, 0, pieceWidth, pieceHeight);
        piece.path = path;

        // Extract image data for this piece
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = pieceWidth;
        tempCanvas.height = pieceHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          tempCtx.drawImage(
            image,
            col * (image.width / gridCols), row * (image.height / gridRows),
            image.width / gridCols, image.height / gridRows,
            0, 0,
            pieceWidth, pieceHeight
          );
          piece.imageData = tempCtx.getImageData(0, 0, pieceWidth, pieceHeight);
        }

        newPieces.push(piece);
      }
    }

    setPieces(newPieces);
  }, [image, gridCols, gridRows]);

  // Draw pieces canvas
  const drawPiecesCanvas = useCallback(() => {
    if (!piecesCanvasRef.current || pieces.length === 0) return;
    
    const canvas = piecesCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pieces that are not placed
    pieces.forEach(piece => {
      if (!piece.isPlaced) {
        ctx.save();
        ctx.translate(piece.currentX, piece.currentY);
        
        if (piece.imageData) {
          ctx.putImageData(piece.imageData, 0, 0);
        }
        
        // Draw border
        ctx.strokeStyle = piece.isDragging ? '#0066ff' : '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, piece.width, piece.height);
        
        ctx.restore();
      }
    });
  }, [pieces]);

  // Draw assembly canvas
  const drawAssemblyCanvas = useCallback(() => {
    if (!assemblyCanvasRef.current || pieces.length === 0) return;
    
    const canvas = assemblyCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw placed pieces
    pieces.forEach(piece => {
      if (piece.isPlaced) {
        ctx.save();
        ctx.translate(piece.currentX, piece.currentY);
        
        if (piece.imageData) {
          ctx.putImageData(piece.imageData, 0, 0);
        }
        
        ctx.restore();
      }
    });

    // Draw assembly grid
    if (pieces.length > 0) {
      const firstPiece = pieces[0];
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      for (let row = 0; row <= gridRows; row++) {
        const y = firstPiece.correctY + row * firstPiece.height;
        ctx.beginPath();
        ctx.moveTo(firstPiece.correctX, y);
        ctx.lineTo(firstPiece.correctX + gridCols * firstPiece.width, y);
        ctx.stroke();
      }
      
      for (let col = 0; col <= gridCols; col++) {
        const x = firstPiece.correctX + col * firstPiece.width;
        ctx.beginPath();
        ctx.moveTo(x, firstPiece.correctY);
        ctx.lineTo(x, firstPiece.correctY + gridRows * firstPiece.height);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
    }
  }, [pieces, gridCols, gridRows]);

  useEffect(() => {
    drawPiecesCanvas();
  }, [drawPiecesCanvas]);

  useEffect(() => {
    drawAssemblyCanvas();
  }, [drawAssemblyCanvas]);

  // Mouse/touch handlers for pieces canvas
  const handlePiecesStart = (clientX: number, clientY: number) => {
    if (!piecesCanvasRef.current) return;
    
    const rect = piecesCanvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Find clicked piece
    for (let i = pieces.length - 1; i >= 0; i--) {
      const piece = pieces[i];
      if (!piece.isPlaced && 
          x >= piece.currentX && x <= piece.currentX + piece.width &&
          y >= piece.currentY && y <= piece.currentY + piece.height) {
        
        setDraggedPiece(piece);
        setOffset({ x: x - piece.currentX, y: y - piece.currentY });
        
        setPieces(prev => prev.map(p => 
          p.id === piece.id ? { ...p, isDragging: true } : p
        ));
        break;
      }
    }
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!draggedPiece) return;

    // Update position
    const newX = clientX - offset.x;
    const newY = clientY - offset.y;

    setPieces(prev => prev.map(piece =>
      piece.id === draggedPiece.id
        ? { ...piece, currentX: newX, currentY: newY }
        : piece
    ));
  };

  const handleEnd = (clientX: number, clientY: number) => {
    if (!draggedPiece || !assemblyCanvasRef.current) return;

    const assemblyRect = assemblyCanvasRef.current.getBoundingClientRect();
    const assemblyX = clientX - assemblyRect.left;
    const assemblyY = clientY - assemblyRect.top;

    // Check if dropped in assembly area
    const tolerance = 30;
    const isInCorrectPosition = 
      Math.abs(assemblyX - draggedPiece.correctX) < tolerance &&
      Math.abs(assemblyY - draggedPiece.correctY) < tolerance;

    setPieces(prev => prev.map(piece => {
      if (piece.id === draggedPiece.id) {
        if (isInCorrectPosition) {
          return {
            ...piece,
            currentX: draggedPiece.correctX,
            currentY: draggedPiece.correctY,
            isPlaced: true,
            isDragging: false
          };
        } else {
          return { ...piece, isDragging: false };
        }
      }
      return piece;
    }));

    setDraggedPiece(null);
    setOffset({ x: 0, y: 0 });

    // Check completion
    setTimeout(() => {
      setPieces(current => {
        const allPlaced = current.every(p => p.isPlaced);
        if (allPlaced && onComplete) {
          onComplete();
        }
        return current;
      });
    }, 100);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top half - Pieces holding area */}
      <div className="flex-1 bg-muted/20 p-2 border-b">
        <div className="w-full h-full border-2 border-dashed border-muted-foreground/30 rounded-lg overflow-hidden">
          <canvas
            ref={piecesCanvasRef}
            className="w-full h-full cursor-pointer"
            onMouseDown={(e) => handlePiecesStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onMouseUp={(e) => handleEnd(e.clientX, e.clientY)}
            onTouchStart={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              handlePiecesStart(touch.clientX, touch.clientY);
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              handleMove(touch.clientX, touch.clientY);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              const touch = e.changedTouches[0];
              handleEnd(touch.clientX, touch.clientY);
            }}
          />
        </div>
      </div>
      
      {/* Bottom half - Assembly area */}
      <div className="flex-1 p-2">
        <div className="w-full h-full border-2 border-dashed border-black rounded-lg bg-white overflow-hidden">
          <canvas
            ref={assemblyCanvasRef}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};