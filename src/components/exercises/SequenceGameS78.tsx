import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameS78Props {
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

export const SequenceGameS78 = ({ onGameComplete, isLandscape = false }: SequenceGameS78Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_S"
      queryKey="memory_cards_S_78"
      config={config78}
    />
  );
};
