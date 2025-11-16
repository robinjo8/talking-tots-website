import { useState, useRef, useEffect } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const draggedElement = useRef<HTMLDivElement | null>(null);
  const ghostElement = useRef<HTMLDivElement | null>(null);
  const imageUrl = image.image_url || '';

  useEffect(() => {
    return () => {
      // Cleanup ghost element on unmount
      if (ghostElement.current && ghostElement.current.parentNode) {
        ghostElement.current.parentNode.removeChild(ghostElement.current);
      }
    };
  }, []);

  const handleDragStart = (e: React.DragEvent) => {
    if (!isDraggable) return;
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", index.toString());
    
    // Create custom drag image
    if (draggedElement.current) {
      const rect = draggedElement.current.getBoundingClientRect();
      const clone = draggedElement.current.cloneNode(true) as HTMLElement;
      clone.style.opacity = "0.8";
      clone.style.position = "absolute";
      clone.style.top = "-9999px";
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      document.body.appendChild(clone);
      e.dataTransfer.setDragImage(clone, rect.width / 2, rect.height / 2);
      setTimeout(() => document.body.removeChild(clone), 0);
    }
    
    onDragStart?.(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isDraggable) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDraggedOver(true);
    onDragOver?.(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Preveri, ali res zapuščamo element ali smo samo prešli čez notranje elemente
    const relatedTarget = e.relatedTarget as Node;
    if (draggedElement.current && relatedTarget && draggedElement.current.contains(relatedTarget)) {
      // Še vedno smo znotraj elementa, ne resetiraj
      return;
    }
    setIsDraggedOver(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isDraggable) return;
    e.preventDefault();
    setIsDraggedOver(false);
    setIsDragging(false);
    onDrop?.(index);
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isDraggable) return;
    setIsTouching(true);
    setIsDragging(true);
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    
    // Create ghost element for mobile
    if (draggedElement.current && !ghostElement.current) {
      const rect = draggedElement.current.getBoundingClientRect();
      const clone = draggedElement.current.cloneNode(true) as HTMLDivElement;
      clone.style.position = "fixed";
      clone.style.pointerEvents = "none";
      clone.style.zIndex = "9999";
      clone.style.opacity = "0.8";
      clone.style.transform = "scale(0.85)";
      clone.style.transition = "none";
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.left = `${touch.clientX - rect.width * 0.85 / 2}px`;
      clone.style.top = `${touch.clientY - rect.height * 0.85 / 2}px`;
      document.body.appendChild(clone);
      ghostElement.current = clone;
    }
    
    onDragStart?.(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggable || !isTouching) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    
    // Move ghost element
    if (ghostElement.current && draggedElement.current) {
      const rect = draggedElement.current.getBoundingClientRect();
      ghostElement.current.style.left = `${touch.clientX - rect.width * 0.85 / 2}px`;
      ghostElement.current.style.top = `${touch.clientY - rect.height * 0.85 / 2}px`;
    }
    
    // Highlight drop target
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    let targetElement = element;
    while (targetElement && !targetElement.hasAttribute('data-sequence-index')) {
      targetElement = targetElement.parentElement;
    }
    
    // Clear all highlights first
    document.querySelectorAll('[data-sequence-index]').forEach(el => {
      el.classList.remove('ring-4', 'ring-primary', 'scale-105');
    });
    
    // Add highlight to current target
    if (targetElement && targetElement !== draggedElement.current) {
      targetElement.classList.add('ring-4', 'ring-primary', 'scale-105');
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggable || !isTouching) return;
    setIsTouching(false);
    setIsDragging(false);
    
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Remove ghost element
    if (ghostElement.current && ghostElement.current.parentNode) {
      ghostElement.current.parentNode.removeChild(ghostElement.current);
      ghostElement.current = null;
    }
    
    // Clear all highlights
    document.querySelectorAll('[data-sequence-index]').forEach(el => {
      el.classList.remove('ring-4', 'ring-primary', 'scale-105');
    });
    
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
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`
        relative w-full aspect-square rounded-xl overflow-hidden
        ${isDraggable ? 'cursor-move touch-none' : 'cursor-default'}
        ${isDraggedOver && isDraggable ? 'ring-4 ring-primary scale-105 shadow-2xl' : ''}
        ${isDragging ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}
        ${isTarget ? 'border-4 border-primary shadow-lg' : 'border-2 border-border shadow-md'}
        ${!isDragging && isDraggable ? 'hover:scale-105 hover:shadow-xl' : ''}
        transition-all duration-300 ease-out bg-card
      `}
    >
      <img
        src={imageUrl}
        alt={image.word || 'Slika'}
        className={`w-full h-full object-cover transition-transform duration-300 ${
          isDragging ? 'scale-110' : 'scale-100'
        }`}
        draggable={false}
      />
      
      {/* Drop zone indicator */}
      {isDraggedOver && !isTarget && !isDragging && (
        <div className="absolute inset-0 rounded-xl border-4 border-primary bg-primary/10" />
      )}
      
      {/* Dragging indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center rounded-xl border-2 border-dashed border-primary/50">
          <div className="text-muted-foreground text-sm font-medium">Premikam...</div>
        </div>
      )}
    </div>
  );
};
