import { useMemo, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  COLS,
  ROWS,
  BOARD_SIZE,
  LADDERS,
  SNAKES,
  getBoardPosition,
  getGridCell,
  getCellColor,
  getCellTextColor,
} from "@/data/kaceLestveConfig";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";

interface PlayerData {
  position: number;
  avatarUrl: string;
  name: string;
}

interface KaceLestveBoard2DProps {
  players: PlayerData[];
}

// Get SVG % center of a cell in the 6×7 grid
function getCellCenter(row: number, col: number) {
  const cellW = 100 / COLS;
  const cellH = 100 / ROWS;
  return {
    x: col * cellW + cellW / 2,
    y: row * cellH + cellH / 2,
  };
}

function getPositionCenter(position: number) {
  if (position <= 0) {
    // Start - bottom-left merged cell center
    const cellW = 100 / COLS;
    const cellH = 100 / ROWS;
    return { x: cellW, y: (ROWS - 1) * cellH + cellH / 2 };
  }
  if (position >= BOARD_SIZE) {
    // End - top-right merged cell center
    const cellW = 100 / COLS;
    const cellH = 100 / ROWS;
    return { x: (COLS - 1) * cellW, y: cellH / 2 };
  }
  const { row, col } = getGridCell(position);
  return getCellCenter(row, col);
}

// Snake colors per snake (head→tail)
const SNAKE_STYLES: { stroke1: string; stroke2: string; headFill: string }[] = [
  { stroke1: '#4ECDC4', stroke2: '#2196F3', headFill: '#2196F3' },   // 40→36: teal/blue
  { stroke1: '#FF6B6B', stroke2: '#FF8C00', headFill: '#FF6B6B' },   // 21→5: red/orange
  { stroke1: '#66BB6A', stroke2: '#FFEE58', headFill: '#66BB6A' },   // 24→8: green/yellow
];

function SnakeSVG({ from, to, styleIdx }: { from: number; to: number; styleIdx: number }) {
  const head = getPositionCenter(from);
  const tail = getPositionCenter(to);
  const style = SNAKE_STYLES[styleIdx] || SNAKE_STYLES[0];

  const id = `snake-grad-${from}`;
  // Wavy path
  const midX = (head.x + tail.x) / 2;
  const midY = (head.y + tail.y) / 2;
  const off1 = 10;
  const off2 = -10;
  const path = `M ${head.x} ${head.y} C ${head.x + off1} ${midY + off2}, ${tail.x - off1} ${midY + off1}, ${tail.x} ${tail.y}`;

  const headR = 3.5;

  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={style.stroke1} />
          <stop offset="100%" stopColor={style.stroke2} />
        </linearGradient>
      </defs>
      {/* Body shadow */}
      <path d={path} stroke="rgba(0,0,0,0.15)" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      {/* Body */}
      <path d={path} stroke={`url(#${id})`} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      {/* Scale pattern */}
      <path d={path} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" strokeDasharray="4,5" strokeLinecap="round" />

      {/* Head */}
      <circle cx={head.x} cy={head.y} r={headR + 0.5} fill="rgba(0,0,0,0.2)" />
      <circle cx={head.x} cy={head.y} r={headR} fill={style.headFill} />
      {/* Eyes */}
      <circle cx={head.x - 1.3} cy={head.y - 1.2} r="0.9" fill="white" />
      <circle cx={head.x + 1.3} cy={head.y - 1.2} r="0.9" fill="white" />
      <circle cx={head.x - 1.3} cy={head.y - 1.2} r="0.45" fill="#222" />
      <circle cx={head.x + 1.3} cy={head.y - 1.2} r="0.45" fill="#222" />
      {/* Smile */}
      <path
        d={`M ${head.x - 1.2} ${head.y + 0.8} Q ${head.x} ${head.y + 2} ${head.x + 1.2} ${head.y + 0.8}`}
        stroke="white" strokeWidth="0.5" fill="none"
      />
      {/* Tongue */}
      <path
        d={`M ${head.x} ${head.y + headR} L ${head.x} ${head.y + headR + 1.5} M ${head.x} ${head.y + headR + 1.5} L ${head.x - 0.7} ${head.y + headR + 2.5} M ${head.x} ${head.y + headR + 1.5} L ${head.x + 0.7} ${head.y + headR + 2.5}`}
        stroke="#FF1744" strokeWidth="0.6" fill="none" strokeLinecap="round"
      />

      {/* Tail tip */}
      <circle cx={tail.x} cy={tail.y} r="1.8" fill={style.stroke2} opacity="0.8" />
      <circle cx={tail.x} cy={tail.y} r="1.1" fill={style.stroke1} opacity="0.9" />
    </g>
  );
}

