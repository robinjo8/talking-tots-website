
import React from 'react';

interface GameStatsProps {
  time: number;
  moves: number;
  bestTime?: number;
}

const GameStats: React.FC<GameStatsProps> = ({ time, moves, bestTime }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm">
      <div className="flex items-center gap-1">
        <span className="font-medium text-gray-600">Čas:</span>
        <span className="font-bold text-blue-600">{formatTime(time)}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-gray-600">Poteze:</span>
        <span className="font-bold text-blue-600">{moves}</span>
      </div>
      {bestTime && (
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-600">Rekord:</span>
          <span className="font-bold text-green-600">{formatTime(bestTime)}</span>
        </div>
      )}
    </div>
  );
};

export default GameStats;
