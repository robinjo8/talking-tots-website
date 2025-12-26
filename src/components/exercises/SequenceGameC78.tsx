import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameC78Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config78: SequenceGameConfig = {
  imageCount: 5,
  preCountdownSeconds: 5,  // Red countdown before game starts
  countdownSeconds: 10,
  helpAttempts: 1,
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
