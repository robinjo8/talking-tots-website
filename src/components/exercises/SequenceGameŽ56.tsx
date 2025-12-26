import { SequenceGame56StorageBase } from "./SequenceGame56StorageBase";

interface SequenceGameŽ56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameŽ56 = ({ onGameComplete, isLandscape = false }: SequenceGameŽ56Props) => {
  return (
    <SequenceGame56StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="Ž"
    />
  );
};
