import { SequenceGame56StorageBase } from "./SequenceGame56StorageBase";

interface SequenceGameR56Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

export const SequenceGameR56 = ({ onGameComplete, isLandscape = false }: SequenceGameR56Props) => {
  return (
    <SequenceGame56StorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="R"
    />
  );
};
