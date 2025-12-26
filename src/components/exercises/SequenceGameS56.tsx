import { SequenceGame56StorageBase } from "./SequenceGame56StorageBase";

interface SequenceGameS56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameS56 = ({ onGameComplete, isLandscape = false }: SequenceGameS56Props) => {
  return (
    <SequenceGame56StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="S"
    />
  );
};
