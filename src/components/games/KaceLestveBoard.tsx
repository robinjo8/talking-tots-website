import { useMemo } from "react";
import {
  BOARD_SIZE,
  LADDERS,
  SNAKES,
  getBoardPosition,
  getCellColor,
} from "@/data/kaceLestveConfig";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";

interface PlayerPosition {
  position: number;
  color: string;
  name: string;
}

interface KaceLestveBoard2DProps {
  players: PlayerPosition[];
}

// Get pixel center of a cell given row/col in an 8x8 grid
// cellSize is the % size of each cell (12.5%)
function getCellCenter(row: number, col: number) {
  return {
    x: col * 12.5 + 6.25,
    y: row * 12.5 + 6.25,
  };
}

function getPositionCenter(position: number) {
  if (position <= 0) return { x: 6.25, y: 93.75 }; // off-board start
  if (position >= 64) {
    // Merged END cell = positions 63+64
    // Col 0 in top row (row 0), left side
    return { x: 6.25, y: 6.25 };
  }
  const rowFromBottom = Math.floor((position - 1) / 8);
  const indexInRow = (position - 1) % 8;
  const row = 7 - rowFromBottom;
  const col = rowFromBottom % 2 === 0 ? indexInRow : 7 - indexInRow;
  return getCellCenter(row, col);
}

// Draw a snake as SVG path from head to tail
function SnakeSVG({ from, to, id }: { from: number; to: number; id: string }) {
  const head = getPositionCenter(from);
  const tail = getPositionCenter(to);
  // Control points for a wavy snake body
  const midX = (head.x + tail.x) / 2;
  const midY = (head.y + tail.y) / 2;
  const offset = 8;
  const path = `M ${head.x} ${head.y} C ${head.x + offset} ${midY - offset}, ${tail.x - offset} ${midY + offset}, ${tail.x} ${tail.y}`;
  
  return (
    <g key={id}>
      {/* Body */}
      <path
        d={path}
        stroke="#16a34a"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="none"
        strokeLinecap="round"
      />
      {/* Scale pattern */}
      <path
        d={path}
        stroke="#4ade80"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="3,3"
        strokeLinecap="round"
      />
      {/* Snake head (circle with eyes) */}
      <circle cx={head.x} cy={head.y} r="3.2" fill="#16a34a" />
      <circle cx={head.x - 1} cy={head.y - 1} r="0.6" fill="white" />
      <circle cx={head.x + 1} cy={head.y - 1} r="0.6" fill="white" />
      {/* Smiley on head */}
      <path
        d={`M ${head.x - 0.8} ${head.y + 0.5} Q ${head.x} ${head.y + 1.5} ${head.x + 0.8} ${head.y + 0.5}`}
        stroke="white"
        strokeWidth="0.4"
        fill="none"
      />
      {/* Tail */}
      <circle cx={tail.x} cy={tail.y} r="1.5" fill="#16a34a" opacity="0.7" />
    </g>
  );
}

// Draw a ladder from bottom (foot) to top
function LadderSVG({ from, to, id }: { from: number; to: number; id: string }) {
  const foot = getPositionCenter(from);
  const top = getPositionCenter(to);
  
  const dx = top.x - foot.x;
  const dy = top.y - foot.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  
  // Perpendicular offset for the two rails
  const perpX = (-dy / len) * 1.5;
  const perpY = (dx / len) * 1.5;
  
  const leftFoot = { x: foot.x + perpX, y: foot.y + perpY };
  const rightFoot = { x: foot.x - perpX, y: foot.y - perpY };
  const leftTop = { x: top.x + perpX, y: top.y + perpY };
  const rightTop = { x: top.x - perpX, y: top.y - perpY };
  
  // Rungs
  const rungCount = Math.max(2, Math.round(len / 8));
  const rungs = [];
  for (let i = 0; i <= rungCount; i++) {
    const t = i / rungCount;
    rungs.push({
      lx: leftFoot.x + (leftTop.x - leftFoot.x) * t,
      ly: leftFoot.y + (leftTop.y - leftFoot.y) * t,
      rx: rightFoot.x + (rightTop.x - rightFoot.x) * t,
      ry: rightFoot.y + (rightTop.y - rightFoot.y) * t,
    });
  }
  
  return (
    <g key={id}>
      {/* Rails */}
      <line x1={leftFoot.x} y1={leftFoot.y} x2={leftTop.x} y2={leftTop.y} stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      <line x1={rightFoot.x} y1={rightFoot.y} x2={rightTop.x} y2={rightTop.y} stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      {/* Rungs */}
      {rungs.map((r, i) => (
        <line key={i} x1={r.lx} y1={r.ly} x2={r.rx} y2={r.ry} stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
      ))}
    </g>
  );
}

