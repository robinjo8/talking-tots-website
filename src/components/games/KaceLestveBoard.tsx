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
    const cellW = 100 / COLS;
    const cellH = 100 / ROWS;
    return { x: cellW, y: (ROWS - 1) * cellH + cellH / 2 };
  }
  if (position >= BOARD_SIZE) {
    const cellW = 100 / COLS;
    const cellH = 100 / ROWS;
    return { x: (COLS - 1) * cellW, y: cellH / 2 };
  }
  const { row, col } = getGridCell(position);
  return getCellCenter(row, col);
}

// Elegant curved arrow helper
function CurvedArrowSVG({
  from, to, color, outline, curveSide,
}: {
  from: number; to: number; color: string; outline: string; curveSide: 1 | -1;
}) {
  const start = getPositionCenter(from);
  const end = getPositionCenter(to);

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;

  // Perpendicular offset for gentle curve
  const perpX = (-dy / len) * len * 0.22 * curveSide;
  const perpY = (dx / len) * len * 0.22 * curveSide;

  // Single cubic bezier with two control points — smooth, no spikes
  const cp1x = start.x + dx * 0.35 + perpX;
  const cp1y = start.y + dy * 0.35 + perpY;
  const cp2x = start.x + dx * 0.65 + perpX;
  const cp2y = start.y + dy * 0.65 + perpY;

  const path = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;

  // Arrow head direction: tangent at the end of the bezier
  const tangentX = end.x - cp2x;
  const tangentY = end.y - cp2y;
  const tLen = Math.sqrt(tangentX * tangentX + tangentY * tangentY) || 1;
  const nx = tangentX / tLen;
  const ny = tangentY / tLen;

  // Arrow head triangle
  const arrowSize = 3.5;
  const baseX = end.x - nx * arrowSize;
  const baseY = end.y - ny * arrowSize;
  const perpNx = -ny;
  const perpNy = nx;
  const p1 = { x: end.x, y: end.y };
  const p2 = { x: baseX + perpNx * arrowSize * 0.55, y: baseY + perpNy * arrowSize * 0.55 };
  const p3 = { x: baseX - perpNx * arrowSize * 0.55, y: baseY - perpNy * arrowSize * 0.55 };

  return (
    <g>
      {/* Shadow */}
      <path d={path} stroke="rgba(0,0,0,0.12)" strokeWidth="4.5" fill="none" strokeLinecap="round" transform="translate(0.3,0.3)" />
      {/* Outline */}
      <path d={path} stroke={outline} strokeWidth="4.0" fill="none" strokeLinecap="round" />
      {/* Body */}
      <path d={path} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Shine */}
      <path d={path} stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeDasharray="3,7" />
      {/* Arrow head outline */}
      <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} fill={outline} />
      {/* Arrow head fill */}
      <polygon
        points={`${p1.x},${p1.y} ${p2.x + (p1.x - p2.x) * 0.15},${p2.y + (p1.y - p2.y) * 0.15} ${p3.x + (p1.x - p3.x) * 0.15},${p3.y + (p1.y - p3.y) * 0.15}`}
        fill={color}
      />
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
      {/* SVG overlay for snakes and ladders — z-index: 1, BEHIND the board grid */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {ladderEntries.map(({ from, to }, i) => (
          <CurvedArrowSVG key={`ladder-${from}`} from={from} to={to} color="#1E88E5" outline="#0D47A1" curveSide={(i % 2 === 0 ? 1 : -1) as 1 | -1} />
        ))}
        {snakeEntries.map(({ from, to }, i) => (
          <CurvedArrowSVG key={`snake-${from}`} from={from} to={to} color="#E53935" outline="#7F0000" curveSide={(i % 2 === 0 ? -1 : 1) as 1 | -1} />
        ))}
      </svg>

      {/* Board grid — z-index: 2, numbers appear above snakes/ladders */}
      <div
        className="absolute inset-0"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          border: '3px solid #4B5563',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        {cells.map((cell) => {
          const isStartLabel = cell.isStart && cell.pos === 1;
          const isEndLabel = cell.isEnd && cell.pos === 41;
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
              {/* Large cell number — sits above SVG since grid is z-index 2 */}
              {!cell.isStart && !cell.isEnd && (
                <span
                  className="font-black leading-none select-none"
                  style={{
                    fontSize: 'clamp(10px, 2.5vw, 22px)',
                    color: cell.textColor,
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                    position: 'relative',
                    zIndex: 3,
                  }}
                >
                  {cell.pos}
                </span>
              )}

              {/* START */}
              {isStartLabel && (
                <div className="flex flex-col items-center justify-center w-full h-full" style={{ zIndex: 3, position: 'relative' }}>
                  <span className="text-2xl">🚀</span>
                  <span className="font-black text-yellow-900 leading-none" style={{ fontSize: 'clamp(7px, 1.5vw, 13px)' }}>START</span>
                </div>
              )}
              {isStartBlank && <div className="w-full h-full" style={{ backgroundColor: '#FFD93D' }} />}

              {/* END */}
              {isEndLabel && (
                <div className="flex flex-col items-center justify-center w-full h-full" style={{ zIndex: 3, position: 'relative' }}>
                  <span className="text-2xl">⭐</span>
                  <span className="font-black text-white leading-none" style={{ fontSize: 'clamp(7px, 1.5vw, 13px)' }}>KONEC</span>
                </div>
              )}
              {isEndBlank && <div className="w-full h-full" style={{ backgroundColor: '#FF6B35' }} />}
            </div>
          );
        })}
      </div>

      {/* Dragon avatars — z-index: 30 */}
      <AnimatePresence>
        {boardRect && players.map((player, idx) => {
          let targetRow: number, targetCol: number;
          if (player.position <= 0) {
            targetRow = ROWS - 1;
            targetCol = 0;
          } else if (player.position >= BOARD_SIZE) {
            targetRow = 0;
            targetCol = COLS - 1;
          } else {
            const cell = getGridCell(player.position);
            targetRow = cell.row;
            targetCol = cell.col;
          }

          const offsetX = idx === 0 ? -cellW * 0.15 : cellW * 0.15;
          const x = targetCol * cellW + cellW / 2 + offsetX - cellW * 0.2;
          const y = targetRow * cellH + cellH / 2 - cellH * 0.2;
          const size = Math.min(cellW, cellH) * 0.55;

          return (
            <motion.div
              key={`player-${idx}`}
              className="absolute pointer-events-none"
              style={{ zIndex: 30, width: size, height: size }}
              animate={{ left: x, top: y }}
              transition={{ type: 'spring', stiffness: 200, damping: 22, duration: 0.5 }}
            >
              <img
                src={`${SUPABASE_URL}/zmajcki/${player.avatarUrl}`}
                alt={player.name}
                className="w-full h-full object-contain"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
              />
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
