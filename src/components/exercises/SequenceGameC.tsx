import { SequenceGame34StorageBase } from "./SequenceGame34StorageBase";

interface SequenceGameCProps {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameC = ({ onGameComplete, isLandscape = false }: SequenceGameCProps) => {
  return (
    <SequenceGame34StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="C"
      imageCount={4}
    />
  );
};
