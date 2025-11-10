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
        height: '150px',
        ...(position === 'top' ? { transform: flip ? 'rotate(180deg)' : 'none' } : {})
      }}
    >
      <svg
        className="relative block w-full"
        style={{ height: '150px' }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 150"
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 C150,60 300,120 450,80 C600,40 750,100 900,70 C1050,40 1150,90 1200,60 L1200,0 L0,0 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
};
