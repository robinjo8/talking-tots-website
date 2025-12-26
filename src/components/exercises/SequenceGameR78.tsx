import { SequenceGameStorageBase, SequenceGameStorageConfig } from "./SequenceGameStorageBase";

interface SequenceGameR78Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config78: SequenceGameStorageConfig = {
  imageCount: 5,
  countdownSeconds: 10,
  helpAttempts: 2,
  helpDuration: 5
};

export const SequenceGameR78 = ({ onGameComplete, isLandscape = false }: SequenceGameR78Props) => {
  return (
    <SequenceGameStorageBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      letter="R"
      config={config78}
    />
  );
};
