import { SequenceGameBase, SequenceGameConfig } from "./SequenceGameBase";

interface SequenceGameČ910Props {
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

export const SequenceGameČ910 = ({ onGameComplete, isLandscape = false }: SequenceGameČ910Props) => {
  return (
    <SequenceGameBase
      onGameComplete={onGameComplete}
      isLandscape={isLandscape}
      tableName="memory_cards_Č"
      queryKey="memory_cards_Č_910"
      config={config910}
    />
  );
};
