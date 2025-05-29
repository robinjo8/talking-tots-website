
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Undo, Lightbulb, HelpCircle, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  size: number;
  canUndo: boolean;
  isWon: boolean;
  onSizeChange: (size: number) => void;
  onUndo: () => void;
  onHint: () => void;
  onShowInstructions: () => void;
  onNewGame: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  size,
  canUndo,
  isWon,
  onSizeChange,
  onUndo,
  onHint,
  onShowInstructions,
  onNewGame
}) => {
  return (
    <div className="w-full space-y-3">
      {/* Size Selector - Always prominently visible */}
      <div className="flex items-center justify-center gap-2 px-2">
        <span className="text-sm font-medium text-gray-700 min-w-fit">Velikost:</span>
        <Select value={size.toString()} onValueChange={(value) => onSizeChange(parseInt(value))}>
          <SelectTrigger className="w-24 h-9 text-sm font-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3×3</SelectItem>
            <SelectItem value="4">4×4</SelectItem>
            <SelectItem value="5">5×5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons - Fully responsive grid that adapts to screen size */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 px-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-9 text-xs sm:text-sm flex items-center justify-center gap-1 min-w-0"
        >
          <Undo className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="hidden sm:inline truncate">Razveljavi</span>
          <span className="sm:hidden">Razv.</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onHint}
          disabled={isWon}
          className="h-9 text-xs sm:text-sm flex items-center justify-center gap-1 min-w-0"
        >
          <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="hidden sm:inline truncate">Namig</span>
          <span className="sm:hidden">Nam.</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onShowInstructions} 
          className="h-9 text-xs sm:text-sm flex items-center justify-center gap-1 min-w-0"
        >
          <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="hidden sm:inline truncate">Kako</span>
          <span className="sm:hidden">?</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNewGame}
          className="h-9 text-xs sm:text-sm flex items-center justify-center gap-1 min-w-0"
        >
          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="hidden sm:inline truncate">Nova</span>
          <span className="sm:hidden">Nov.</span>
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
