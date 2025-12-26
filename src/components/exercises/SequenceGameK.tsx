import { SequenceGame34StorageBase } from "./SequenceGame34StorageBase";

interface SequenceGameKProps {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameK = ({ onGameComplete, isLandscape = false }: SequenceGameKProps) => {
  return (
    <SequenceGame34StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="K"
      imageCount={4}
    />
  );
};
