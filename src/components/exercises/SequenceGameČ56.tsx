import { SequenceGame56StorageBase } from "./SequenceGame56StorageBase";

interface SequenceGameČ56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameČ56 = ({ onGameComplete, isLandscape = false }: SequenceGameČ56Props) => {
  return (
    <SequenceGame56StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="Č"
    />
  );
};
