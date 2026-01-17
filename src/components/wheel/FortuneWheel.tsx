import React from 'react';
import { RotateCw } from 'lucide-react';

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
  
  // Create SVG path for each segment as a donut shape (not reaching center)
  const createSegmentPath = (index: number) => {
    const startAngle = index * segmentAngle - 90; // Start from top
    const endAngle = startAngle + segmentAngle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const outerRadius = 45; // Outer edge
    const innerRadius = 10; // Inner edge - creates hole for button
    const centerX = 50;
    const centerY = 50;
    
    // Outer arc points
    const outerX1 = centerX + outerRadius * Math.cos(startRad);
    const outerY1 = centerY + outerRadius * Math.sin(startRad);
    const outerX2 = centerX + outerRadius * Math.cos(endRad);
    const outerY2 = centerY + outerRadius * Math.sin(endRad);
    
    // Inner arc points
    const innerX1 = centerX + innerRadius * Math.cos(startRad);
    const innerY1 = centerY + innerRadius * Math.sin(startRad);
    const innerX2 = centerX + innerRadius * Math.cos(endRad);
    const innerY2 = centerY + innerRadius * Math.sin(endRad);
    
    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
    
    // Path: inner start → outer start → outer arc → outer end → inner end → inner arc (reverse)
    return `M ${innerX1} ${innerY1} L ${outerX1} ${outerY1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerX2} ${outerY2} L ${innerX2} ${innerY2} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1} Z`;
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

      {/* Wheel Container - only the wheel rotates */}
      <div className="relative aspect-square">
        <div 
          className="w-full h-full"
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
            
            {/* Center circle to cover segment tips - drawn AFTER segments */}
            
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
        </div>

        {/* Center Spin Button - single clean button that covers segment tips */}
        <button
          onClick={onSpin}
          disabled={isSpinning}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[24%] aspect-square rounded-full flex items-center justify-center transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(251,146,60,0.8)] disabled:cursor-not-allowed border-4 border-white"
          style={{
            background: 'linear-gradient(135deg, hsl(40, 95%, 55%) 0%, hsl(25, 95%, 50%) 100%)',
            boxShadow: '0 4px 20px rgba(251, 146, 60, 0.5)',
          }}
        >
          <RotateCw 
            className="w-8 h-8 md:w-10 md:h-10 text-white"
          />
        </button>
      </div>
    </div>
  );
};
