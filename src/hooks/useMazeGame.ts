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

  const COLS = cols;
  const ROWS = rows;

  // Generate maze using Recursive Backtracker algorithm
  const generateMaze = useCallback(() => {
    setIsGenerating(true);
    
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

    // Add 1-2 dead ends to make the maze more interesting
    const addDeadEnds = (grid: Cell[][]): void => {
      const deadEndsToAdd = 1 + Math.floor(Math.random() * 2);
      let deadEndsAdded = 0;
      
      for (let y = 1; y < ROWS - 1 && deadEndsAdded < deadEndsToAdd; y++) {
        for (let x = 1; x < COLS - 1 && deadEndsAdded < deadEndsToAdd; x++) {
          const cell = grid[y][x];
          const openings = [
            !cell.walls.top, !cell.walls.right, 
            !cell.walls.bottom, !cell.walls.left
          ].filter(Boolean).length;
          
          // If cell has only 1 opening, try to create a dead end branch
          if (openings === 1 && Math.random() > 0.7) {
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

    setMaze(grid);
    setPlayerPosition({ x: 0, y: 0 });
    setIsCompleted(false);
    setIsGenerating(false);
  }, []);

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

        // Check if reached goal (last 2 cells in bottom row)
        if (nextPos.y === ROWS - 1 && (nextPos.x === COLS - 1 || nextPos.x === COLS - 2)) {
          setIsCompleted(true);
          canMove = false;
        }
      }
    }

    setPlayerPosition(newPos);
  }, [maze, playerPosition, isCompleted]);

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
    COLS,
    ROWS
  };
};
