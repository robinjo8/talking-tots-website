import { SequenceGame56StorageBase } from "./SequenceGame56StorageBase";

interface SequenceGameK56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameK56 = ({ onGameComplete, isLandscape = false }: SequenceGameK56Props) => {
  return (
    <SequenceGame56StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="K"
    />
  );
};
