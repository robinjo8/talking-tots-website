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

// Get pixel center of a cell based on board dimensions
function getCellCenterPx(
  row: number,
  col: number,
  boardW: number,
  boardH: number
) {
  const cellW = boardW / COLS;
  const cellH = boardH / ROWS;
  return {
    x: col * cellW + cellW / 2,
    y: row * cellH + cellH / 2,
  };
}

function getPositionCenterPx(
  position: number,
  boardW: number,
  boardH: number
) {
  const cellW = boardW / COLS;
  const cellH = boardH / ROWS;
  if (position <= 0) {
    return { x: cellW / 2, y: (ROWS - 1) * cellH + cellH / 2 };
  }
  if (position >= BOARD_SIZE) {
    return { x: (COLS - 1) * cellW + cellW / 2, y: cellH / 2 };
  }
  const { row, col } = getGridCell(position);
  return getCellCenterPx(row, col, boardW, boardH);
}

// Per-arrow custom offsets (in fractions of cell size)
interface ArrowOffsets {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
}

const ARROW_OFFSETS: Record<string, ArrowOffsets> = {
  // Ladders (blue, up)
  "3-11":  { endX: 0.32, endY: -0.33 },       // end right-center of 11
  "15-27": {},                                 // end bottom-center of 27 (default ladder end)
  // Snakes (red, down)
  "24-14": { endX: -0.32, endY: 0.33 },       // end left-center of 14
  "40-34": { startX: -0.32, startY: -0.33 },  // start left-center of 40
  // 21-9, 31-19: default center offsets
};

