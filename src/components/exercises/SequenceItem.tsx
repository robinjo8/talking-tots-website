import { useState, useRef } from "react";
import { SequenceImage } from "@/hooks/useSequenceGame";

interface SequenceItemProps {
  image: SequenceImage;
  index: number;
  isDraggable: boolean;
  isTarget?: boolean;
  onDragStart?: (index: number) => void;
  onDragOver?: (index: number) => void;
  onDrop?: (index: number) => void;
}

export const SequenceItem = ({
  image,
  index,
  isDraggable,
  isTarget = false,
  onDragStart,
  onDragOver,
  onDrop
}: SequenceItemProps) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const draggedElement = useRef<HTMLDivElement | null>(null);
  const imageUrl = image.image_url || '';

  const handleDragStart = (e: React.DragEvent) => {
    if (!isDraggable) return;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", index.toString());
    onDragStart?.(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isDraggable) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDraggedOver(true);
    onDragOver?.(index);
  };

  const handleDragLeave = () => {
    setIsDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isDraggable) return;
    e.preventDefault();
    setIsDraggedOver(false);
    onDrop?.(index);
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isDraggable) return;
    setIsTouching(true);
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    onDragStart?.(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggable || !isTouching) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggable || !isTouching) return;
    setIsTouching(false);
    
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Find the closest SequenceItem
    let targetElement = element;
    while (targetElement && !targetElement.hasAttribute('data-sequence-index')) {
      targetElement = targetElement.parentElement;
    }
    
    if (targetElement) {
      const targetIndex = parseInt(targetElement.getAttribute('data-sequence-index') || '');
      if (!isNaN(targetIndex) && targetIndex !== index) {
        onDrop?.(targetIndex);
      }
    }
    
    touchStartPos.current = null;
  };

  return (
    <div
      ref={draggedElement}
      data-sequence-index={index}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`
        relative w-full aspect-square rounded-lg overflow-hidden
        ${isDraggable ? 'cursor-move hover:scale-105 active:scale-110 touch-none' : 'cursor-default'}
        ${isDraggedOver && isDraggable ? 'ring-4 ring-primary' : ''}
        ${isTouching ? 'ring-4 ring-primary scale-110 z-50' : ''}
        ${isTarget ? 'border-4 border-primary shadow-lg' : 'border-2 border-border shadow-md'}
        transition-all duration-200 bg-card
      `}
    >
      <img
        src={imageUrl}
        alt={image.word || 'Slika'}
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  );
};
