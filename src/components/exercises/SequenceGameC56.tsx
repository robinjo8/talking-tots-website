import { SequenceGame56StorageBase } from "./SequenceGame56StorageBase";

interface SequenceGameC56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameC56 = ({ onGameComplete, isLandscape = false }: SequenceGameC56Props) => {
  return (
    <SequenceGame56StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="C"
    />
  );
};
