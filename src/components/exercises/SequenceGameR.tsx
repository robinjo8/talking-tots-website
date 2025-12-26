import { SequenceGame34StorageBase } from "./SequenceGame34StorageBase";

interface SequenceGameRProps {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameR = ({ onGameComplete, isLandscape = false }: SequenceGameRProps) => {
  return (
    <SequenceGame34StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="R"
      imageCount={4}
    />
  );
};
