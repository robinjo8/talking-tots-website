import { SequenceGameStorageBase, SequenceGameStorageConfig } from "./SequenceGameStorageBase";

interface SequenceGameC78Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config78: SequenceGameStorageConfig = {
  imageCount: 5,
  countdownSeconds: 10,
  helpAttempts: 2,
  helpDuration: 5
};

export const SequenceGameC78 = ({ onGameComplete, isLandscape = false }: SequenceGameC78Props) => {
  return (
    <SequenceGameStorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="C"
      config={config78}
    />
  );
};
