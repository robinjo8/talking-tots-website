
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
    <div className="flex items-center gap-4 text-sm">
      <span>Čas: {formatTime(time)}</span>
      <span>Poteze: {moves}</span>
      {bestTime && (
        <span className="text-green-600">
          Rekord: {formatTime(bestTime)}
        </span>
      )}
    </div>
  );
};

export default GameStats;
