import { SequenceGame34StorageBase } from "./SequenceGame34StorageBase";

interface SequenceGameSProps {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameS = ({ onGameComplete, isLandscape = false }: SequenceGameSProps) => {
  return (
    <SequenceGame34StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="S"
      imageCount={4}
    />
  );
};
