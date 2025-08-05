import { Connection } from '@/hooks/useMatchingGame';
import { useEffect, useState, useRef } from 'react';

interface ConnectionLineProps {
  connections: Connection[];
  containerRef: React.RefObject<HTMLDivElement>;
}

interface LineCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  id: string;
}

export function ConnectionLine({ connections, containerRef }: ConnectionLineProps) {
  const [lines, setLines] = useState<LineCoordinates[]>([]);

  useEffect(() => {
    if (!containerRef.current || connections.length === 0) {
      setLines([]);
      return;
    }

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const newLines: LineCoordinates[] = connections.map(connection => {
      // Find the DOM elements for from and to positions
      const fromElement = container.querySelector(
        `[data-image-id="${connection.from.imageId}"][data-column="${connection.from.column}"][data-index="${connection.from.index}"]`
      ) as HTMLElement;
      
      const toElement = container.querySelector(
        `[data-image-id="${connection.to.imageId}"][data-column="${connection.to.column}"][data-index="${connection.to.index}"]`
      ) as HTMLElement;

      if (!fromElement || !toElement) {
        console.warn('Could not find elements for connection', connection);
        return { x1: 0, y1: 0, x2: 0, y2: 0, id: connection.id };
      }

      const fromRect = fromElement.getBoundingClientRect();
      const toRect = toElement.getBoundingClientRect();

      // Calculate center points relative to container
      const x1 = fromRect.left - containerRect.left + fromRect.width / 2;
      const y1 = fromRect.top - containerRect.top + fromRect.height / 2;
      const x2 = toRect.left - containerRect.left + toRect.width / 2;
      const y2 = toRect.top - containerRect.top + toRect.height / 2;

      return { x1, y1, x2, y2, id: connection.id };
    });

    setLines(newLines);
  }, [connections, containerRef]);

  if (lines.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
    >
      {lines.map(line => (
        <line
          key={line.id}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="hsl(var(--dragon-green))"
          strokeWidth="3"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />
      ))}
    </svg>
  );
}