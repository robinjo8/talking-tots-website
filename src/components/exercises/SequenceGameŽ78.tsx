import { SequenceGameStorageBase, SequenceGameStorageConfig } from "./SequenceGameStorageBase";

interface SequenceGameŽ78Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config78: SequenceGameStorageConfig = {
  imageCount: 5,
  countdownSeconds: 10,
  helpAttempts: 2,
  helpDuration: 5
};

export const SequenceGameŽ78 = ({ onGameComplete, isLandscape = false }: SequenceGameŽ78Props) => {
  return (
    <SequenceGameStorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="Ž"
      config={config78}
    />
  );
};
