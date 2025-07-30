import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, FabricImage, Group, Rect } from "fabric";

interface JigsawPuzzleProps {
  imageUrl: string;
  gridSize?: number;
  onComplete?: () => void;
  className?: string;
}

interface PuzzlePiece extends Group {
  puzzleData?: {
    correctX: number;
    correctY: number;
    row: number;
    col: number;
    isPlaced: boolean;
  };
}

export const JigsawPuzzle: React.FC<JigsawPuzzleProps> = ({
  imageUrl,
  gridSize = 3,
  onComplete,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 700,
      height: 500,
      backgroundColor: "#f8f9fa",
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas || !imageUrl) return;

    const loadAndCreatePuzzle = async () => {
      try {
        console.log('Loading image from URL:', imageUrl);
        
        // Test if image loads first
        const testImg = new Image();
        testImg.crossOrigin = 'anonymous';
        
        testImg.onload = async () => {
          console.log('Image loaded successfully, dimensions:', testImg.width, testImg.height);
          
          try {
            const img = await FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' });
            console.log('Fabric image created:', img);
            
            // Scale image to fit puzzle area
            const maxWidth = 400;
            const maxHeight = 300;
            const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!);
            
            img.scale(scale);
            
            const scaledWidth = img.width! * scale;
            const scaledHeight = img.height! * scale;
            
            const pieceWidth = scaledWidth / gridSize;
            const pieceHeight = scaledHeight / gridSize;
            
            console.log('Creating puzzle pieces:', { gridSize, pieceWidth, pieceHeight });
            
            const newPieces: PuzzlePiece[] = [];
            
            // Create puzzle pieces
            for (let row = 0; row < gridSize; row++) {
              for (let col = 0; col < gridSize; col++) {
                const piece = await createPuzzlePiece(
                  img,
                  col * pieceWidth,
                  row * pieceHeight,
                  pieceWidth,
                  pieceHeight,
                  row,
                  col
                );
                
                // Randomly position pieces in side area
                piece.set({
                  left: 450 + Math.random() * 200,
                  top: 50 + Math.random() * 350,
                  selectable: true,
                  hasControls: false,
                  hasBorders: true,
                  borderColor: '#4f46e5',
                  borderScaleFactor: 2,
                });
                
                fabricCanvas.add(piece);
                newPieces.push(piece);
              }
            }
            
            setPieces(newPieces);
            fabricCanvas.renderAll();
            console.log('Puzzle created successfully with', newPieces.length, 'pieces');
            
            // Add event listeners for drag and drop
            fabricCanvas.on('object:moving' as any, handlePieceMoving);
            fabricCanvas.on('object:moved' as any, handlePieceMoved);
            
          } catch (fabricError) {
            console.error('Error creating Fabric image:', fabricError);
          }
        };
        
        testImg.onerror = (error) => {
          console.error('Error loading image:', error);
          console.error('Failed to load image from URL:', imageUrl);
        };
        
        testImg.src = imageUrl;
        
      } catch (error) {
        console.error('Error in loadAndCreatePuzzle:', error);
      }
    };

    loadAndCreatePuzzle();
  }, [fabricCanvas, imageUrl, gridSize]);

  const createPuzzlePiece = async (
    sourceImg: FabricImage,
    x: number,
    y: number,
    width: number,
    height: number,
    row: number,
    col: number
  ): Promise<PuzzlePiece> => {
    try {
      // Create a cropped version of the image for this piece
      const pieceImg = await FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' });
      const scale = sourceImg.scaleX!;
      
      pieceImg.scale(scale);
      
      // Create clipping rect
      const clipRect = new Rect({
        left: x,
        top: y,
        width: width,
        height: height,
        absolutePositioned: true,
      });
      
      pieceImg.set({
        left: -x,
        top: -y,
        clipPath: clipRect,
      });

      // Create simple rectangular piece (we can enhance with jigsaw shapes later)
      const piece = new Group([pieceImg], {
        left: 50 + col * width, // Start position in puzzle board area
        top: 50 + row * height,
        width: width,
        height: height,
      }) as PuzzlePiece;

      // Add custom data
      piece.puzzleData = {
        correctX: 50 + col * width,
        correctY: 50 + row * height,
        row: row,
        col: col,
        isPlaced: false,
      };

      console.log('Created puzzle piece:', { row, col, x, y, width, height });
      return piece;
    } catch (error) {
      console.error('Error creating puzzle piece:', error);
      throw error;
    }
  };

  const handlePieceMoving = (e: any) => {
    const piece = e.target as PuzzlePiece;
    if (!piece.puzzleData) return;

    // Highlight if close to correct position
    const correctX = piece.puzzleData.correctX;
    const correctY = piece.puzzleData.correctY;
    const currentX = piece.left!;
    const currentY = piece.top!;
    
    const distance = Math.sqrt(
      Math.pow(currentX - correctX, 2) + Math.pow(currentY - correctY, 2)
    );
    
    if (distance < 30) {
      piece.set({
        borderColor: '#10b981',
        borderScaleFactor: 3,
      });
    } else {
      piece.set({
        borderColor: '#4f46e5',
        borderScaleFactor: 2,
      });
    }
    
    fabricCanvas?.renderAll();
  };

  const handlePieceMoved = (e: any) => {
    const piece = e.target as PuzzlePiece;
    if (!piece.puzzleData) return;

    const correctX = piece.puzzleData.correctX;
    const correctY = piece.puzzleData.correctY;
    const currentX = piece.left!;
    const currentY = piece.top!;
    
    const distance = Math.sqrt(
      Math.pow(currentX - correctX, 2) + Math.pow(currentY - correctY, 2)
    );
    
    // Snap to correct position if close enough
    if (distance < 30) {
      piece.set({
        left: correctX,
        top: correctY,
        selectable: false,
        borderColor: '#10b981',
      });
      
      piece.puzzleData.isPlaced = true;
      
      // Check if puzzle is complete
      const allPlaced = pieces.every(p => p.puzzleData?.isPlaced);
      if (allPlaced && !isCompleted) {
        setIsCompleted(true);
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }
      
      fabricCanvas?.renderAll();
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-primary mb-2">Jigsaw Sestavljanka</h2>
        <p className="text-muted-foreground">Povleci kose in sestavi sliko Zmajčka Tomija</p>
      </div>
      
      <div className="flex justify-center">
        <canvas ref={canvasRef} className="border-2 border-gray-300 rounded-lg shadow-lg" />
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Glavna plošča (levo) | Kosi za sestavljanje (desno)</p>
      </div>
    </div>
  );
};