import React from 'react';
import { Play } from 'lucide-react';

interface FortuneWheelProps {
  segmentCount: number;
  rotation: number;
  isSpinning: boolean;
  onSpin: () => void;
  selectedIndex: number | null;
}

// Beautiful gradient colors for segments
const SEGMENT_COLORS = [
  'hsl(0, 85%, 60%)',    // Red
  'hsl(25, 95%, 55%)',   // Orange
  'hsl(45, 95%, 55%)',   // Yellow-Orange
  'hsl(60, 90%, 50%)',   // Yellow
  'hsl(90, 70%, 50%)',   // Light Green
  'hsl(140, 70%, 45%)',  // Green
  'hsl(175, 70%, 45%)',  // Teal
  'hsl(200, 80%, 55%)',  // Light Blue
  'hsl(220, 80%, 60%)',  // Blue
  'hsl(260, 70%, 60%)',  // Purple
  'hsl(290, 70%, 55%)',  // Magenta
  'hsl(330, 80%, 55%)',  // Pink
];

export const FortuneWheel: React.FC<FortuneWheelProps> = ({
  segmentCount,
  rotation,
  isSpinning,
  onSpin,
  selectedIndex,
}) => {
  const segmentAngle = 360 / segmentCount;
  
  // Create SVG path for each segment
  const createSegmentPath = (index: number) => {
    const startAngle = index * segmentAngle - 90; // Start from top
    const endAngle = startAngle + segmentAngle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const radius = 45; // Percentage of viewBox
    const centerX = 50;
    const centerY = 50;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Calculate text position for segment number
  const getTextPosition = (index: number) => {
    const angle = index * segmentAngle + segmentAngle / 2 - 90;
    const rad = (angle * Math.PI) / 180;
    const radius = 32; // Distance from center for text
    return {
      x: 50 + radius * Math.cos(rad),
      y: 50 + radius * Math.sin(rad),
      rotation: angle + 90,
    };
  };

  return (
    <div className="relative w-full max-w-[400px] md:max-w-[500px] mx-auto">
      {/* Pointer/Arrow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
        <div 
          className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[35px] border-l-transparent border-r-transparent border-t-red-600"
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
          }}
        />
      </div>

      {/* Wheel Container */}
      <div 
        className="relative aspect-square"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning 
            ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' 
            : 'none',
        }}
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full drop-shadow-2xl"
        >
          {/* Outer ring */}
          <circle 
            cx="50" 
            cy="50" 
            r="48" 
            fill="none" 
            stroke="hsl(35, 90%, 50%)" 
            strokeWidth="3"
            className="drop-shadow-lg"
          />
          
          {/* Segments */}
          {Array.from({ length: segmentCount }).map((_, index) => {
            const textPos = getTextPosition(index);
            const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length];
            const isSelected = selectedIndex === index && !isSpinning;
            
            return (
              <g key={index}>
                {/* Segment path */}
                <path
                  d={createSegmentPath(index)}
                  fill={color}
                  stroke="white"
                  strokeWidth="0.5"
                  className={isSelected ? 'brightness-125' : ''}
                />
                
                {/* Segment number */}
                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="5"
                  fontWeight="bold"
                  style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  }}
                  transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
                >
                  {index + 1}
                </text>
              </g>
            );
          })}

          {/* Gradient definitions */}
          <defs>
            <radialGradient id="centerGradient">
              <stop offset="0%" stopColor="hsl(35, 95%, 60%)" />
              <stop offset="100%" stopColor="hsl(25, 95%, 45%)" />
            </radialGradient>
          </defs>
        </svg>

        {/* Center Spin Button - positioned absolutely in center */}
        <button
          onClick={onSpin}
          disabled={isSpinning}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-70 disabled:cursor-not-allowed border-4 border-white ${!isSpinning ? 'animate-pulse' : ''}`}
          style={{
            boxShadow: '0 4px 20px rgba(251, 146, 60, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.3)',
          }}
        >
          <Play 
            className={`w-8 h-8 md:w-10 md:h-10 text-white ml-1 ${isSpinning ? 'animate-spin' : ''}`} 
            fill="white"
          />
        </button>
      </div>
    </div>
  );
};
