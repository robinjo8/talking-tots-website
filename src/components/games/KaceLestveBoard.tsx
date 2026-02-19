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

// Snake colors
const SNAKE_COLORS = [
  { body: '#E53935', outline: '#7F0000' },
  { body: '#43A047', outline: '#1B5E20' },
  { body: '#1E88E5', outline: '#0D47A1' },
];

function SnakeSVG({ from, to, styleIdx }: { from: number; to: number; styleIdx: number }) {
  const head = getPositionCenter(from);
  const tail = getPositionCenter(to);
  const color = SNAKE_COLORS[styleIdx] || SNAKE_COLORS[0];

  const headR = 3.0;

  const dx = tail.x - head.x;
  const dy = tail.y - head.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const perpX = (-dy / len) * len * 0.18;
  const perpY = (dx / len) * len * 0.18;

  const midX = (head.x + tail.x) / 2;
  const midY = (head.y + tail.y) / 2;

  // Smooth S-curve using cubic bezier + smooth bezier (S command) — no spikes
  const cp1x = head.x + dx * 0.33 + perpX;
  const cp1y = head.y + dy * 0.33 + perpY;
  const cp2x = tail.x - dx * 0.33 + perpX;
  const cp2y = tail.y - dy * 0.33 + perpY;
  const cp4x = tail.x - dx * 0.12 - perpX;
  const cp4y = tail.y - dy * 0.12 - perpY;

  const spine = `M ${head.x} ${head.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${midX} ${midY} S ${cp4x} ${cp4y}, ${tail.x} ${tail.y}`;

  // Tail tip direction
  const tailDirX = tail.x - cp4x;
  const tailDirY = tail.y - cp4y;
  const tailLen = Math.sqrt(tailDirX * tailDirX + tailDirY * tailDirY) || 1;
  const tnx = tailDirX / tailLen;
  const tny = tailDirY / tailLen;
  const tipX = tail.x + tnx * 1.0;
  const tipY = tail.y + tny * 1.0;
  const tipL = { x: tail.x - tny * 0.7, y: tail.y + tnx * 0.7 };
  const tipR = { x: tail.x + tny * 0.7, y: tail.y - tnx * 0.7 };

  // Head direction
  const headDirX = head.x - cp1x;
  const headDirY = head.y - cp1y;
  const headLen2 = Math.sqrt(headDirX * headDirX + headDirY * headDirY) || 1;
  const hnx = headDirX / headLen2;
  const hny = headDirY / headLen2;
  const epx = -hny;
  const epy = hnx;

  const headAngleDeg = Math.atan2(hny, hnx) * (180 / Math.PI);
  const noseX = head.x - hnx * (headR * 1.15);
  const noseY = head.y - hny * (headR * 1.15);

  return (
    <g>
      {/* Shadow */}
      <path d={spine} stroke="rgba(0,0,0,0.08)" strokeWidth="3.8" fill="none" strokeLinecap="round" transform="translate(0.2,0.2)" />
      {/* Body outline */}
      <path d={spine} stroke={color.outline} strokeWidth="3.0" fill="none" strokeLinecap="round" />
      {/* Body fill */}
      <path d={spine} stroke={color.body} strokeWidth="1.9" fill="none" strokeLinecap="round" />
      {/* Shine */}
      <path d={spine} stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" fill="none" strokeLinecap="round" strokeDasharray="2,8" />

      {/* Tail tip */}
      <polygon
        points={`${tipX},${tipY} ${tipL.x},${tipL.y} ${tipR.x},${tipR.y}`}
        fill={color.outline}
      />

      {/* Head — ellipse oriented along body direction */}
      <ellipse
        cx={head.x} cy={head.y}
        rx={headR * 1.35} ry={headR}
        fill={color.outline}
        transform={`rotate(${headAngleDeg}, ${head.x}, ${head.y})`}
      />
      <ellipse
        cx={head.x} cy={head.y}
        rx={headR * 1.2} ry={headR * 0.85}
        fill={color.body}
        transform={`rotate(${headAngleDeg}, ${head.x}, ${head.y})`}
      />

      {/* Eyes */}
      <circle cx={head.x + epx * 1.3} cy={head.y + epy * 1.3} r="1.3" fill="white" />
      <circle cx={head.x - epx * 1.3} cy={head.y - epy * 1.3} r="1.3" fill="white" />
      <circle cx={head.x + epx * 1.3} cy={head.y + epy * 1.3} r="0.7" fill="#111" />
      <circle cx={head.x - epx * 1.3} cy={head.y - epy * 1.3} r="0.7" fill="#111" />
      <circle cx={head.x + epx * 1.3 + 0.3} cy={head.y + epy * 1.3 - 0.3} r="0.25" fill="white" />
      <circle cx={head.x - epx * 1.3 + 0.3} cy={head.y - epy * 1.3 - 0.3} r="0.25" fill="white" />

      {/* Nostrils */}
      <circle cx={noseX + epx * 0.45} cy={noseY + epy * 0.45} r="0.35" fill={color.outline} />
      <circle cx={noseX - epx * 0.45} cy={noseY - epy * 0.45} r="0.35" fill={color.outline} />

      {/* Mouth — curved line */}
      <path
        d={`M ${head.x + epx * 0.9 - hnx * 0.3} ${head.y + epy * 0.9 - hny * 0.3} Q ${noseX} ${noseY + epy * 0.2} ${head.x - epx * 0.9 - hnx * 0.3} ${head.y - epy * 0.9 - hny * 0.3}`}
        stroke={color.outline} strokeWidth="0.45" fill="none" strokeLinecap="round"
      />
    </g>
  );
}

