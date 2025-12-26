import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameČ78Props {
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

export const SequenceGameČ78 = ({ onGameComplete, isLandscape = false }: SequenceGameČ78Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_Č"
      queryKey="memory_cards_Č_78"
      config={config78}
    />
  );
};
