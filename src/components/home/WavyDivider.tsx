interface WavyDividerProps {
  color?: 'green' | 'white';
  position?: 'top' | 'bottom';
  flip?: boolean;
}

export const WavyDivider = ({ 
  color = 'green', 
  position = 'bottom',
  flip = false 
}: WavyDividerProps) => {
  const fillColor = color === 'green' ? '#4CAF50' : '#ffffff';
  
  return (
    <div 
      className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden leading-[0] ${flip ? 'transform rotate-180' : ''}`}
      style={{ 
        height: '80px',
        ...(position === 'top' ? { transform: flip ? 'rotate(180deg)' : 'none' } : {})
      }}
    >
      <svg
        className="relative block w-full"
        style={{ height: '80px' }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C300,100 400,20 600,60 C800,100 900,20 1200,60 L1200,0 L0,0 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
};
