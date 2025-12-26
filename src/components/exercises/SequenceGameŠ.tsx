import { SequenceGame34StorageBase } from "./SequenceGame34StorageBase";

interface SequenceGameŠProps {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameŠ = ({ onGameComplete, isLandscape = false }: SequenceGameŠProps) => {
  return (
    <SequenceGame34StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="Š"
      imageCount={4}
    />
  );
};
