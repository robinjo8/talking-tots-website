import { SequenceGame56StorageBase } from "./SequenceGame56StorageBase";

interface SequenceGameZ56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameZ56 = ({ onGameComplete, isLandscape = false }: SequenceGameZ56Props) => {
  return (
    <SequenceGame56StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="Z"
    />
  );
};
