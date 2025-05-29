
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
    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
      {/* Size Selector */}
      <div className="flex items-center gap-2 order-1 xs:order-1">
        <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Velikost:</span>
        <Select value={size.toString()} onValueChange={(value) => onSizeChange(parseInt(value))}>
          <SelectTrigger className="w-14 sm:w-16 h-7 sm:h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3×3</SelectItem>
            <SelectItem value="4">4×4</SelectItem>
            <SelectItem value="5">5×5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons - Responsive grid layout */}
      <div className="grid grid-cols-2 xs:flex gap-1 order-2 xs:order-2 w-full xs:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-7 sm:h-8 px-1 sm:px-2 text-xs min-w-0"
        >
          <Undo className="h-3 w-3" />
          <span className="hidden sm:inline ml-1">Razveljavi</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onHint}
          disabled={isWon}
          className="h-7 sm:h-8 px-1 sm:px-2 text-xs min-w-0"
        >
          <Lightbulb className="h-3 w-3" />
          <span className="hidden sm:inline ml-1">Namig</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onShowInstructions} 
          className="h-7 sm:h-8 px-1 sm:px-2 text-xs min-w-0"
        >
          <HelpCircle className="h-3 w-3" />
          <span className="hidden sm:inline ml-1">Kako</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNewGame}
          className="h-7 sm:h-8 px-1 sm:px-2 text-xs min-w-0"
        >
          <RotateCcw className="h-3 w-3" />
          <span className="hidden sm:inline ml-1">Nova</span>
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
