import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressCirclesProps {
  count: number; // 0, 1, 2, or 3
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export const ProgressCircles: React.FC<ProgressCirclesProps> = ({
  count,
  size = 'md',
  className,
  animate = false
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2'
  };

  return (
    <div className={cn('flex items-center justify-center', gapClasses[size], className)}>
      {[0, 1, 2].map((index) => {
        const isFilled = index < count;
        return (
          <div
            key={index}
            className={cn(
              sizeClasses[size],
              'rounded-full border-2 transition-all duration-300',
              isFilled 
                ? 'bg-green-500 border-green-600' 
                : 'bg-gray-200 border-gray-300',
              animate && isFilled && 'animate-pulse'
            )}
          />
        );
      })}
    </div>
  );
};
