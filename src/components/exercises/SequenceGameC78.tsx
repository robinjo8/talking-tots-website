import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameC78Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config78: SequenceGameConfig = {
  imageCount: 5,
  countdownSeconds: 7,
  helpAttempts: 2,
  helpDuration: 5
};

export const SequenceGameC78 = ({ onGameComplete, isLandscape = false }: SequenceGameC78Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_c"
      queryKey="memory_cards_c_78"
      config={config78}
    />
  );
};
