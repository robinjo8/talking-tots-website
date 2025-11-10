interface WavyDividerProps {
  color?: 'green' | 'white';
  position?: 'top' | 'bottom';
}

export const WavyDivider = ({ 
  color = 'green', 
  position = 'bottom'
}: WavyDividerProps) => {
  const fillColor = color === 'green' ? '#4CAF50' : '#ffffff';
  
  // Different SVG paths based on position
  // For top: wave fills downward (starts high, fills to bottom)
  // For bottom: wave fills upward (starts low, fills to top)
  const pathData = position === 'top'
    ? "M0,50 C300,20 600,50 900,20 C1100,10 1200,30 1200,20 L1200,150 L0,150 Z"
    : "M0,100 C300,130 600,100 900,130 C1100,140 1200,120 1200,130 L1200,0 L0,0 Z";
  
  return (
    <div 
      className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden leading-[0]`}
      style={{ height: '120px' }}
    >
      <svg
        className="relative block w-full"
        style={{ height: '120px' }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 150"
        preserveAspectRatio="none"
      >
        <path
          d={pathData}
          fill={fillColor}
        />
      </svg>
    </div>
  );
};