// Ladder colors
const LADDER_STYLES: { rail: string; rung: string }[] = [
  { rail: '#8B5E3C', rung: '#C8972B' },     // 3→12: brown/gold
  { rail: '#9C27B0', rung: '#E91E8C' },     // 6→18: purple/pink
  { rail: '#1976D2', rung: '#00BCD4' },     // 15→30: blue/cyan
  { rail: '#2E7D32', rung: '#FF9800' },     // 26→37: green/orange
];

function LadderSVG({ from, to, styleIdx }: { from: number; to: number; styleIdx: number }) {
  const foot = getPositionCenter(from);
  const top = getPositionCenter(to);
  const style = LADDER_STYLES[styleIdx] || LADDER_STYLES[0];

  const dx = top.x - foot.x;
  const dy = top.y - foot.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  const perpX = (-dy / len) * 2;
  const perpY = (dx / len) * 2;

  const leftFoot = { x: foot.x + perpX, y: foot.y + perpY };
  const rightFoot = { x: foot.x - perpX, y: foot.y - perpY };
  const leftTop = { x: top.x + perpX, y: top.y + perpY };
  const rightTop = { x: top.x - perpX, y: top.y - perpY };

  const rungCount = Math.max(3, Math.round(len / 7));
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
    <g>
      {/* Shadow */}
      <line x1={leftFoot.x + 0.5} y1={leftFoot.y + 0.5} x2={leftTop.x + 0.5} y2={leftTop.y + 0.5}
        stroke="rgba(0,0,0,0.15)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1={rightFoot.x + 0.5} y1={rightFoot.y + 0.5} x2={rightTop.x + 0.5} y2={rightTop.y + 0.5}
        stroke="rgba(0,0,0,0.15)" strokeWidth="3.5" strokeLinecap="round" />
      {/* Rails */}
      <line x1={leftFoot.x} y1={leftFoot.y} x2={leftTop.x} y2={leftTop.y}
        stroke={style.rail} strokeWidth="3" strokeLinecap="round" />
      <line x1={rightFoot.x} y1={rightFoot.y} x2={rightTop.x} y2={rightTop.y}
        stroke={style.rail} strokeWidth="3" strokeLinecap="round" />
      {/* Rungs */}
      {rungs.map((r, i) => (
        <line key={i} x1={r.lx} y1={r.ly} x2={r.rx} y2={r.ry}
          stroke={style.rung} strokeWidth="2.2" strokeLinecap="round" />
      ))}
    </g>
  );
}

