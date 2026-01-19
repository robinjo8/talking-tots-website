import { useState, useEffect, useCallback } from 'react';

export interface Cell {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
}

export interface Position {
  x: number;
  y: number;
}

interface UseMazeGameProps {
  cols?: number;
  rows?: number;
}

export const useMazeGame = ({ cols = 8, rows = 12 }: UseMazeGameProps = {}) => {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [starPositions, setStarPositions] = useState<Position[]>([]);
  const [collectedStars, setCollectedStars] = useState<number[]>([]);

  const COLS = cols;
  const ROWS = rows;

  // Generate maze using Recursive Backtracker algorithm
  const generateMaze = useCallback(() => {
    console.log('MazeGame: generateMaze start', { cols: COLS, rows: ROWS });
    setIsGenerating(true);
    setCollectedStars([]);
    
    // Initialize grid
    const grid: Cell[][] = [];
    for (let y = 0; y < ROWS; y++) {
      grid[y] = [];
      for (let x = 0; x < COLS; x++) {
        grid[y][x] = {
          x,
          y,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false
        };
      }
    }

    // Recursive backtracker
    const stack: Position[] = [];
    let current: Position = { x: 0, y: 0 };
    grid[0][0].visited = true;

    const getUnvisitedNeighbors = (pos: Position): Position[] => {
      const neighbors: Position[] = [];
      const { x, y } = pos;

      if (y > 0 && !grid[y - 1][x].visited) neighbors.push({ x, y: y - 1 });
      if (x < COLS - 1 && !grid[y][x + 1].visited) neighbors.push({ x: x + 1, y });
      if (y < ROWS - 1 && !grid[y + 1][x].visited) neighbors.push({ x, y: y + 1 });
      if (x > 0 && !grid[y][x - 1].visited) neighbors.push({ x: x - 1, y });

      return neighbors;
    };

    const removeWalls = (current: Position, next: Position) => {
      const dx = next.x - current.x;
      const dy = next.y - current.y;

      if (dx === 1) {
        grid[current.y][current.x].walls.right = false;
        grid[next.y][next.x].walls.left = false;
      } else if (dx === -1) {
        grid[current.y][current.x].walls.left = false;
        grid[next.y][next.x].walls.right = false;
      } else if (dy === 1) {
        grid[current.y][current.x].walls.bottom = false;
        grid[next.y][next.x].walls.top = false;
      } else if (dy === -1) {
        grid[current.y][current.x].walls.top = false;
        grid[next.y][next.x].walls.bottom = false;
      }
    };

    while (true) {
      const neighbors = getUnvisitedNeighbors(current);

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        stack.push(current);
        removeWalls(current, next);
        current = next;
        grid[current.y][current.x].visited = true;
      } else if (stack.length > 0) {
        current = stack.pop()!;
      } else {
        break;
      }
    }

    // Add 3-5 extra paths to make the maze more interesting with multiple routes
    const addDeadEnds = (grid: Cell[][]): void => {
      const deadEndsToAdd = 3 + Math.floor(Math.random() * 3);
      let deadEndsAdded = 0;
      
      for (let y = 1; y < ROWS - 1 && deadEndsAdded < deadEndsToAdd; y++) {
        for (let x = 1; x < COLS - 1 && deadEndsAdded < deadEndsToAdd; x++) {
          const cell = grid[y][x];
          const openings = [
            !cell.walls.top, !cell.walls.right, 
            !cell.walls.bottom, !cell.walls.left
          ].filter(Boolean).length;
          
          // If cell has 1-2 openings, try to create alternative paths
          if (openings <= 2 && Math.random() > 0.4) {
            const directions: Array<{ dir: keyof Cell['walls'], dx: number, dy: number }> = [
              { dir: 'top', dx: 0, dy: -1 },
              { dir: 'right', dx: 1, dy: 0 },
              { dir: 'bottom', dx: 0, dy: 1 },
              { dir: 'left', dx: -1, dy: 0 }
            ];
            
            const closedWalls = directions.filter(d => cell.walls[d.dir]);
            if (closedWalls.length > 0) {
              const randomWall = closedWalls[Math.floor(Math.random() * closedWalls.length)];
              const nextX = x + randomWall.dx;
              const nextY = y + randomWall.dy;
              
              // Check bounds
              if (nextX >= 0 && nextX < COLS && nextY >= 0 && nextY < ROWS) {
                // Open the walls
                cell.walls[randomWall.dir] = false;
                const oppositeDir = 
                  randomWall.dir === 'top' ? 'bottom' :
                  randomWall.dir === 'bottom' ? 'top' :
                  randomWall.dir === 'left' ? 'right' : 'left';
                grid[nextY][nextX].walls[oppositeDir] = false;
                deadEndsAdded++;
              }
            }
          }
        }
      }
    };

    addDeadEnds(grid);

    // BLOCK the goal cell by closing ALL walls around it
    // This ensures goal is completely inaccessible until unlocked
    const goalCell = grid[ROWS - 1][COLS - 1];
    
    // Close walls on the goal cell
    goalCell.walls.top = true;
    goalCell.walls.left = true;
    
    // Close corresponding walls on adjacent cells
    if (ROWS > 1) {
      grid[ROWS - 2][COLS - 1].walls.bottom = true; // Cell above goal
    }
    if (COLS > 1) {
      grid[ROWS - 1][COLS - 2].walls.right = true; // Cell left of goal
    }

    // Find positions for 4 stars (dead-ends or cells with few openings)
    // Stars are placed OUTSIDE the goal zone since goal is now walled off
    const findStarPositions = (grid: Cell[][]): Position[] => {
      const candidates: { pos: Position; openings: number }[] = [];
      
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          // Skip start (0,0) and goal (COLS-1, ROWS-1)
          if ((x === 0 && y === 0) || (x === COLS - 1 && y === ROWS - 1)) continue;
          
          const cell = grid[y][x];
          const openings = [
            !cell.walls.top, !cell.walls.right, 
            !cell.walls.bottom, !cell.walls.left
          ].filter(Boolean).length;
          
          // Only consider cells that have at least one opening (are reachable)
          if (openings > 0) {
            candidates.push({ pos: { x, y }, openings });
          }
        }
      }
      
      // Sort by openings (prefer dead-ends with 1 opening, then 2 openings)
      candidates.sort((a, b) => a.openings - b.openings);
      
      // Select 4 positions spread across the maze (excluding bottom-right quadrant near goal)
      const selected: Position[] = [];
      const quadrants = [
        { minX: 0, maxX: Math.floor(COLS / 2), minY: 0, maxY: Math.floor(ROWS / 2) },           // top-left
        { minX: Math.floor(COLS / 2), maxX: COLS, minY: 0, maxY: Math.floor(ROWS / 2) },        // top-right
        { minX: 0, maxX: Math.floor(COLS / 2), minY: Math.floor(ROWS / 2), maxY: ROWS },        // bottom-left
        { minX: Math.floor(COLS / 2), maxX: COLS - 1, minY: Math.floor(ROWS / 2), maxY: ROWS - 1 } // bottom-right (excluding goal row/col)
      ];
      
      // Try to pick one star from each quadrant
      for (const quadrant of quadrants) {
        const quadrantCandidates = candidates.filter(c => 
          c.pos.x >= quadrant.minX && c.pos.x < quadrant.maxX &&
          c.pos.y >= quadrant.minY && c.pos.y < quadrant.maxY &&
          !selected.some(s => s.x === c.pos.x && s.y === c.pos.y)
        );
        
        if (quadrantCandidates.length > 0) {
          // Pick a random one from the best candidates (lowest openings)
          const bestOpenings = quadrantCandidates[0].openings;
          const bestCandidates = quadrantCandidates.filter(c => c.openings <= bestOpenings + 1);
          const chosen = bestCandidates[Math.floor(Math.random() * bestCandidates.length)];
          selected.push(chosen.pos);
        }
      }
      
      // If we don't have 4, fill from remaining candidates (excluding goal area)
      while (selected.length < 4 && candidates.length > 0) {
        const remaining = candidates.filter(c => 
          !selected.some(s => s.x === c.pos.x && s.y === c.pos.y) &&
          !(c.pos.x === COLS - 1 && c.pos.y === ROWS - 1) // Exclude goal
        );
        if (remaining.length > 0) {
          selected.push(remaining[0].pos);
        } else {
          break;
        }
      }
      
      return selected;
    };

    const stars = findStarPositions(grid);
    setStarPositions(stars);

    setMaze(grid);
    setPlayerPosition({ x: 0, y: 0 });
    setIsCompleted(false);
    console.log('MazeGame: generateMaze done', { cols: COLS, rows: ROWS, stars });
    setIsGenerating(false);
  }, [COLS, ROWS]);

  // Collect a star at given index
  const collectStar = useCallback((starIndex: number) => {
    setCollectedStars(prev => {
      if (prev.includes(starIndex)) return prev;
      return [...prev, starIndex];
    });
  }, []);

  // Check if player is on a star position
  const getStarAtPosition = useCallback((pos: Position): number | null => {
    const index = starPositions.findIndex(
      star => star.x === pos.x && star.y === pos.y
    );
    if (index !== -1 && !collectedStars.includes(index)) {
      return index;
    }
    return null;
  }, [starPositions, collectedStars]);

  // Check if goal should be unlocked (all 4 stars collected)
  const isGoalUnlocked = collectedStars.length >= 4;

  // Unlock the goal by opening walls when all stars are collected
  useEffect(() => {
    if (!isGoalUnlocked || maze.length === 0) return;
    
    console.log('🔓 Unlocking goal - opening walls!');
    
    // Open the walls to the goal
    setMaze(prevMaze => {
      const newMaze = prevMaze.map(row => row.map(cell => ({
        ...cell,
        walls: { ...cell.walls }
      })));
      
      const goalCell = newMaze[ROWS - 1][COLS - 1];
      
      // Open top wall of goal and bottom wall of cell above
      if (ROWS > 1) {
        goalCell.walls.top = false;
        newMaze[ROWS - 2][COLS - 1].walls.bottom = false;
      }
      
      // Open left wall of goal and right wall of cell to the left
      if (COLS > 1) {
        goalCell.walls.left = false;
        newMaze[ROWS - 1][COLS - 2].walls.right = false;
      }
      
      console.log('🔓 Goal walls opened:', goalCell.walls);
      
      return newMaze;
    });
  }, [isGoalUnlocked, ROWS, COLS]);

  // Move player until hitting a wall or intersection
  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!maze.length || isCompleted) return;

    let newPos = { ...playerPosition };
    let canMove = true;

    while (canMove) {
      const currentCell = maze[newPos.y][newPos.x];
      let nextPos = { ...newPos };

      // Determine next position
      switch (direction) {
        case 'up':
          if (!currentCell.walls.top && newPos.y > 0) {
            nextPos.y -= 1;
          } else {
            canMove = false;
          }
          break;
        case 'down':
          if (!currentCell.walls.bottom && newPos.y < ROWS - 1) {
            nextPos.y += 1;
          } else {
            canMove = false;
          }
          break;
        case 'left':
          if (!currentCell.walls.left && newPos.x > 0) {
            nextPos.x -= 1;
          } else {
            canMove = false;
          }
          break;
        case 'right':
          if (!currentCell.walls.right && newPos.x < COLS - 1) {
            nextPos.x += 1;
          } else {
            canMove = false;
          }
          break;
      }

      if (canMove) {
        newPos = nextPos;
        
        // Check if at intersection (has more than 2 open paths)
        const nextCell = maze[nextPos.y][nextPos.x];
        const openPaths = [
          !nextCell.walls.top,
          !nextCell.walls.right,
          !nextCell.walls.bottom,
          !nextCell.walls.left
        ].filter(Boolean).length;

        if (openPaths > 2) {
          canMove = false; // Stop at intersection
        }

        // Check if on a star position (stop to collect)
        const starIndex = starPositions.findIndex(
          star => star.x === nextPos.x && star.y === nextPos.y
        );
        if (starIndex !== -1 && !collectedStars.includes(starIndex)) {
          canMove = false; // Stop at uncollected star
        }

        // Check if reached goal (bottom-right corner cell only)
        if (nextPos.y === ROWS - 1 && nextPos.x === COLS - 1) {
          setIsCompleted(true);
          canMove = false;
        }
      }
    }

    setPlayerPosition(newPos);
  }, [maze, playerPosition, isCompleted, COLS, ROWS, starPositions, collectedStars]);

  // Generate maze on mount
  useEffect(() => {
    generateMaze();
  }, [generateMaze]);

  return {
    maze,
    playerPosition,
    isCompleted,
    isGenerating,
    movePlayer,
    generateMaze,
    starPositions,
    collectedStars,
    collectStar,
    getStarAtPosition,
    isGoalUnlocked,
    COLS,
    ROWS
  };
};
