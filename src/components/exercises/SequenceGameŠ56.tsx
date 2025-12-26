import { SequenceGame56StorageBase } from "./SequenceGame56StorageBase";

interface SequenceGameŠ56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameŠ56 = ({ onGameComplete, isLandscape = false }: SequenceGameŠ56Props) => {
  return (
    <SequenceGame56StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="Š"
    />
  );
};
