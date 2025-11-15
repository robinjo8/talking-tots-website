import { useState } from "react";
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
  const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/memory-game/${image.image_url}`;

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

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative w-full aspect-square rounded-lg overflow-hidden
        ${isDraggable ? 'cursor-move hover:scale-105' : 'cursor-default'}
        ${isDraggedOver && isDraggable ? 'ring-4 ring-primary' : ''}
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
      {!isTarget && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <p className="text-white text-center font-semibold text-sm">
            {image.word}
          </p>
        </div>
      )}
    </div>
  );
};
