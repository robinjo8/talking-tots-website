import { useState, useCallback, useRef, useEffect } from 'react';
import { BingoWord } from '@/data/bingoWordsR';

export interface BingoCell {
  word: BingoWord;
  isCompleted: boolean;
  isClicked: boolean;
  index: number;
}

interface UseBingoGameProps {
  words: BingoWord[];
  gridSize?: number;
  maxRepeat?: number;
  minWordsForWin?: number;
}

interface WinningLine {
  type: 'row' | 'column';
  index: number;
  cells: number[];
}

interface UseBingoGameReturn {
  grid: BingoCell[];
  drawnWord: BingoWord | null;
  isSpinning: boolean;
  showHint: boolean;
  showPopup: boolean;
  gameComplete: boolean;
  completedCount: number;
  winningLine: WinningLine | null;
  spinReel: () => void;
  handleCellClick: (index: number) => void;
  closePopup: () => void;
  resetGame: () => void;
}

// Row and column definitions for 4x4 grid
const ROWS = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15]
];

const COLUMNS = [
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15]
];

export const useBingoGame = ({ 
  words, 
  gridSize = 16, 
  maxRepeat = 3,
  minWordsForWin = 8
}: UseBingoGameProps): UseBingoGameReturn => {
  const [grid, setGrid] = useState<BingoCell[]>([]);
  const [drawnWord, setDrawnWord] = useState<BingoWord | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickedCellsRef = useRef<Set<number>>(new Set());

  // Check for BINGO win (complete row or column)
  const checkBingoWin = useCallback((currentGrid: BingoCell[]): WinningLine | null => {
    // Check rows
    for (let i = 0; i < ROWS.length; i++) {
      const row = ROWS[i];
      if (row.every(idx => currentGrid[idx].isCompleted)) {
        return { type: 'row', index: i, cells: row };
      }
    }
    
    // Check columns
    for (let i = 0; i < COLUMNS.length; i++) {
      const col = COLUMNS[i];
      if (col.every(idx => currentGrid[idx].isCompleted)) {
        return { type: 'column', index: i, cells: col };
      }
    }
    
    return null;
  }, []);

  // Initialize grid
  const initializeGrid = useCallback(() => {
    const newGrid: BingoCell[] = [];
    const wordCounts: Map<string, number> = new Map();
    
    for (let i = 0; i < gridSize; i++) {
      // Filter words that haven't exceeded max repeat
      const availableWords = words.filter(w => {
        const count = wordCounts.get(w.word) || 0;
        return count < maxRepeat;
      });
      
      // Pick random word from available
      const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      wordCounts.set(randomWord.word, (wordCounts.get(randomWord.word) || 0) + 1);
      
      newGrid.push({
        word: randomWord,
        isCompleted: false,
        isClicked: false,
        index: i
      });
    }
    
    setGrid(newGrid);
    setDrawnWord(null);
    setShowHint(false);
    setShowPopup(false);
    setGameComplete(false);
    setWinningLine(null);
    clickedCellsRef.current.clear();
  }, [words, gridSize, maxRepeat]);

  // Initialize on mount
  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  // Get uncompleted words still on grid
  const getActiveWords = useCallback(() => {
    const activeWordsSet = new Set<string>();
    grid.forEach(cell => {
      if (!cell.isCompleted) {
        activeWordsSet.add(cell.word.word);
      }
    });
    return Array.from(activeWordsSet);
  }, [grid]);

  // Spin the reel to draw a word
  const spinReel = useCallback(() => {
    if (isSpinning || gameComplete) return;
    
    // Clear hint timer
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
    setShowHint(false);
    clickedCellsRef.current.clear();
    
    // Reset clicked state on all cells
    setGrid(prev => prev.map(cell => ({ ...cell, isClicked: false })));
    
    const activeWords = getActiveWords();
    if (activeWords.length === 0) {
      setGameComplete(true);
      return;
    }
    
    setIsSpinning(true);
    
    // Simulate spinning animation for 2 seconds
    setTimeout(() => {
      // Pick random word from active words
      const randomWord = activeWords[Math.floor(Math.random() * activeWords.length)];
      const wordData = words.find(w => w.word === randomWord)!;
      
      setDrawnWord(wordData);
      setIsSpinning(false);
      
      // Start 10 second hint timer
      hintTimeoutRef.current = setTimeout(() => {
        setShowHint(true);
      }, 10000);
    }, 2000);
  }, [isSpinning, gameComplete, getActiveWords, words]);

  // Handle cell click
  const handleCellClick = useCallback((index: number) => {
    if (!drawnWord || isSpinning || showPopup) return;
    
    const cell = grid[index];
    
    // Check if cell matches drawn word and is not completed
    if (cell.word.word === drawnWord.word && !cell.isCompleted && !cell.isClicked) {
      clickedCellsRef.current.add(index);
      
      // Mark cell as clicked
      setGrid(prev => prev.map((c, i) => 
        i === index ? { ...c, isClicked: true } : c
      ));
      
      // Check if all instances of this word are clicked
      const matchingCells = grid.filter(c => c.word.word === drawnWord.word && !c.isCompleted);
      const allClicked = matchingCells.every(c => 
        c.isClicked || clickedCellsRef.current.has(c.index)
      );
      
      if (allClicked) {
        // Clear hint timer
        if (hintTimeoutRef.current) {
          clearTimeout(hintTimeoutRef.current);
          hintTimeoutRef.current = null;
        }
        setShowHint(false);
        
        // Show popup
        setShowPopup(true);
      }
    }
  }, [drawnWord, isSpinning, grid, showPopup]);

  // Close popup and mark cells as completed
  const closePopup = useCallback(() => {
    // Mark all clicked cells as completed
    const updatedGrid = grid.map(cell => ({
      ...cell,
      isCompleted: cell.isClicked ? true : cell.isCompleted,
      isClicked: false
    }));
    
    setGrid(updatedGrid);
    clickedCellsRef.current.clear();
    setShowPopup(false);
    setDrawnWord(null);
    
    // Count completed cells
    const newCompletedCount = updatedGrid.filter(c => c.isCompleted).length;
    
    // Check for BINGO win only if minimum words reached
    if (newCompletedCount >= minWordsForWin) {
      const win = checkBingoWin(updatedGrid);
      if (win) {
        setWinningLine(win);
        setGameComplete(true);
        return;
      }
    }
    
    // Check if all cells completed (fallback)
    if (newCompletedCount === gridSize) {
      setGameComplete(true);
    }
  }, [grid, checkBingoWin, minWordsForWin, gridSize]);

  // Reset game
  const resetGame = useCallback(() => {
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
    initializeGrid();
  }, [initializeGrid]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
    };
  }, []);

  const completedCount = grid.filter(c => c.isCompleted).length;

  return {
    grid,
    drawnWord,
    isSpinning,
    showHint,
    showPopup,
    gameComplete,
    completedCount,
    winningLine,
    spinReel,
    handleCellClick,
    closePopup,
    resetGame
  };
};
