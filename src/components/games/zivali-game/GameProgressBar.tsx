
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface GameProgressBarProps {
  progress: number;
}

export function GameProgressBar({ progress }: GameProgressBarProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Napredek:</span>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
