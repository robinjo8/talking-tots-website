import React, { useEffect, useRef, useState } from "react";

interface SimplePuzzleProps {
  imageUrl: string;
  onComplete?: () => void;
  className?: string;
}

export const SimplePuzzle: React.FC<SimplePuzzleProps> = ({
  imageUrl,
  onComplete,
  className = ""
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    // Test image loading first
    const testImg = new Image();
    testImg.crossOrigin = 'anonymous';
    
    testImg.onload = () => {
      console.log('Image loaded successfully:', imageUrl);
      setImageLoaded(true);
      setError(null);
      initializePuzzle(testImg);
    };
    
    testImg.onerror = (e) => {
      console.error('Failed to load image:', imageUrl, e);
      setError('Failed to load image: ' + imageUrl);
      setImageLoaded(false);
    };
    
    testImg.src = imageUrl;
  }, [imageUrl]);

  const initializePuzzle = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Clear canvas
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the image scaled to fit
    const scale = Math.min(300 / img.width, 200 / img.height);
    const width = img.width * scale;
    const height = img.height * scale;
    
    // Draw complete image in the center-left as reference
    ctx.drawImage(img, 50, 50, width, height);
    
    // Add border around the reference
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, width, height);

    // Draw grid lines to show piece divisions
    const pieceWidth = width / 3;
    const pieceHeight = height / 3;
    
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    
    // Vertical lines
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(50 + i * pieceWidth, 50);
      ctx.lineTo(50 + i * pieceWidth, 50 + height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(50, 50 + i * pieceHeight);
      ctx.lineTo(50 + width, 50 + i * pieceHeight);
      ctx.stroke();
    }

    // Create individual pieces on the right side
    const rightStartX = 400;
    let currentY = 50;
    
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const sx = col * (img.width / 3);
        const sy = row * (img.height / 3);
        const sw = img.width / 3;
        const sh = img.height / 3;
        
        const dx = rightStartX;
        const dy = currentY;
        const dw = pieceWidth * 0.8;
        const dh = pieceHeight * 0.8;
        
        // Draw piece
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        
        // Add border
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        ctx.strokeRect(dx, dy, dw, dh);
        
        currentY += dh + 10;
        if (currentY > 300) {
          currentY = 50;
        }
      }
    }

    // Add labels
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sestavljena slika', 50 + width/2, 35);
    ctx.fillText('Kosi za sestavljanje', rightStartX + 60, 35);
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-primary mb-2">Simple Puzzle Test</h2>
        <p className="text-muted-foreground">Testing image loading: {imageUrl}</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {!imageLoaded && !error && (
        <div className="text-center py-8">
          <p>Loading image...</p>
        </div>
      )}
      
      <div className="flex justify-center">
        <canvas 
          ref={canvasRef} 
          className="border-2 border-gray-300 rounded-lg shadow-lg max-w-full"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Status: {imageLoaded ? '✅ Image loaded' : error ? '❌ Failed' : '⏳ Loading...'}
        </p>
      </div>
    </div>
  );
};