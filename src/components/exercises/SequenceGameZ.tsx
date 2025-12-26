import { SequenceGame34StorageBase } from "./SequenceGame34StorageBase";

interface SequenceGameZProps {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameZ = ({ onGameComplete, isLandscape = false }: SequenceGameZProps) => {
  return (
    <SequenceGame34StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="Z"
      imageCount={4}
    />
  );
};
