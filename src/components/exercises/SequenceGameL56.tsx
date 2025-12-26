import { SequenceGame56StorageBase } from "./SequenceGame56StorageBase";

interface SequenceGameL56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameL56 = ({ onGameComplete, isLandscape = false }: SequenceGameL56Props) => {
  return (
    <SequenceGame56StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="L"
    />
  );
};
