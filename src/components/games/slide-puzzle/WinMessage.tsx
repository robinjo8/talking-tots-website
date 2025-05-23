
import React from 'react';

interface WinMessageProps {
  moves: number;
  time: number;
  isNewRecord: boolean;
}

const WinMessage: React.FC<WinMessageProps> = ({ moves, time, isNewRecord }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-shrink-0 p-4 text-center bg-green-50 border-t border-green-200">
      <div className="text-lg font-bold text-green-700 mb-1">
        Čestitamo! 🎉
      </div>
      <div className="text-sm text-green-600">
        Rešili ste sestavljanko v {moves} potezah in {formatTime(time)}!
        {isNewRecord && (
          <span className="block font-semibold text-yellow-600">🏆 Nov rekord!</span>
        )}
      </div>
    </div>
  );
};

export default WinMessage;
