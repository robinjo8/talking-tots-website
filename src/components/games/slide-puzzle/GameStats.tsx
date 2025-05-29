
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
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
      <span className="font-medium">Čas: {formatTime(time)}</span>
      <span className="font-medium">Poteze: {moves}</span>
      {bestTime && (
        <span className="text-green-600 font-medium">
          Rekord: {formatTime(bestTime)}
        </span>
      )}
    </div>
  );
};

export default GameStats;
