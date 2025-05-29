
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
    <div className="space-y-3">
      {/* Size Selector - Always visible */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm font-medium whitespace-nowrap">Velikost:</span>
        <Select value={size.toString()} onValueChange={(value) => onSizeChange(parseInt(value))}>
          <SelectTrigger className="w-20 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3×3</SelectItem>
            <SelectItem value="4">4×4</SelectItem>
            <SelectItem value="5">5×5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons - Responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-9 text-xs sm:text-sm flex items-center justify-center gap-1"
        >
          <Undo className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Razveljavi</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onHint}
          disabled={isWon}
          className="h-9 text-xs sm:text-sm flex items-center justify-center gap-1"
        >
          <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Namig</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onShowInstructions} 
          className="h-9 text-xs sm:text-sm flex items-center justify-center gap-1"
        >
          <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Kako</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNewGame}
          className="h-9 text-xs sm:text-sm flex items-center justify-center gap-1"
        >
          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Nova</span>
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