export function KaceLestveBoard({ players }: KaceLestveBoard2DProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardRect, setBoardRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const update = () => {
      if (boardRef.current) setBoardRect(boardRef.current.getBoundingClientRect());
    };
    update();
    const ro = new ResizeObserver(update);
    if (boardRef.current) ro.observe(boardRef.current);
    return () => ro.disconnect();
  }, []);

  const cellW = boardRect ? boardRect.width / COLS : 0;
  const cellH = boardRect ? boardRect.height / ROWS : 0;

  const cells = useMemo(() => {
    const result: Array<{
      pos: number; row: number; col: number; color: string; textColor: string;
      isStart: boolean; isEnd: boolean;
    }> = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const pos = getBoardPosition(row, col);
        const isStart = pos <= 2;
        const isEnd = pos >= 41;
        result.push({
          pos, row, col,
          color: getCellColor(pos),
          textColor: getCellTextColor(pos),
          isStart, isEnd,
        });
      }
    }
    return result;
  }, []);

  const snakeEntries = useMemo(() => Object.entries(SNAKES).map(([from, to], i) => ({
    from: Number(from), to, styleIdx: i,
  })), []);

  const ladderEntries = useMemo(() => Object.entries(LADDERS).map(([from, to], i) => ({
    from: Number(from), to, styleIdx: i,
  })), []);

  return (
    <div className="relative w-full h-full" ref={boardRef}>
      {/* Board grid */}
      <div
        className="w-full h-full grid border-3 border-gray-600 rounded-xl overflow-hidden shadow-2xl"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          border: '3px solid #4B5563',
        }}
      >
        {cells.map((cell) => {
          const isStartLabel = cell.isStart && cell.pos === 1;
          const isEndLabel = cell.isEnd && cell.pos === 41;
          // Merge visuals: pos 2 is blank (part of start), pos 42 is blank (part of end)
          const isStartBlank = cell.isStart && cell.pos === 2;
          const isEndBlank = cell.isEnd && cell.pos === 42;

          return (
            <div
              key={`${cell.row}-${cell.col}`}
              className="relative flex items-center justify-center overflow-hidden"
              style={{
                backgroundColor: cell.color,
                borderRight: '1px solid rgba(0,0,0,0.15)',
                borderBottom: '1px solid rgba(0,0,0,0.15)',
              }}
            >
              {/* Large cell number */}
              {!cell.isStart && !cell.isEnd && (
                <span
                  className="font-black leading-none select-none"
                  style={{
                    fontSize: 'clamp(10px, 2.5vw, 22px)',
                    color: cell.textColor,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {cell.pos}
                </span>
              )}

              {/* START */}
              {isStartLabel && (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <span className="text-2xl">🚀</span>
                  <span className="font-black text-yellow-900 leading-none" style={{ fontSize: 'clamp(7px, 1.5vw, 13px)' }}>START</span>
                </div>
              )}
              {isStartBlank && <div className="w-full h-full" style={{ backgroundColor: '#FFD93D' }} />}

              {/* END */}
              {isEndLabel && (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <span className="text-2xl">⭐</span>
                  <span className="font-black text-white leading-none" style={{ fontSize: 'clamp(7px, 1.5vw, 13px)' }}>KONEC</span>
                </div>
              )}
              {isEndBlank && <div className="w-full h-full" style={{ backgroundColor: '#FF6B35' }} />}

              {/* Ladder icon */}
              {LADDERS[cell.pos] !== undefined && !cell.isStart && !cell.isEnd && (
                <span className="absolute bottom-0.5 right-0.5 text-xs opacity-70">🪜</span>
              )}
              {/* Snake icon */}
              {SNAKES[cell.pos] !== undefined && !cell.isStart && !cell.isEnd && (
                <span className="absolute bottom-0.5 right-0.5 text-xs opacity-70">🐍</span>
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
        {/* Draw ladders first (behind snakes) */}
        {ladderEntries.map(({ from, to, styleIdx }) => (
          <LadderSVG key={`ladder-${from}`} from={from} to={to} styleIdx={styleIdx} />
        ))}
        {/* Draw snakes on top */}
        {snakeEntries.map(({ from, to, styleIdx }) => (
          <SnakeSVG key={`snake-${from}`} from={from} to={to} styleIdx={styleIdx} />
        ))}
      </svg>

      {/* Dragon avatars with framer-motion animation */}
      <AnimatePresence>
        {boardRect && players.map((player, idx) => {
          let targetRow: number, targetCol: number;
          if (player.position <= 0) {
            // Start position: first merged cell
            targetRow = ROWS - 1;
            targetCol = 0;
          } else if (player.position >= BOARD_SIZE) {
            // End position: last merged cell (top right)
            targetRow = 0;
            targetCol = COLS - 1;
          } else {
            const cell = getGridCell(player.position);
            targetRow = cell.row;
            targetCol = cell.col;
          }

          // Pixel position (center of cell), offset slightly per player to avoid overlap
          const offsetX = idx === 0 ? -cellW * 0.15 : cellW * 0.15;
          const x = targetCol * cellW + cellW / 2 + offsetX - cellW * 0.2;
          const y = targetRow * cellH + cellH / 2 - cellH * 0.2;
          const size = Math.min(cellW, cellH) * 0.55;

          return (
            <motion.div
              key={`player-${idx}`}
              className="absolute z-30 pointer-events-none"
              animate={{ left: x, top: y }}
              transition={{ type: 'spring', stiffness: 200, damping: 22, duration: 0.5 }}
              style={{ width: size, height: size }}
            >
              <img
                src={`${SUPABASE_URL}/zmajcki/${player.avatarUrl}`}
                alt={player.name}
                className="w-full h-full object-contain drop-shadow-lg"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
              />
              {/* Player indicator ring */}
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-white font-black shadow-md"
                style={{
                  fontSize: 8,
                  backgroundColor: idx === 0 ? '#3B82F6' : '#EF4444',
                }}
              >
                {idx + 1}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
