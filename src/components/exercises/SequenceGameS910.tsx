import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameS910Props {
  onGameComplete: (images: any[]) => void;
  isLandscape?: boolean;
}

const config910: SequenceGameConfig = {
  imageCount: 5,
  preCountdownSeconds: 5,
  countdownSeconds: 7,
  helpAttempts: 1,
  helpDuration: 5
};

export const SequenceGameS910 = ({ onGameComplete, isLandscape = false }: SequenceGameS910Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_S"
      queryKey="memory_cards_S_910"
      config={config910}
    />
  );
};
