import { SequenceGame34StorageBase } from "./SequenceGame34StorageBase";

interface SequenceGameLProps {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameL = ({ onGameComplete, isLandscape = false }: SequenceGameLProps) => {
  return (
    <SequenceGame34StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="L"
      imageCount={4}
    />
  );
};
