import { SequenceGame34StorageBase } from "./SequenceGame34StorageBase";

interface SequenceGameČProps {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameČ = ({ onGameComplete, isLandscape = false }: SequenceGameČProps) => {
  return (
    <SequenceGame34StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="Č"
      imageCount={4}
    />
  );
};
