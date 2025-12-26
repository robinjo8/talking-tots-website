import { SequenceGameStorageBase, SequenceGameStorageConfig } from "./SequenceGameStorageBase";

interface SequenceGameL78Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config78: SequenceGameStorageConfig = {
  imageCount: 5,
  countdownSeconds: 10,
  helpAttempts: 2,
  helpDuration: 5
};

export const SequenceGameL78 = ({ onGameComplete, isLandscape = false }: SequenceGameL78Props) => {
  return (
    <SequenceGameStorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="L"
      config={config78}
    />
  );
};
