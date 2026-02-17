import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProgressCircles } from './ProgressCircles';
import { cn } from '@/lib/utils';

interface WordData {
  word: string;
  image: string;
  audio: string;
}

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: WordData[];
  progress: { [word: string]: number };
  letter: string;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  words,
  progress,
  letter
}) => {
  const completedCount = Object.values(progress).filter(count => count >= 3).length;
  const totalWords = words.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-dragon-green">
            Napredek - Glas {letter}
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Osvojenih besed: <span className="font-bold text-dragon-green">{completedCount}/{totalWords}</span>
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 py-4">
          {words.map((wordData) => {
            const count = progress[wordData.word] || 0;
            const isCompleted = count >= 3;
            const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${wordData.image}`;
            
            return (
              <div
                key={wordData.word}
                className={cn(
                  'flex flex-col items-center p-2 rounded-lg transition-all',
                  isCompleted 
                    ? 'bg-yellow-50 ring-2 ring-yellow-400' 
                    : 'bg-gray-50'
                )}
              >
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={wordData.word}
                    className={cn(
                      'w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2',
                      isCompleted ? 'border-yellow-400' : 'border-gray-200'
                    )}
                  />
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 text-lg">⭐</div>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium mt-1 text-center truncate w-full">
                  {wordData.word}
                </span>
                <ProgressCircles count={count} size="sm" className="mt-1" />
                <span className="text-xs text-muted-foreground">{count}/3</span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