// Ladders — classic brown/orange cartoon style
const LADDER_COLOR = { rail: '#7B3F00', rung: '#C1440E', outline: '#4A2500' };

function LadderSVG({ from, to, styleIdx: _styleIdx }: { from: number; to: number; styleIdx: number }) {
  const foot = getPositionCenter(from);
  const top = getPositionCenter(to);

  const dx = top.x - foot.x;
  const dy = top.y - foot.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  const perpX = (-dy / len) * 2.8;
  const perpY = (dx / len) * 2.8;

  const leftFoot = { x: foot.x + perpX, y: foot.y + perpY };
  const rightFoot = { x: foot.x - perpX, y: foot.y - perpY };
  const leftTop = { x: top.x + perpX, y: top.y + perpY };
  const rightTop = { x: top.x - perpX, y: top.y - perpY };

  const rungCount = Math.max(2, Math.round(len / 9));
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
      <line x1={leftFoot.x + 0.25} y1={leftFoot.y + 0.25} x2={leftTop.x + 0.25} y2={leftTop.y + 0.25}
        stroke="rgba(0,0,0,0.12)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={rightFoot.x + 0.25} y1={rightFoot.y + 0.25} x2={rightTop.x + 0.25} y2={rightTop.y + 0.25}
        stroke="rgba(0,0,0,0.12)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Rail outline */}
      <line x1={leftFoot.x} y1={leftFoot.y} x2={leftTop.x} y2={leftTop.y}
        stroke={LADDER_COLOR.outline} strokeWidth="2.4" strokeLinecap="round" />
      <line x1={rightFoot.x} y1={rightFoot.y} x2={rightTop.x} y2={rightTop.y}
        stroke={LADDER_COLOR.outline} strokeWidth="2.4" strokeLinecap="round" />
      {/* Rails */}
      <line x1={leftFoot.x} y1={leftFoot.y} x2={leftTop.x} y2={leftTop.y}
        stroke={LADDER_COLOR.rail} strokeWidth="1.6" strokeLinecap="round" />
      <line x1={rightFoot.x} y1={rightFoot.y} x2={rightTop.x} y2={rightTop.y}
        stroke={LADDER_COLOR.rail} strokeWidth="1.6" strokeLinecap="round" />
      {/* Rung outlines */}
      {rungs.map((r, i) => (
        <line key={`out-${i}`} x1={r.lx} y1={r.ly} x2={r.rx} y2={r.ry}
          stroke={LADDER_COLOR.outline} strokeWidth="2.0" strokeLinecap="round" />
      ))}
      {/* Rungs */}
      {rungs.map((r, i) => (
        <line key={`rung-${i}`} x1={r.lx} y1={r.ly} x2={r.rx} y2={r.ry}
          stroke={LADDER_COLOR.rung} strokeWidth="1.4" strokeLinecap="round" />
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
      {/* SVG overlay for snakes and ladders — z-index: 1, BEHIND the board grid */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {ladderEntries.map(({ from, to, styleIdx }) => (
          <LadderSVG key={`ladder-${from}`} from={from} to={to} styleIdx={styleIdx} />
        ))}
        {snakeEntries.map(({ from, to, styleIdx }) => (
          <SnakeSVG key={`snake-${from}`} from={from} to={to} styleIdx={styleIdx} />
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
