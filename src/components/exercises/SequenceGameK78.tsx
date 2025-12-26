import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameK78Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config78: SequenceGameConfig = {
  imageCount: 5,
  preCountdownSeconds: 5,
  countdownSeconds: 10,
  helpAttempts: 1,
  helpDuration: 5
};

export const SequenceGameK78 = ({ onGameComplete, isLandscape = false }: SequenceGameK78Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_K"
      queryKey="memory_cards_K_78"
      config={config78}
    />
  );
};
