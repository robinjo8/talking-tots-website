
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
    <div className="w-full space-y-4">
      {/* Size Selector - Modern clean design */}
      <div className="flex items-center justify-center gap-3 px-4">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Velikost:</span>
        <Select value={size.toString()} onValueChange={(value) => onSizeChange(parseInt(value))}>
          <SelectTrigger className="w-20 h-10 text-sm font-medium border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-gray-300">
            <SelectItem value="3" className="text-sm font-medium">3×3</SelectItem>
            <SelectItem value="4" className="text-sm font-medium">4×4</SelectItem>
            <SelectItem value="5" className="text-sm font-medium">5×5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons - Modern grid layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4">
        <Button
          variant="outline"
          size="default"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-12 text-sm font-medium flex items-center justify-center gap-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 transition-all duration-200"
        >
          <Undo className="h-4 w-4 flex-shrink-0" />
          <span className="hidden sm:inline">Razveljavi</span>
          <span className="sm:hidden">Razv.</span>
        </Button>
        
        <Button
          variant="outline"
          size="default"
          onClick={onHint}
          disabled={isWon}
          className="h-12 text-sm font-medium flex items-center justify-center gap-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 transition-all duration-200"
        >
          <Lightbulb className="h-4 w-4 flex-shrink-0" />
          <span className="hidden sm:inline">Namig</span>
          <span className="sm:hidden">Nam.</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="default" 
          onClick={onShowInstructions} 
          className="h-12 text-sm font-medium flex items-center justify-center gap-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
        >
          <HelpCircle className="h-4 w-4 flex-shrink-0" />
          <span className="hidden sm:inline">Kako</span>
          <span className="sm:hidden">?</span>
        </Button>
        
        <Button
          variant="outline"
          size="default"
          onClick={onNewGame}
          className="h-12 text-sm font-medium flex items-center justify-center gap-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
        >
          <RotateCcw className="h-4 w-4 flex-shrink-0" />
          <span className="hidden sm:inline">Nova</span>
          <span className="sm:hidden">Nov.</span>
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
