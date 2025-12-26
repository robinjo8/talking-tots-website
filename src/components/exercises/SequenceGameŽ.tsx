import { SequenceGame34StorageBase } from "./SequenceGame34StorageBase";

interface SequenceGameŽProps {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameŽ = ({ onGameComplete, isLandscape = false }: SequenceGameŽProps) => {
  return (
    <SequenceGame34StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="Ž"
      imageCount={4}
    />
  );
};