export function KaceLestveBoard({ players }: KaceLestveBoard2DProps) {
  // Build grid cells
  const cells = useMemo(() => {
    const result: Array<{ pos: number; row: number; col: number; color: string; isStart: boolean; isEnd: boolean; hasLadderBottom: boolean; hasSnakeHead: boolean }> = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const pos = getBoardPosition(row, col);
        const isStart = pos <= 2;
        const isEnd = pos >= 63;
        result.push({
          pos,
          row,
          col,
          color: getCellColor(pos),
          isStart,
          isEnd,
          hasLadderBottom: LADDERS[pos] !== undefined,
          hasSnakeHead: SNAKES[pos] !== undefined,
        });
      }
    }
    return result;
  }, []);

  return (
    <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
      {/* Board grid */}
      <div className="w-full h-full grid grid-cols-8 grid-rows-8 border-2 border-gray-400 rounded-xl overflow-hidden shadow-2xl">
        {cells.map((cell) => {
          // Find players on this cell
          const playersHere = players.filter((p) => {
            if (cell.isStart && p.position <= 0) return true;
            if (cell.isEnd && p.position >= 63) return true;
            return p.position === cell.pos;
          });

          return (
            <div
              key={`${cell.row}-${cell.col}`}
              className="relative border border-gray-200 flex flex-col items-center justify-center overflow-hidden"
              style={{ backgroundColor: cell.color }}
            >
              {/* Cell number */}
              {!cell.isStart && !cell.isEnd && (
                <span className="absolute top-0.5 left-0.5 text-[6px] font-bold text-gray-500 leading-none z-10">
                  {cell.pos}
                </span>
              )}

              {/* START label */}
              {cell.isStart && cell.pos === 1 && (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <span className="text-[7px] font-black text-green-800">START</span>
                  <span className="text-base">🚀</span>
                </div>
              )}
              {cell.isStart && cell.pos === 2 && (
                <div className="w-full h-full" />
              )}

              {/* END label */}
              {cell.isEnd && cell.pos === 63 && (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <span className="text-[7px] font-black text-yellow-800">KONEC</span>
                  <span className="text-base">⭐</span>
                </div>
              )}
              {cell.isEnd && cell.pos === 64 && (
                <div className="w-full h-full" />
              )}

              {/* Ladder indicator */}
              {cell.hasLadderBottom && (
                <span className="text-sm z-10">🪜</span>
              )}

              {/* Snake head indicator */}
              {cell.hasSnakeHead && (
                <span className="text-sm z-10">🐍</span>
              )}

              {/* Players */}
              {playersHere.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center gap-0.5 z-20">
                  {playersHere.map((p, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.name.charAt(0)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SVG overlay for snakes and ladders */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Ladders */}
        {Object.entries(LADDERS).map(([from, to]) => (
          <LadderSVG key={`ladder-${from}`} from={Number(from)} to={to} id={`ladder-${from}`} />
        ))}
        {/* Snakes */}
        {Object.entries(SNAKES).map(([from, to]) => (
          <SnakeSVG key={`snake-${from}`} from={Number(from)} to={to} id={`snake-${from}`} />
        ))}
      </svg>
    </div>
  );
}