// Curved arrow in pixel space
function CurvedArrow({
  from,
  to,
  color,
  stripeColor,
  outline,
  curveSide,
  boardW,
  boardH,
  isLadder,
}: {
  from: number;
  to: number;
  color: string;
  stripeColor: string;
  outline: string;
  curveSide: 1 | -1;
  boardW: number;
  boardH: number;
  isLadder: boolean;
}) {
  const cellW = boardW / COLS;
  const cellH = boardH / ROWS;
  // Offset from cell center so arrows don't overlap the number
  const edgeOffset = cellH * 0.33;

  const startRaw = getPositionCenterPx(from, boardW, boardH);
  const endRaw = getPositionCenterPx(to, boardW, boardH);

  // Custom per-arrow offsets
  const key = `${from}-${to}`;
  const offsets = ARROW_OFFSETS[key] || {};

  // Ladders (blue, up): start ABOVE center of from-cell, end BELOW center of to-cell
  // Snakes (red, down): start BELOW center of from-cell, end ABOVE center of to-cell
  const start = {
    x: startRaw.x + (offsets.startX ?? 0) * cellW,
    y: (startRaw.y + (offsets.startY ?? 0) * cellH) + (isLadder ? -edgeOffset : edgeOffset),
  };
  const end = {
    x: endRaw.x + (offsets.endX ?? 0) * cellW,
    y: (endRaw.y + (offsets.endY ?? 0) * cellH) + (isLadder ? edgeOffset : -edgeOffset),
  };

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;

  // Perpendicular offset for gentle S-curve
  const perpX = (-dy / len) * len * 0.28 * curveSide;
  const perpY = (dx / len) * len * 0.28 * curveSide;

  const cp1x = start.x + dx * 0.35 + perpX;
  const cp1y = start.y + dy * 0.35 + perpY;
  const cp2x = start.x + dx * 0.65 + perpX;
  const cp2y = start.y + dy * 0.65 + perpY;

  const path = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;

  // Arrow head direction: tangent at end of bezier
  const tangentX = end.x - cp2x;
  const tangentY = end.y - cp2y;
  const tLen = Math.sqrt(tangentX * tangentX + tangentY * tangentY) || 1;
  const nx = tangentX / tLen;
  const ny = tangentY / tLen;

  // Arrow dimensions (1.5x of the "half" size = 0.016)
  const strokeW = Math.min(boardW, boardH) * 0.016;
  const arrowSize = Math.min(boardW, boardH) * 0.038;

  // Arrow head: single clean triangle (no double-polygon dot artifact)
  const baseX = end.x - nx * arrowSize;
  const baseY = end.y - ny * arrowSize;
  const perpNx = -ny;
  const perpNy = nx;
  const p1 = { x: end.x, y: end.y };
  const p2 = { x: baseX + perpNx * arrowSize * 0.55, y: baseY + perpNy * arrowSize * 0.55 };
  const p3 = { x: baseX - perpNx * arrowSize * 0.55, y: baseY - perpNy * arrowSize * 0.55 };

  // Shorten the path so the body doesn't overlap the arrowhead
  const shortenedEnd = {
    x: end.x - nx * arrowSize * 0.75,
    y: end.y - ny * arrowSize * 0.75,
  };
  const shortenedPath = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${shortenedEnd.x} ${shortenedEnd.y}`;

  return (
    <g>
      {/* Shadow */}
      <path
        d={shortenedPath}
        stroke="rgba(0,0,0,0.18)"
        strokeWidth={strokeW + 1.5}
        fill="none"
        strokeLinecap="round"
        transform="translate(1,1)"
      />
      {/* Outline */}
      <path d={shortenedPath} stroke={outline} strokeWidth={strokeW + 1.2} fill="none" strokeLinecap="round" />
      {/* Body */}
      <path d={shortenedPath} stroke={color} strokeWidth={strokeW} fill="none" strokeLinecap="round" />
      {/* Center stripe — elegant light line */}
      <path
        d={shortenedPath}
        stroke={stripeColor}
        strokeWidth={strokeW * 0.32}
        fill="none"
        strokeLinecap="round"
        opacity={0.85}
      />
      {/* Arrow head — single polygon, no dot artifact */}
      <polygon
        points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
        fill={color}
        stroke={outline}
        strokeWidth={0.8}
        strokeLinejoin="round"
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

  const boardW = boardRect ? boardRect.width : 0;
  const boardH = boardRect ? boardRect.height : 0;
  const cellW = boardW / COLS;
  const cellH = boardH / ROWS;

  // Build cells but merge START (1+2) and END (41+42) visually
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
      {/* SVG overlay for arrows */}
      {boardW > 0 && boardH > 0 && (
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 5, width: boardW, height: boardH }}
          width={boardW}
          height={boardH}
        >
          {ladderEntries.map(({ from, to }, i) => (
            <CurvedArrow
              key={`ladder-${from}`}
              from={from}
              to={to}
              color="#1E88E5"
              stripeColor="#82B1FF"
              outline="#0D47A1"
              curveSide={(from === 15 ? -1 : i % 2 === 0 ? 1 : -1) as 1 | -1}
              boardW={boardW}
              boardH={boardH}
              isLadder={true}
            />
          ))}
          {snakeEntries.map(({ from, to }, i) => (
            <CurvedArrow
              key={`snake-${from}`}
              from={from}
              to={to}
              color="#E53935"
              stripeColor="#FF8A80"
              outline="#7F0000"
              // Snake 40→31 curves left (away from KONEC field)
              curveSide={(from === 40 ? 1 : i % 2 === 0 ? -1 : 1) as 1 | -1}
              boardW={boardW}
              boardH={boardH}
              isLadder={false}
            />
          ))}
        </svg>
      )}

      {/* Board grid — z-index: 2 */}
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
          const isStartBlank = cell.isStart && cell.pos === 2;
          const isEndLabel = cell.isEnd && cell.pos === 41;
          const isEndBlank = cell.isEnd && cell.pos === 42;

          return (
            <div
              key={`${cell.row}-${cell.col}`}
              className="relative flex items-center justify-center overflow-hidden"
              style={{
                backgroundColor: cell.color,
                borderRight: isStartLabel || isEndLabel ? 'none' : '1px solid rgba(0,0,0,0.15)',
                borderLeft: isStartBlank || isEndBlank ? 'none' : undefined,
                borderBottom: '1px solid rgba(0,0,0,0.15)',
              }}
            >
              {/* Regular cell number */}
              {!cell.isStart && !cell.isEnd && (
                <span
                  className="font-black leading-none select-none"
                  style={{
                    fontSize: 'clamp(10px, 2.5vw, 22px)',
                    color: cell.textColor,
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                    position: 'relative',
                    zIndex: 10,
                  }}
                >
                  {cell.pos}
                </span>
              )}

              {/* START — yellow background, no label */}
              {isStartLabel && (
                <div
                  className="absolute inset-0"
                  style={{ zIndex: 10, backgroundColor: '#FFD93D' }}
                />
              )}
              {isStartBlank && (
                <div className="absolute inset-0" style={{ backgroundColor: '#FFD93D' }} />
              )}

              {/* END — pos 41: plain orange; pos 42: Cilj.webp image */}
              {isEndLabel && (
                <div
                  className="absolute inset-0"
                  style={{ zIndex: 10, backgroundColor: '#FF6B35' }}
                />
              )}
              {isEndBlank && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: '#FF6B35' }}
                >
                  <img
                    src={`${SUPABASE_URL}/slike-ostalo/Cilj.webp`}
                    alt="Cilj"
                    className="w-full h-full object-contain"
                    style={{ padding: '2px' }}
                  />
                </div>
              )}
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
          const size = Math.min(cellW, cellH) * 0.63;

          return (
            <motion.div
              key={`player-${idx}`}
              className="absolute pointer-events-none"
              style={{ zIndex: 30, width: size, height: size }}
              animate={{ left: x, top: y }}
              transition={{ type: 'spring', stiffness: 200, damping: 22, duration: 0.5 }}
            >
              <img
                src={`${SUPABASE_URL}/zmajcki/${idx === 0 ? 'Zmajcek_modra_figura_1.webp' : 'Zmajcek_rdeca_figura_1.webp'}`}
                alt={player.name}
                className="w-full h-full object-contain"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
