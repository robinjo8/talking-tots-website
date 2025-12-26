import { SequenceGameStorageBase, SequenceGameStorageConfig } from "./SequenceGameStorageBase";

interface SequenceGameK78Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config78: SequenceGameStorageConfig = {
  imageCount: 5,
  countdownSeconds: 10,
  helpAttempts: 2,
  helpDuration: 5
};

export const SequenceGameK78 = ({ onGameComplete, isLandscape = false }: SequenceGameK78Props) => {
  return (
    <SequenceGameStorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="K"
      config={config78}
    />
  );
};
